const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command

const db_sign = db.collection('opendb-sign-in')
const pkAppCommon = uniCloud.importObject('pk-app-common')

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
	
	getUserSign:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let date = new Date(new Date().toLocaleDateString()).getTime()
		
		//今日是否签到
		let { total } = await db_sign.where({
			user_id:payload.uid,
			date:date,
			isDelete: false
		}).count()
		
		//连续签到天数
		let {total:allTotal} = await db_sign.where({
			user_id:payload.uid,
			isDelete: false
		}).count()
		let signData = [] ,nextScore = 0	//明日签到获得积分
		
		let configSet = await pkAppCommon.getSet(['integral_sign_rule','integral_sign_desc'])
		if( !configSet.data.integral_sign_rule ){
			signData = [
				{day:1,score:1,sign:false},
				{day:2,score:2,sign:false},
				{day:3,score:3,sign:false},
				{day:4,score:4,sign:false},
				{day:5,score:5,sign:false},
				{day:6,score:6,sign:false},
				{day:7,score:7,sign:false},
			]
		}else{
			configSet.data.integral_sign_rule.forEach(item=>{
				signData.push({...item,sign:false})
			})
		}
		
		
		for (var i = 0; i < signData.length; i++) {
			if( signData[i].day <= allTotal ){
				signData[i].sign = true
			}
			if( allTotal == 7 ){
				nextScore = signData[i].score
			}else{
				if( signData[i].day == allTotal ){
					nextScore =  signData[i+1].score
				}
			}
		}
		
		return { errCode:0,errMsg:'success',data:{
			sign:total?true:false,
			signData,
			signTotal:allTotal,
			total,
			date,
			integral_sign_desc:configSet.data.integral_sign_desc,
			nextScore
		}}
	},
	
	userSign:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let date = new Date(new Date().toLocaleDateString()).getTime()
		
		let signData = [
			{day:1,score:10},
			{day:2,score:20},
			{day:3,score:30},
			{day:4,score:40},
			{day:5,score:50},
			{day:6,score:60},
			{day:7,score:70},
		]
		
		let { total } = await db_sign.where({
			user_id:payload.uid,
			date:date,
			isDelete: false
		}).count()
		
		if( total){
			return {errCode:0,errMsg:'今日已签到'}
		}
		
		await db_sign.add({
			ip:'',
			date,
			user_id:payload.uid,
			create_time:new Date().getTime(),
			isDelete:false,
		})
		
		
		//查最近7天的签到情况
		let {
			data: signInData
		} = await db_sign.where({
			user_id:payload.uid,
			isDelete: false
		}).get()
		
		let allDate = signInData.map(item => item.date)
		
		//今天是本轮签到的第几天
		const n = (date - Math.min(...allDate)) / 3600 / 24 / 1000 + 1;
		
		if (n == 7+1) { //如果已经满一轮就软删除之前的内容
			await db_sign.where({
				user_id:payload.uid,
				date: dbCmd.neq(date)
			}).update({
				isDelete: true
			})
		}
		
		//查询当前用户的积分
		let userScore = await db.collection('uni-id-users').doc(payload.uid).get()
		let score = 0
		if( userScore.data[0].score ){
			score = parseInt(userScore.data[0].score)
		}
		
		let addScore = 0
		for (var i = 0; i < signData.length; i++) {
			if(signData[i].day == n ){
				addScore = parseInt(signData[i].score)
			}
		}
		
		let updateUser = await db.collection('uni-id-users').doc(payload.uid).update({
			score:dbCmd.inc(addScore)
		})
		
		let addScores = await db.collection('uni-id-scores').add({
			user_id:payload.uid,
			balance:score+addScore,
			score:addScore,
			type: 1,
			create_time: new Date().getTime(),
			comment:'签到获取积分'
		})
		return { errCode:0,errMsg:'签到成功'}
	},
	
	/**
	 * 获取积分商品列表
	 * @param {Object} param
	 */
	getIntegralGoods:async function(param){
		let { page,limit,search } = param
		let res = null ,_where = {}
		
		if( search ){
			if( search.type ) _where.type = search.type
		}
		
		if(search && search.hot ){
			res = await db.collection('pk-integral-goods')
				.orderBy("rank",'asc')
				.orderBy('sale_count','desc')
				.where(_where)
				.skip((page-1)*limit)
				.limit(limit)
				.get()
		}else{
			res = await db.collection('pk-integral-goods')
				.orderBy("rank",'asc')
				.where(_where)
				.skip((page-1)*limit)
				.limit(limit)
				.get()
		}
		
		return {errCode:0,errMsg:'success',data:res.data}
	},
	
	/**
	 * 获取商品详细信息
	 * @param {Object} param
	 */
	getIntegralGoodsDetail:async function(id){
		if( !id ) return { errCode:'error',errMsg:'参数错误'}
		let res = await db.collection('pk-integral-goods').doc(id).get()
		
		return {errCode:0,errMsg:'success',data:res.data[0]}
	},
	
	/**
	 * 商品兑换
	 * @param {Object} param
	 */
	exchangeGoods:async function(param){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( !payload.uid ){
			return {errCode:0,code:7000,errMsg:'请先登录'}
		}
		
		let goodsRes = await db.collection('pk-integral-goods').doc(param.goods_id).get()
		if( goodsRes.data.length == 0 ){
			return { errCode:0,code:1001,errMsg:'商品不存在'}
		}
		let goods = goodsRes.data[0]
		
		let userRes = await db.collection('uni-id-users').doc(payload.uid).get()
		if( parseInt(userRes.data[0].score) < parseInt(goods.score) ){
			return { errCode:0,code:1001,errMsg:'积分不足'}
		}
		
		let tran = await db.startTransaction()
		
		let insertData = {
			order_number:generateOrderNumber(payload.uid),
			uid:payload.uid,
			goods_info:{
				_id:goods._id,
				name:goods.name,
				cover:goods.cover,
				score:goods.score,
				old_price:goods.old_price,
				type:goods.type,
			},
			count:parseInt(param.count),
			total_score:parseInt(param.count *goods.score),
			address:param.address || null,
			order_status:goods.type == 1 ?1:3,
			create_time:new Date().getTime()
		}
		
		let addRes = await tran.collection('pk-integral-order').add(insertData) 
		let updateUser = await tran.collection('uni-id-users').doc(payload.uid).update({
			score:dbCmd.inc(-insertData.total_score)
		})
		
		//虚拟商品优惠券兑换
		if( goods.type == 2 ){
			let coupon_res = await tran.collection('pk-user-coupon').add({
				uid:payload.uid,
				coupon_id:goods.coupon_info._id,
				is_use:0,
				coupon_info:goods.coupon_info,
				create_time:new Date().getTime()
			})
			
			if( !coupon_res.id ){
				await tran.rollback(-100)
				return {errCode:'error',errMsg:'兑换失败'}
			}
		}
		
		await tran.collection('uni-id-scores').add({
			user_id:payload.uid,
			balance:userRes.data[0].score-insertData.total_score,
			score:insertData.total_score,
			type: 2,
			create_time: new Date().getTime(),
			comment:'兑换'+goods.name
		})
		
		await tran.collection('pk-integral-goods').doc(param.goods_id).update({
			count:dbCmd.inc(-insertData.count),
			sale_count:dbCmd.inc(insertData.count)
		})
		
		if( addRes.id && updateUser.updated ){
			await tran.commit()
			return {errCode:0,errMsg:'success'}
		}
		await tran.rollback(-100)
		return {errCode:'error',errMsg:'兑换失败'}
	},
	
	
	/**
	 * 获取积分商品订单详情
	 * @param {String} id
	 */
	getIntegralOrderDetail:async function(id){
		let res = await db.collection('pk-integral-order').doc(id).get()
		
		return { errCode:0,errMsg:'success',data:res.data[0]}
	},
	
	/**
	 * 确认收货
	 * @param {String} id
	 */
	integralOrderConfirm:async function(id){
		let res = await db.collection('pk-integral-order').doc(id).update({
			order_status:3,
			confirm_time:new Date().getTime()
		})
		
		return res.updated? {errCode:0,errMsg:'success'}:{errCode:1001,errMsg:'确认收货失败'}
	}
	
	
}
