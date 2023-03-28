const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const db_address = db.collection('pk-address')
const db_user = db.collection('uni-id-users')
module.exports = {
	
	/**
	 * 获取当前登陆用户信息
	 */
	getPkUserDetail:async function(){
		const token = this.getUniIdToken()
		const payload = await uniID.checkToken(token)
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		if( payload.code !=0 ){
			return {errCode:0,code:7000,errMsg:'请先登录'}
		}
		
		let res = await db_user.where({_id:payload.uid}).get()
		if( res.data.length == 0 ){
			return {errCode:'error',errMsg:"不存在的用户"}
		}
		let info = {
			_id:res.data[0]._id,
			nickname:res.data[0].nickname || "未设置",
			mobile:res.data[0].mobile || "未绑定",
			avatar:res.data[0].avatar_file ?res.data[0].avatar_file.url : "",
			money:res.data[0].money ? parseFloat(res.data[0].money/100).toFixed(2):'0.00',
			score:res.data[0].score  || 0,
		}
		return { errCode:0,errMsg:"success",data:info}
	},
	
	addOrEditAddress :async function(params,id=''){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		
		let data = {
			...params,
		}, res = null
		
		if( data.name == '' ) return { errCode:'name-null',errMsg:'请填写姓名'}
		if( data.mobile == '' ) return { errCode:'mobile-null',errMsg:'请填写电话'}
		if( data.address == '' ) return { errCode:'address-null',errMsg:'请填写地址'}
		
		if( data.is_default == 1 ){
			let res1 = await db_address.where({
				uid:payload.uid,
				is_default:1
			}).update({
				is_default: 0,
			})
		}
		
		if( !id ){
			data.create_time = new Date().getTime()
			data.uid = payload.uid
			res = await db_address.add(data)
		}else{
			res = await db_address.doc(id).update(data)
		}
		return res.id || res.updated ? {
			errCode:0,errMsg:'保存成功'
		}:{
			errCode:'add-fail',errMsg:'未修改任何内容'
		}
	},
	
	getAddress :async function(page,limit){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let _w = { uid:payload.uid }
		let res = await db_address
			.where(_w).skip((page-1)*limit)
			.limit(limit)
			.orderBy('create_time','asc')
			.get()
		
		let list = res.data
		list.forEach(item=>{
			item.first_name = item.name.substr(0,1)
		})
		
		return { errCode:0,errMsg:'success',data:list}
	},
	
	setAddressDefault: async function(id){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		
		let res1 = await db_address.where({
			uid:payload.uid,
			is_default:1
		}).update({
			is_default: 0,
		})
		let res2 = await db_address.doc(id).update({is_default:1})
		return res1.updated || res2.updated ? {
			errCode:0,errMsg:'设置成功'
		}:{errCode:'set-fail',errMsg:'设置失败'}
	},
	
	deleteAddress :async function(id){
		let res = await db_address.doc(id).remove()
		return res.deleted ? {
			errCode:0,errMsg:'删除成功'
		}:{errCode:'delete-fail',errMsg:'删除失败'}
	},
	
	getAddressDetail :async function(search){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let _w = {
			...search,
			uid:payload.uid
		}
		let res = await db_address.where(_w).get()
		let result =  res.data.length > 0 ?res.data[0] :null
		return { errCode:0,errMsg:'success',data:result}
	},
	
	/**
	 * 获取用户余额
	 */
	getUserMoney:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let res = await db_user.where({_id:payload.uid}).get()
		let money = 0 , is_password = false
		if( res.data.length >0 ){
			if(res.data[0].money){
				money = parseFloat(res.data[0].money/100).toFixed(2)
			}else{
				money = '0.00'
			}
			
			if( res.data[0].pay_password ) {
				is_password = true
			}
		}
		return { errCode:0,errMsg:'success',data:{money,is_password}}
	},
	
	/**
	 * 设置支付密码
	 * @param {Object} param
	 */
	setPayPassword :async function(param){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		
		let bankRes = await db_user.where({_id:payload.uid}).get()
		
		if( !param.password ) return {errCode:'error',errMsg:'请输入支付密码'}
		if( !param.re_password ) return {errCode:'error',errMsg:'请再次输入支付密码'}
		if( param.password !== param.re_password ) return {errCode:'error',errMsg:'两次密码输入不一致'}
		if( bankRes.data[0].pay_password == param.password ) {
			return { errCode:'error',errMsg:'输入密码不能个原密码一致'}
		}
		
		let password = param.password
		
		let res = await db_user.where({_id:payload.uid}).update({pay_password:password})
		return res.updated ? { errCode:0,errMsg:"修改成功"}:{errCode:'error',errMsg:'修改失败'}
	},
	
	/**
	 * 获取用户账户统计信息
	 */
	getUserAccountTotal:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
		const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:0,errMsg:'success',data:null}
		}
		
		let userRes = await db_user.where({_id:payload.uid}).get()
		let couponRes = await db.collection('pk-user-coupon').where({
			uid:payload.uid,
			is_use:0,
			coupon_info:{end_time:dbCmd.gt(new Date().getTime())}
		}).count()
		
		let money = userRes.data[0].money ? parseFloat(userRes.data[0].money/100).toFixed(2):'0.00'
		let costMoney = userRes.data[0].cost_total ?parseFloat(userRes.data[0].cost_total/100).toFixed(2):0
		let data = {
			score:userRes.data[0].score,
			money:money,
			couponCount:couponRes.total,
			costMoney:costMoney,
			order_total:userRes.data[0].order_total || 0
		}
		return { errCode:0,errMsg:'success',data:data}
	},
	
	/**
	 * 获取余额日志
	 * @param {Number} page
	 * @param {Number} limit
	 */
	getMoneyLog:async function(page,limit){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		
		let resData= await db.collection('pk-money-log').orderBy('create_time','desc')
			.where({uid:payload.uid})
			.skip((page-1)*limit)
			.limit(limit)
			.get()
		
		return {errCode:0,errMsg:'success',data:resData.data}
	},
	
	/**
	 * 获取积分日志
	 * @param {Number} page
	 * @param {Number} limit
	 */
	getScoreLog:async function(page,limit){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		
		let resData= await db.collection('uni-id-scores').orderBy('create_time','desc')
			.where({user_id:payload.uid})
			.skip((page-1)*limit)
			.limit(limit)
			.get()
		
		return {errCode:0,errMsg:'success',data:resData.data}
	}
}
