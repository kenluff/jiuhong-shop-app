const db = uniCloud.database()
const dbCmd = db.command
const db_order =db.collection('pk-order')
module.exports = async function(e) {
	
	//商品购买
	if( e.scene === 'buyGoods'){
		let orderRes = await db_order.where({order_number:e.outTradeNo}).get()
		let orderData = orderRes.data[0] , order_id = orderRes.data[0]._id
		
		let userData = await db.collection('uni-id-users').doc(orderData.uid).get()
		
		const tran = await db.startTransaction()
			
		//修改订单支付状态
		let updateRes = await tran.collection('pk-order').doc(order_id).update({
			order_status:1,
			is_pay:1,
			pay_time:new Date().getTime(),
			pay_method:e.pay_method,
			total_price:parseFloat(e.total_fee/100).toFixed(2),
			uniontid:e.transaction_id || ''
		})
		
		let logRes = await tran.collection('pk-order-log').add({
			order_id:order_id,
			content:"订单支付成功，订单编号："+e.outTradeNo,
			create_time:new Date().getTime()
		})
		
		if( !updateRes.updated || !logRes.id ) {
			await tran.rollback(-100)
			return {errCode:"error",errMsg:'支付失败'}
		}
		
		//修改订单商品库存销量
		let remark_log = '' 
		for (let j = 0; j < orderData.goods_detail.length; j++) {
			remark_log+=orderData.goods_detail[j].name
			if( orderData.goods_detail[j].sku ){
				db.collection('pk-goods').doc(orderData.goods_detail[j].goods_id).update({
					sale_count:dbCmd.inc(parseInt(orderData.goods_detail[j].count))
				})
				db.collection('pk-goods-sku').doc(orderData.goods_detail[j].sku._id).update({
					stock:dbCmd.inc(-parseInt(orderData.goods_detail[j].count))
				})
			}else{
				let updateParam = {
					stock:dbCmd.inc(-parseInt(orderData.goods_detail[j].count)),
					sale_count:dbCmd.inc(parseInt(orderData.goods_detail[j].count))
				}
				db.collection('pk-goods').doc(orderData.goods_detail[j].goods_id).update(updateParam)
			}
		}
		
		//-----余额支付 修改用户余额-----
		if( e.pay_method == 'balance_pay'){
			let bankRes = await tran.collection('uni-id-users')
				.doc(orderData.uid)
				.update({
					money:dbCmd.inc(-e.total_fee),
					cost_total:dbCmd.inc(parseInt(e.total_fee)),
					order_total:dbCmd.inc(1)
				})
			console.log('bankRes',bankRes);
			let bankLog = {
				uid:orderData.uid,
				remark:'购买'+remark_log+'商品',
				create_time:new Date().getTime(),
				type:2,
				count:parseFloat(e.total_fee/100).toFixed(2),
			}
			let logRes = await tran.collection('pk-money-log').add(bankLog)
			if( !bankRes.updated  || !logRes.id ){
				await tran.rollback(-100)
				return {errCode:"error",errMsg:'支付失败'}
			}
		}
		
		//-----判断订单是否为分销订单，分销订单需要设置分销商资金信息-------
		if( orderData.is_dis_order == 1 ){
			if( orderData.one_price && orderData.one_price.money && orderData.one_price.uid){
				let dis = await db.collection('pk-dis-user').where({uid:orderData.one_price.uid}).update({
					frozen_money:dbCmd.inc(parseInt(parseFloat(orderData.one_price.money)*100)),
					total_order:dbCmd.inc(1)
				})
			}
			if( orderData.two_price && orderData.two_price.money && orderData.two_price.uid){
				let dis = await db.collection('pk-dis-user').where({uid:orderData.two_price.uid}).update({
					frozen_money:dbCmd.inc(parseInt(parseFloat(orderData.two_price.money)*100)),
					total_order:dbCmd.inc(1)
				})
			}
		}
		
		await tran.commit()
		return {errCode:0,errMsg:'success'}
	}
	
	//余额充值
	if( e.scene === 'recharge'){
		
		let orderRes = await db.collection('pk-recharge-order')
			.where({order_number:e.outTradeNo}).get()
		if( orderRes.data.length ==0 ) {
			return {errCode:"error",errMsg:'不存在的订单信息11'}
		}
		
		let orderData = orderRes.data[0] , order_id = orderRes.data[0]._id
		if( orderData.order_status == 1 && orderData.pay_time ) {
			return {errCode: 0,errMsg: 'success'}
		}
		
		//修改订单信息，增加余额 增加记录
		const tran = await db.startTransaction()
		//修改订单支付状态
		let updateRes = await tran.collection('pk-recharge-order').doc(order_id).update({
			order_status:1,
			pay_time:new Date().getTime(),
			pay_method:e.pay_method,
			total_fee:parseFloat(e.total_fee/100).toFixed(2),
			uniontid:e.transaction_id || ''
		})
		
		let totalPrice = parseFloat(orderData.price)+parseFloat(orderData.send_price)
		
		if( !updateRes.updated ) {
			await tran.rollback(-100)
			return {errCode:"error",errMsg:'支付失败'}
		}
		
		let bankRes = await tran.collection('uni-id-users')
			.doc(orderData.uid)
			.update({money:dbCmd.inc(parseInt(totalPrice*100))})
		
		let remark = `余额充值${orderData.price}元`
		if( orderData.send_price ){
			remark+= `赠送${orderData.send_price}元`
		}
		
		let bankLog = {
			uid:orderData.uid,
			remark:remark,
			create_time:new Date().getTime(),
			type:1,
			count:parseFloat(totalPrice).toFixed(2),
		}
		let logRes = await tran.collection('pk-money-log').add(bankLog)
		if( !bankRes.updated  || !logRes.id ){
			await tran.rollback(-100)
			return {errCode:"error",errMsg:'支付失败'}
		}
		
		await tran.commit()
		return {errCode:0,errMsg:'success'}
	}
	
}
