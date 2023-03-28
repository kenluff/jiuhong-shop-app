const uniID = require('uni-id')
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command
const db_coupon = db.collection('pk-goods-coupon')
const db_user_coupon = db.collection('pk-user-coupon')
module.exports = {
	/**
	 * 获取优惠券列表数据
	 * @param {Object} page
	 * @param {Object} limit
	 */
	getCouponList:async function(page,limit){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		let list = []
		if( payload.uid ){
			let res = await db_coupon.aggregate().lookup({
				from:'pk-user-coupon',
				let: {
					coupon_id: '$_id',
					user_id:payload.uid
				},
				pipeline: $.pipeline()
				.match(dbCmd.expr($.and([
					$.eq(['$coupon_id', '$$coupon_id']),
					$.eq(['$uid','$$user_id'])
				]))).done(),
				as: 'isGet',
			}).sort({create_time:-1}).skip((page-1)*limit).limit(10).end()
			res.data.forEach(item=>{
				let isGet = item.isGet.length >0 ? 1:0
				list.push({...item,isGet})
			})
		}else{
			let res = await db_coupon
				.orderBy('create_time','desc')
				.skip((page-1)*limit)
				.limit(limit)
				.get()
			list = res.data
		}
		return { errCode:0,errMsg:'success',data:list}
	},
	
	/**
	 * 领取优惠券
	 * @param {String} id
	 */
	receiveCoupon:async function(id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		let getRes = await db_user_coupon.where({uid:payload.uid,coupon_id:id}).get()
		if( getRes.data.length > 0 ){
			return { errCode:'error',errMsg:'已领取过该优惠券'}
		}
		
		let couponRes =await db_coupon.where({_id:id,status:1}).get()
		if( couponRes.data.length == 0 ){
			return { errCode:'error',errMsg:'优惠券已下架'}
		}
		
		let res =await db_user_coupon.add({
			uid:payload.uid,
			coupon_id:id,
			is_use:0,
			coupon_info:{
				name:couponRes.data[0].name,
				end_time:couponRes.data[0].end_time,
				low_price:parseFloat(couponRes.data[0].low_price),
				start_time:couponRes.data[0].start_time,
				coupon_price:parseFloat(couponRes.data[0].coupon_price),
			},
			create_time:new Date().getTime()
		})
		
		await db_coupon.doc(id).update({receive_count:dbCmd.inc(1)})
		
		return res.id ? {errCode:0,errMsg:'领取成功'}:{errCode:'error',errMsg:'领取失败'}
	},
	
	getMyCoupon:async function(page,limit,extra = null){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		let _w = { uid:payload.uid } , nowTime = new Date().getTime()
		if( extra ){
			//未使用
			if( extra.status == 0 ) _w.is_use = 0
			if( extra.status == 1 ) _w.is_use = 1
			if( extra.status == 2 ) _w.coupon_info = {end_time:dbCmd.lt(nowTime)}
		}
		
		let res = await db_user_coupon.where(_w)
			.orderBy('create_time','desc')
			.skip((page-1)*limit)
			.limit(limit)
			.get()
			
		let list = []
		res.data.forEach(item=>{
			let temp = item
			temp.is_expire = item.coupon_info.end_time < nowTime
			list.push(temp)
		})
		
		return { errCode:0,errMsg:'success',data:list}
	},

	
	
}
