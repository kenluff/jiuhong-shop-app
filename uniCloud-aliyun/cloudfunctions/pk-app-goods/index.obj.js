const uniID = require('uni-id')
const createConfig = require('uni-config-center')
const uniPayConfig = createConfig({
	pluginId: 'uni-pay'
}).config()

const uniPay = require('uni-pay')
const pkAppUtil = uniCloud.importObject('pk-app-util')

const pkNotify = require('pk-pay-notify')
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
const db_cart = db.collection('pk-cart')
const db_goods = db.collection('pk-goods')
const db_goods_sku = db.collection('pk-goods-sku')
const db_order = db.collection('pk-order')
const db_order_log = db.collection('pk-order-log')
const db_user = db.collection('uni-id-users')
const db_goods_comment = db.collection('pk-goods-comment')
const db_goods_collect = db.collection('pk-goods-collect')
const db_user_coupon = db.collection('pk-user-coupon')

//生成订单号
function generateOrderNumber(uid,length=8){
	const now = new Date();
	let year=now.getFullYear().toString();
	let month = (now.getMonth() + 1).toString();
	let day = now.getDate().toString();
	let hour = now.getHours().toString();
	let minutes = now.getMinutes().toString();
	let seconds = now.getSeconds().toString();
	// 存放订单号
	let num = '';
	// N位随机数(加在时间戳后面)
	for (var i = 0; i < length; i++)
	{
		num += Math.floor(Math.random() * 10);
	}
	
	let last_str =  uid.replace(/[^\d]/g,'');
	let _last = last_str.substring(last_str.length-4)
	
	return year+month+day+num+_last;
}	


module.exports = {
	
	/**
	 * 加入购物车操作 
	 * @param {String} goods_id
	 * @param {Number} count
	 * @param {Object} sku
	 */
	addGoodsCart:async function( goods_id,count,sku=null,isInc=true ){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ) return { errCode:7000,errMsg:'请先登录'}
		let goodsRes = await db_goods.where({_id:goods_id}).get()
		if( goodsRes.data.length == 0 ) return { errCode:'error',errMsg:'不存在的商品'}
		let goods = goodsRes.data[0] ,goodsSku = null
		
		let _w = { uid:payload.uid,goods_id:goods_id }
		if( sku ){
			_w.sku_id = sku._id
			let skuRes = await db_goods_sku.where({goods_id,_id:sku._id}).get()
			if( skuRes.data.length == 0 ) return { errCode:'error',errMsg:'参数错误'}
			goodsSku = skuRes.data[0]
		}
		let cartRes = await db_cart.where(_w).get()
		
		if( cartRes.data.length == 0 ){
			let upData = {
				goods_id:goods_id,
				count:parseInt(count),
				uid:payload.uid,
				sku_id:sku?sku._id:'',
				sku:goodsSku,
				create_time:new Date().getTime(),
				goods:{
					name:goods.name,
					cover:goods.cover,
					price:goodsSku?goodsSku.price : goods.price,
				}
			}
			let res = await db_cart.add(upData)
			return res.id ? {errCode:0,errMsg:'success'} :{ errCode:'error',errMsg:'操作失败'}
		}
		let num = isInc ? dbCmd.inc(count) :count
		let res = await db_cart.doc(cartRes.data[0]._id).update({count:num})
		return res.updated ? {errCode:0,errMsg:'success'}:{ errCode:'error',errMsg:'操作失败'}
	},
	
	/**
	 * 获取用户购物车商品数量
	 */
	getCartCountBuyUser:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ) return { errCode:0,errMsg:'success',data:0}
		let res = await db_cart.where({uid:payload.uid}).count()
		return { errCode:0,errMsg:'success',data:res.total}
	},
	
	/**
	 * 获取用户购物车列表数据
	 * @param {Number} page
	 * @param {Number} limit
	 */
	getCaryListBuyUser:async function(page,limit){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		if( payload.code !=0 ) return { errCode:7000,errMsg:'请先登录'}
		
		let res = await db_cart.aggregate().lookup({
			from:'pk-goods',
			foreignField:'_id',
			localField:'goods_id',
			as:'goodsInfo'
		}).match({uid:payload.uid}).skip((page-1)*limit).limit(limit).end()
		
		let list = []
		res.data.forEach(item=>{
			let goodsInfo = {
				put_away:0,
				stock:0,
				price:0
			}
			item.has_stock = true
			if( item.goodsInfo.length >0 ){
				goodsInfo = {
					price:item.goodsInfo[0].price,
					put_away:item.goodsInfo[0].put_away,
					stock:item.goodsInfo[0].stock,
				}
				if( item.goodsInfo[0].is_open_sku == 1  && item.sku ){
					for (let i = 0; i < item.goodsInfo[0].sku.length; i++) {
						if( item.goodsInfo[0].sku[i].name == item.sku.name ){
							goodsInfo.stock = item.goodsInfo[0].sku[i].stock
							goodsInfo.price = item.goodsInfo[0].sku[i].price
							break
						}
					}
				}
			}
			list.push({
				_id:item._id,
				count:item.count,
				goods_id:item.goods_id,
				sku:item.sku,
				uid:item.uid,
				goods:item.goods,
				goodsInfo,
			})
		})
		return { errCode:0,errMsg:'success',data:list}
	},

	/**
	 * 删除购物车
	 * @param {Number} id
	 */
	deleteCart:async function(id){
		let res = await db_cart.doc(id).remove()
		return res.deleted ? {errCode:0,errMsg:'success'}:{errCode:'error',errMsg:'删除失败'}
	},
	
	/**
	 * 获取预订单信息
	 * @param {Object} param
	 */
	getPreviewOrder:async function(param){
		// const payload = await uniID.checkToken(this._event.uniIdToken) 
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ) return {errCode:7000,errMsg:'请先登录'}
		
		let preOrder = null , total_price = 0
		
		//直接购买
		if( param.buy_type == 1 ){
			let goodsRes = await db_goods.where({_id:param.goods_id}).get()
			let goods = goodsRes.data[0]
			if( parseInt(goods.stock) < param.count ){
				return { errCode:'error',errMsg:'库存不足'}
			}
			
			let goods_detail ={
				name:goods.name,
				cover:goods.cover,
				price:goods.price,
				count:parseInt(param.count),
				sku:null,
			}
			if( param.sku_id ){
				let skuRes = await db_goods_sku.where({_id:param.sku_id}).get()
				if( skuRes.data.length > 0 ){
					goods_detail.sku = skuRes.data[0]
					goods_detail.price = skuRes.data[0].price
				}
			}
			preOrder = {
				goods_detail:[goods_detail]
			}
			total_price = parseFloat(goods_detail.price) * goods_detail.count
		}
		
		//购物车结算
		if( param.buy_type == 2 ){
			let cartRes = await db_cart.where({_id:dbCmd.in(param.cart_id)}).get()
			if( cartRes.data.length == 0 ){
				return {errCode:'error',errMsg:'商品已不在购物车中...'}
			}
			preOrder = {goods_detail:[]}
			cartRes.data.forEach(item=>{
				let goods_detail ={
					...item.goods,
					count:parseInt(item.count),
					sku:item.sku,
					sku_id:item.sku_id
				}
				if( item.sku ){
					total_price += parseFloat(item.sku.price)*item.count
				}else{
					total_price += parseFloat(item.goods.price)*item.count
				}
				preOrder.goods_detail.push(goods_detail)
			})
		}
		
		//查询当前用户是否存在可用的优惠券
		nowTime = new Date().getTime()
		let couponRes =await db_user_coupon.where({
			uid:payload.uid,
			coupon_info:{
				low_price:dbCmd.lt(parseFloat(total_price)),
				// start_time:dbCmd.lt(nowTime),
				end_time:dbCmd.gt(nowTime),
			},
			
		}).get()
		return { errCode:0,errMsg:'success',data:{
			preOrder:preOrder,
			total_price:parseFloat(total_price).toFixed(2) ,
			coupon:couponRes.data,
		}}
	},
	
	/**
	 * 创建订单
	 * @param {Object} param
	 */
	createOrder:async function(param){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ) return {errCode:7000,errMsg:'请先登录'}
		if( !param.address ) return { errCode:'error',errMsg:'请填写收货地址'}
		let addOrder = null
		let userRes = await db.collection('uni-id-users').doc(payload.uid).get()
		
		//查询是否有优惠券信息
		let coupon = null
		if( param.coupon_id ){
			let couponRes = await db_user_coupon.where({_id:param.coupon_id}).get()
			if( couponRes.data.length ==0 ){
				return { errCode:'error',errMsg:'不存在的优惠券'}
			}
			
			coupon ={
				coupon_id:couponRes.data[0]._id,
				_id:couponRes.data[0]._id,
				...couponRes.data[0].coupon_info
			}
		}
		
		if( param.buy_type == 1 ){
			let goodsRes = await db_goods.where({_id:param.goods_id}).get()
			let goods = goodsRes.data[0]
			let { cover,price } = goods  , goodsSku = null
			
			if( goods.is_open_sku == 1 ){
				if( !param.sku_id ) return { errCode:'error',errMsg:'参数错误'}
				let skuRes = await db_goods_sku.where({_id:param.sku_id}).get()
				if( skuRes.data.length == 0 ) return { errCode:'error',errMsg:'参数错误'}
				goodsSku = skuRes.data[0]
				
				if( goodsSku.stock < param.count ){
					return { errCode:'error',errMsg:'库存不足'}
				}
				if( goodsSku.cover ) cover = goodsSku.cover 
				price = parseFloat(goodsSku.price)
			}else{
				if( goods.stock <param.count ){
					return { errCode:'error',errMsg:'库存不足'}
				}
			}
			let final_price = parseFloat(param.count * price)
			
			if( coupon ){
				final_price = final_price-coupon.coupon_price
			}
			
			addOrder = {
				order_number:generateOrderNumber(payload.uid),
				uid:payload.uid,
				total_price:parseFloat(final_price).toFixed(2),
				goods_detail:[{
					goods_id:goods._id,
					name:goods.name,
					cover:cover,
					price:parseFloat(price).toFixed(2),
					count:parseInt(param.count),
					sku:goodsSku
				}],
				order_status:0,
				remark:param.remark,
				address:param.address,
				coupon_info:coupon,
				create_time:new Date().getTime()
			}
			
			
			//分销信息
			if( goods.is_open_distribution == 1 ){
				//商品金额
				let goodsPirce = parseFloat(param.count * price)
				if( userRes.data[0].one_user ){
					addOrder.is_dis_order = 1
					addOrder.dis_grant = 0
					addOrder.one_price = {
						uid:userRes.data[0].one_user,
						money:goods.commission_type == 1 ? goods.one_commission: parseFloat(goodsPirce*(parseFloat(goods.one_commission)/100)).toFixed(2)
					}
				}
				if( userRes.data[0].two_user ){
					addOrder.is_dis_order = 1
					addOrder.dis_grant = 0
					addOrder.two_price = {
						uid:userRes.data[0].two_user,
						money:goods.commission_type == 1 ? goods.two_commission: parseFloat(goodsPirce*(parseFloat(goods.two_commission)/100)).toFixed(2)
					}
				}
			}
		}
		
		if( param.buy_type == 2 ){
			let goods_detail = []
			let cartRes = await db_cart.aggregate().lookup(
				{
					from:"pk-goods",
					foreignField:'_id',
					localField:"goods_id",
					as:'goodsInfo'
				}
			).lookup({
				from:"pk-goods-sku",
				foreignField:'_id',
				localField:"sku_id",
				as:'skuInfo'
			}).match({_id:dbCmd.in(param.cart_id)}).end()
			
			let cart = cartRes.data , flag = false , errMsg='' , total_price = 0
			let one_money = 0, two_money = 0	//分销金额叠加
			for (var i = 0; i < cart.length; i++) {
				let goods =  cart[i].goodsInfo[0]
				let sku = cart[i].skuInfo.length > 0 ? cart[i].skuInfo[0]:null
				
				//判断当前商品库存是否充足
				if( (sku && sku.stock< cart[i].count) || (!sku && goods.stcok<cart[i].count) ){
					flag = true
					errMsg = cart[i].goods+'商品库存不足'
					break
				}
				let price = sku?sku.price:goods.price
				goods_detail.push({
					goods_id:cart[i].goods_id,
					name:cart[i].goods.name,
					cover:cart[i].goods.cover,
					price:parseFloat(price).toFixed(2),
					count:parseInt(cart[i].count),
					sku:sku,
				})
				total_price+= parseFloat(price)*cart[i].count
				
				if( goods.is_open_distribution == 1){
					one_money += goods.commission_type == 1 ?parseFloat( goods.one_commission): parseFloat(price*(parseFloat(goods.one_commission)/100)).toFixed(2)
					two_money += goods.commission_type == 1 ?parseFloat( goods.two_commission): parseFloat(price*(parseFloat(goods.two_commission)/100)).toFixed(2)
				}
				
			}
			if( flag ){
				return {errCode:'error',errMsg:errMsg}
			}
			
			if( coupon ){
				total_price = total_price-coupon.coupon_price
			}
			
			addOrder = {
				order_number:generateOrderNumber(payload.uid),
				uid:payload.uid,
				total_price:parseFloat(total_price).toFixed(2),
				goods_detail:goods_detail,
				order_status:0,
				remark:param.remark,
				address:param.address,
				coupon_info:coupon,
				create_time:new Date().getTime()
			}
			
			if( userRes.data[0].one_user ){
				addOrder.is_dis_order = 1
				addOrder.dis_grant = 0
				addOrder.one_price = {
					uid:userRes.data[0].one_user,
					money:one_money
				}
			}
			if( userRes.data[0].two_user ){
				addOrder.is_dis_order = 1
				addOrder.dis_grant = 0
				addOrder.two_price = {
					uid:userRes.data[0].two_user,
					money:two_money
				}
			}
		}
		
		if( parseFloat(addOrder.total_price) <0 ){
			return { errCode:'error',errMsg:'订单金额不能小于0'}
		}
		
		let res = await db_order.add(addOrder)
		
		if( res.id ){
			await db_order_log.add({
				order_id:res.id,
				content:'订单创建成功，订单编号：'+addOrder.order_number,
				create_time:new Date().getTime(),
			})
			if( param.coupon_id ){
				await db_user_coupon.doc(param.coupon_id).update({is_use:1})
			}
			
			//清除购物车数据
			if( param.buy_type == 2){
				await db_cart.where({_id:dbCmd.in(param.cart_id)}).remove()
			}
			
			await pkAppUtil.setTotal('order',1)
			
			return {errCode:0,errMsg:'success',data:res.id}
		}
		return {errCode:'error',errMsg:'订单创建失败'}
	},
	
	/**
	 * 检测订单是否还可以支付
	 * @param {Object} order_id
	 */
	checkOrderIsPay:async function(order_id){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let orderRes = await db_order.where({_id:order_id}).get()
		let order = orderRes.data[0]
		if( order.is_cancel && order.is_cancel == 1){
			return { errCode:'error',errMsg:'该订单已取消'}
		}
		let flag = false,errMsg= ''
		for (var i = 0; i < order.goods_detail.length; i++) {
			let goodsRes = await db_goods.where({_id:order.goods_detail[i].goods_id}).get()
			if( goodsRes.data.length == 0 ){
				flag = true
				errMsg = '商品已不存在'
				break
			}
			if( goodsRes.data[0].put_away !=1 ){
				flag = true
				errMsg = '商品规格已下架'
				break
			}
			if(  goodsRes.data[0].is_open_sku == 1){
				let skuRes = await db_goods_sku.where({_id:order.goods_detail[i].sku._id}).get()
				if( skuRes.data.length == 0){
					flag = true
					errMsg = '商品规格已不存在'
					break
				}
				if( skuRes.data[0].stcok < order.goods_detail[i].count ){
					flag = true
					errMsg = '商品库存不足'
					break
				}
			}else{
				if( goodsRes.data[0].stock < order.goods_detail[i].count ){
					flag = true
					errMsg = '商品库存不足'
					break
				}
			}
		}
		return flag ? {errCode:'error',errMsg:errMsg}:{errCode:0,errMsg:'success'}
	},
	
	/**
	 * 余额支付
	 * @param {Object} param
	 */
	balancePay:async function(param){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		if( param.password == '' || !param.password){
			return { errCode:'error',errMsg:'请输入支付密码'}
		}
		
		let bankData = await db_user.where({_id:payload.uid}).get()
		
		if( bankData.data[0].pay_password != param.password ){
			return { errCode:'error',errMsg:'支付密码错误，请重试！'}
		}
		
		let orderRes = await db_order.where({_id:param.order_id}).get()
		if( orderRes.data.length ==0 ) {
			return {errCode:'error',errMsg:'不存在的订单数据'}
		}
		if( orderRes.data[0].is_cancel == 1 ){
			return {errCode:'error',errMsg:'订单已取消'}
		}
		
		if( bankData.data[0].money <(parseFloat(orderRes.data[0].total_price)*100)){
			return {errCode:'error',errMsg:'余额不足'}
		}
		
		let res = await pkNotify({
			outTradeNo:orderRes.data[0].order_number,
			pay_method:param.pay_method,
			total_fee:parseInt(parseFloat(orderRes.data[0].total_price)*100),
			transaction_id:"",
			scene:'buyGoods'
		})
		console.log('res',res);
		
		if( res.errCode == 0 ){
			await pkAppUtil.setTotal('pay_order',1)
			await pkAppUtil.setTotal('trade',parseInt(parseFloat(orderRes.data[0].total_price)*100))
		}
		
		return res
	},
	
	orderPay:async function(id,pay_method){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		
		let orderRes = await db_order.where({_id:id}).get()
		if( orderRes.data.length ==0 ) {
			return {errCode:'error',errMsg:'不存在的订单数据'}
		}
		if( orderRes.data[0].is_cancel == 1 ){
			return {errCode:'error',errMsg:'订单已取消'}
		}
		
		const userList = await db.collection('uni-id-users').where({
			_id: payload.uid
		}).get()
		let orderInfo = null , uniPayInstance =null , tradeType ='' , openid = ''
		
		console.log("-----",uniPayConfig.wxConfigMp);
		// switch (pay_method + '_' + this._context.PLATFORM) {
		const clientInfo = this.getClientInfo()
		console.log('clientInfo',clientInfo);
		switch (pay_method + '_' + clientInfo.platform) {
			case 'wxpay_mp-weixin':
				uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigMp)
				openid = userList.data[0].wx_openid.['mp-weixin']
				console.log('openid',userList)
				tradeType = 'JSAPI'
				break;
			case 'alipay_mp-alipay':
				uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigMp)
				openid = userList.data[0].ali_openid
				break;
			case 'wxpay_app-plus':
				uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigApp)
				tradeType = 'APP'
				break;
			case 'alipay_app-plus':
				uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigApp)
				break;
			case 'wxpay_h5':
				uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigH5)
				tradeType = 'NATIVE'
				break;
			case 'alipay_h5':
				uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigApp)
				tradeType = 'NATIVE'
				break;
			default:
				return {
					code: -1,
					msg: '参数错误'
				}
		}
		
		try {
			const clientInfo = this.getClientInfo()
			// let notifyUrl = uniPayConfig.wxConfigMp.notifyUrl+'/'+pay_method+'_'+this._context.PLATFORM+'__buyGoods'
			let notifyUrl = uniPayConfig.wxConfigMp.notifyUrl+'/'+pay_method+'_'+clientInfo.platform+'__buyGoods'
			// 获取支付信息
			orderInfo = await uniPayInstance.getOrderInfo({
				openid:openid, 
				outTradeNo:orderRes.data[0].order_number,
				totalFee:parseInt(parseFloat(orderRes.data[0].total_price)*100),
				subject: "购买商品",
				body: "购买"+orderRes.data[0].goods_detail[0].name+'等商品',
				notifyUrl: notifyUrl,
				tradeType:tradeType,
			})
		} catch (e) {
			return {
				errCode: -3,
				errMsg: e.errMsg
			}
		}
	},
	
	
	/**
	 * 获取订单列表
	 * @param {Number} page
	 * @param {Number} limit
	 * @param {Object} extra
	 */
	getOrderList:async function(page,limit,extra){
		// let payload =await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let _w = {uid:payload.uid ,is_delete:dbCmd.neq(1)}
		if( extra && extra.status >-1 ){
			_w.order_status = extra.status
		}
		let res = await db_order.where(_w)
			.skip((page-1)*limit)
			.limit(limit)
			.orderBy("create_time",'desc')
			.get()
		return { errCode:0,errMsg:'success',data:res.data}
	},
	
	getOrderDetail : async function(id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let res = await db_order.where({uid:payload.uid,_id:id}).get()
		if( res.data.length == 0 ) {
			return { errCode:'error',errMsg:'订单不存在'}
		}
		let returnData = {
			...res.data[0],
		}
		return { errCode:0,errMsg:'success',data:returnData }
	},
	
	cancelOrder :async function(id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		
		let orderRes = await db_order.where({_id:id,uid:payload.uid}).update({
			is_cancel:1,
			cancel_time:new Date().getTime(),
			order_status:4
		})
		db_order_log.add({
			order_id:id,
			content:'用户取消订单',
			create_time:new Date().getTime(),
		})
		
		if( orderRes.updated  ){
			return {errCode:0,errMsg:'success'}
		}
		return { errCode:'error',errMsg:'订单取消失败'}
	},
	
	/**
	 * 确认收货
	 * @param {String} order_id
	 */
	confirmOrder :async function( order_id ){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let orderData = await db_order.where({_id:order_id,uid:payload.uid}).get()
		
		let orderRes = await db_order.doc(order_id).update({
			is_confirm:1,
			confirm_time:new Date().getTime(),
			order_status:3
		})
	
		db_order_log.add({
			order_id:order_id,
			content:'订单确认收货(用户确认)',
			create_time:new Date().getTime(),
		})
		
		if( orderRes.updated ){
			
			//订单完成,商品结算
			if( orderData.data[0].is_dis_order == 1 && !orderData.data[0].dis_grant ){
				let order= orderData.data[0]
				if( order.one_price.money && order.one_price.uid){
					await db.collection('pk-dis-user').where({uid:order.one_price.uid}).update({
						money:dbCmd.inc(parseInt(parseFloat(order.one_price.money)*100)),
						total_money:dbCmd.inc(parseInt(parseFloat(order.one_price.money)*100)),
						frozen_money:dbCmd.inc(-parseInt(parseFloat(order.one_price.money)*100))
					})
					await db.collection('pk-dis-money-log').add({
						uid:order.one_price.uid,
						count:order.one_price.money,
						type:1,
						remark:`订单${order.order_number}订单结算`,
						create_time:new Date().getTime()
					})
				}
				if( order.two_price.money && order.two_price.uid){
					await db.collection('pk-dis-user').where({uid:order.two_price.uid}).update({
						money:dbCmd.inc(parseInt(parseFloat(order.two_price.money)*100)),
						total_money:dbCmd.inc(parseInt(parseFloat(order.two_price.money)*100)),
						frozen_money:dbCmd.inc(-parseInt(parseFloat(order.two_price.money)*100))
					})
					await db.collection('pk-dis-money-log').add({
						uid:order.two_price.uid,
						count:order.two_price.money,
						type:1,
						remark:`订单${order.order_number}订单结算`,
						create_time:new Date().getTime()
					})
				}
				await db_order.doc(order_id).update({dis_grant:1})
			}
			
			return { errCode:0,errMsg:'success'}
		}
		return { errCode:'error',errMsg:'确认收货失败'}
	},
	
	/**
	 * 申请退款操作
	 * @param {String} order_id
	 */
	applyRefundOrder : async function(order_id,reason){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let orderRes = await db_order.where({_id:order_id,uid:payload.uid}).update({
			is_refund:1,
			refund_time:new Date().getTime(),
			order_status:5,
			refund_reason:reason
		})
		db_order_log.add({
			order_id:order_id,
			content:'订单发起退款申请，退款原因：'+reason,
			create_time:new Date().getTime(),
		})
		return orderRes.updated ? { errCode:0,errMsg:'success'}:{errCode:'error',errMsg:'申请提交失败'}
	},
	
	/**
	 * 取消退款申请操作
	 * @param {Number} order_id
	 */
	cancelRefundOrder : async function( order_id ){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let orderRes = await db_order.where({_id:order_id,uid:payload.uid}).update({
			is_refund:0,
			order_status:1
		})
		db_order_log.add({
			order_id:order_id,
			content:'用户取消退款申请',
			create_time:new Date().getTime(),
		})
		return orderRes.updated ? { errCode:0,errMsg:'success'}:{errCode:'error',errMsg:'取消失败'}
	},
	
	/**
	 * 删除订单
	 * @param {String} order_id
	 */
	deleteOrder:async function(order_id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let orderRes = await db_order.where({_id:order_id,uid:payload.uid}).update({
			is_delete:1
		})
		db_order_log.add({
			order_id:order_id,
			content:'用户删除订单',
			create_time:new Date().getTime(),
		})
		return orderRes.updated ? { errCode:0,errMsg:'success'}:{errCode:'error',errMsg:'删除失败'} 
	},
	
	/**
	 * 商品评论
	 * @param {String} order_id
	 * @param {Array} comment
	 */
	goodsComment:async function(order_id,comment){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let userInfo = payload.userInfo
		let user = {
			avatar:userInfo.avatar_file ?userInfo.avatar_file.url:'',
			nickname:userInfo.nickname || userInfo.username || userInfo.mobile,
		}
		
		let addData = []
		comment.forEach(item=>{
			addData.push({
				order_id:order_id,
				goods_id:item.goods_id,
				uid:payload.uid,
				user:user,
				score:parseInt(item.score),
				content:item.content,
				images:item.images,
				create_time:new Date().getTime()
			})
		})
		
		let res = await db_goods_comment.add(addData)
		let updateRes = await db_order.doc(order_id).update({
			is_comment:1
		})
		
		if( res.inserted && updateRes.updated ){
			return { errCode:0,errMsg:'评论成功'}
		}
		return { errCode:'error',errMsg:'评论失败'}
	},
	
	/**
	 * 获取评论列表
	 * @param {Number} page
	 * @param {Number} limit
	 * @param {Object} extra
	 */
	getCommentByGoods:async function(page,limit,extra){
		let _where = {}
		if( extra ){
			if( extra.goods_id ) _where.goods_id = extra.goods_id
		}
		let res = await db_goods_comment.where(_where)
			.orderBy("create_time",'desc')
			.skip((page-1)*limit)
			.limit(limit)
			.get()
		return { errCode:0,errMsg:'success',data:{list:res.data}}
	},
	
	/**
	 * 商品收藏
	 * @param {String} goods_id
	 */
	collectGoods:async function(goods_id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		
		let goods = await db_goods.where({_id:goods_id}).get()
		if( goods.data.length == 0) {
			return { errCode:'error',errMsg:'商品不存在'}
		}
		let collectRes = await db_goods_collect.where({uid:payload.uid,goods_id}).get()
			
		if( collectRes.data.length == 0 ){
			let addCollect ={
				uid:payload.uid,
				goods_id:goods_id,
				goods:{
					name:goods.data[0].name,
					cover:goods.data[0].cover,
					price:goods.data[0].price,
				},
				create_time:new Date().getTime()
			} 
			let res =await db_goods_collect.add(addCollect)
			return res.id ? {errCode:0,errMsg:'收藏成功'}:{errCode:'error',errMsg:'收藏失败'}
		}
			
		let res = await db_goods_collect.where({uid:payload.uid,goods_id:goods_id}).remove()
		return res.deleted ? { errCode:0,errMsg:'已取消收藏'}:{errCode:'error',errMsg:'取消失败'}
	},
	
	/**
	 * 检测商品是否被当前登录用户收藏
	 * @param {String} goods_id
	 */
	checkGoodsCollect:async function(goods_id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		let collectRes = await db_goods_collect.where({uid:payload.uid,goods_id}).get()
		return { errCode:0,errMsg:'success',data:collectRes.data.length != 0 }
	},
	
	/**
	 * 获取商品收藏列表
	 * @param {Number} page
	 * @param {Number} limit
	 */
	getCollectGoods:async function(page,limit){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		if( payload.code >0 ){
			return {errCode:7000,errMsg:'请先登录'}
		}
		
		let res = await db_goods_collect.aggregate().lookup({
			from:'pk-goods',
			foreignField:'_id',
			localField:"goods_id",
			as:'goodsInfo'
		}).sort({'create_time':-1})
			.match({uid:payload.uid})
			.skip((page-1)*limit)
			.limit(limit).end()
			
		let list = []
		res.data.forEach(item=>{
			let goodsInfo = item.goodsInfo.length >0 ? item.goodsInfo[0]:null
			list.push({
				...item,
				goodsInfo
			})
		})
		return { errCode:0,errMsg:'success',data:list}
	},
	
	/**
	 * 物流查询
	 * @param {Object} data
	 */
	getLogistics:async function(data){
		let setData = await db.collection('pk-set').where({key:'logistic_kdniao_posturl'}).get()
		let apiUrl = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json'
		if( setData.data.length >0 ){
			apiUrl = setData.data[0].value
		}
		
		data.DataSign = Buffer.from(data.DataSign).toString('base64')
		
		const res = await uniCloud.httpclient.request(apiUrl, {
		    method: 'POST',
		    data: data,
		    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
		    dataType: 'json'
		})
		if( res.data.Success === false ){
			return {errCode:'error',errMsg:res.data.Reason}
		}
		let list = res.data.Data[0].Traces
		
		return {errCode:0,errMsg:'success',data:list}
	}
}
