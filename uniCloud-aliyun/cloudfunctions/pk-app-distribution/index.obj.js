const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
module.exports = {
	getOrderBuyGoods:async function(goods_id){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		let res = await db.collection('pk-order')
			.where({
				'goods_detail.goods_id':goods_id,
				uid:payload.uid
			}).limit(1).get()
		let flag = res.data.length > 0
		return{ errCode:0,errMsg:'success',data:flag}
	},
	
	/**
	 * 分销商申请
	 * @param {Object} param
	 */
	applyDis:async function(param){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		if( !param.id ){
			let disUser = await db.collection('pk-dis-user').where({uid:payload.uid}).get()
			if( disUser.data.length > 0 ){
				return { errCode:0,errMsg:'已提交过申请',code:1001}
			}
			let disUserMobile = await db.collection('pk-dis-user').where({mobile:param.mobile}).get()
			if( disUserMobile.data.length > 0 ){
				return { errCode:0,errMsg:'电话号码已存在',code:1001}
			}
		}
		
		let user = await db.collection('uni-id-users').doc(payload.uid).get()
		
		let addData = {
			uid:payload.uid,
			status:0,
			username:param.username,
			mobile:param.mobile,
			create_time:new Date().getTime(),
			one_user:user.data[0].one_user,
			two_user:user.data[0].two_user,
			money:0,
			total_money:0,
			frozen_money:0,
			share_code:Math.random().toString(36).slice(6)
		}
		if( param.id ){
			let res = await db.collection('pk-dis-user').doc(param.id).update(addData)
			return res.updated ? { errCode:0,errMsg:'success'}:{ errCode:'error',errMsg:'提交失败'}
		}else{
			let res = await db.collection('pk-dis-user').add(addData)
			return res.id ? { errCode:0,errMsg:'success'}:{ errCode:'error',errMsg:'提交失败'}
		}
	},
	
	//获取分销商用户信息(包含待审核，审核失败得用户)
	getDisUserInfo:async function(){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		let disUser = await db.collection('pk-dis-user').where({uid:payload.uid}).get()
		let data = disUser.data.length > 0 ? disUser.data[0]:null
		return { errCode:0,errMsg:'success',data:data}
	},
	
	/**
	 * 获取分销商用户信息
	 */
	getDisUser:async function(){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
				const payload = await uniID.checkToken(token)
		let disUser = await db.collection('pk-dis-user')
			.where({uid:payload.uid,status:1})
			.get()
		let data = disUser.data.length > 0 ? disUser.data[0]:null
		if(data){
			data.money = parseFloat(data.money/100).toFixed(2)
			data.total_money = parseFloat(data.total_money/100).toFixed(2)
			data.frozen_money = parseFloat(data.frozen_money/100).toFixed(2)
		}
		
		return { errCode:0,errMsg:'success',data:data}
	},
	
	/**
	 * 成为下线用户
	 * @param {String} share_code
	 */
	becomeDisDownUser:async function(share_code){
		// let payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let userRes = await db.collection('uni-id-users').doc(payload.uid).get()
		
		if( userRes.data[0].is_distribution == 1){
			return {errCode:0,errMsg:'success1'}
		}
		
		if( userRes.data[0].one_user ){
			return {errCode:0,errMsg:'success2'}
		}
		
		let disUser = await db.collection('pk-dis-user').where({
			share_code:share_code,
			status:1
		}).get()
		
		if( disUser.data.length == 0 ){
			return {errCode:0,errMsg:'success4'}
		}
		if( payload.uid == disUser.data[0].uid){
			return {errCode:0,errMsg:'success5'}
		}
		let res = await db.collection('uni-id-users').doc(payload.uid).update({
			one_user:disUser.data[0].uid,
			two_user:disUser.data[0].one_user,
			invite_time:new Date().getTime()
		})
		
		//修改上级用户人数
		await db.collection('pk-dis-user').where({
			uid:dbCmd.in([disUser.data[0].uid,disUser.data[0].one_user])
		}).update({
			total_user:dbCmd.inc(1)
		})
		
		return {errCode:0,errMsg:'success6'}
	},
	
	/**
	 * 获取用户/多商户信息
	 */
	getDisUserbyUser:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ){
			return {errCode:0,code:7000,errMsg:'请先登录'}
		}
		
		let res = await db.collection('uni-id-users').where({_id:payload.uid}).get()
		if( res.data.length == 0 ){
			return {errCode:'error',errMsg:"不存在的用户"}
		}
		let dis = await db.collection('pk-dis-user')
			.where({uid:payload.uid,status:1})
			.get()
			
		if( dis.data.length == 0 ){
			return { errCode:0,errMsg:"success",data:null}
		}	
		let disUser = {
			...dis.data[0],
			money:parseFloat(dis.data[0].money/100).toFixed(2),
			total_money:parseFloat(dis.data[0].total_money/100).toFixed(2),
			frozen_money:parseFloat(dis.data[0].frozen_money/100).toFixed(2),
		}
		let info = {
			_id:res.data[0]._id,
			nickname:res.data[0].nickname || "未设置",
			mobile:res.data[0].mobile || "未绑定",
			avatar:res.data[0].avatar_file ?res.data[0].avatar_file.url : "",
			money:res.data[0].money ? parseFloat(res.data[0].money/100).toFixed(2):'0.00',
			score:res.data[0].score  || 0,
			disUser:disUser
		}
		return { errCode:0,errMsg:"success",data:info}
	},
	
	/**
	 * 获取分校订单列表
	 */
	getDisOrderByUser:async function({page,limit,status}){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ){
			return {errCode:0,code:7000,errMsg:'请先登录'}
		}
		let _w = {order_status:dbCmd.in([1,2,3])}
		if( status>=0 ) _w.dis_grant = status
		
		let res = await db.collection('pk-order').aggregate().lookup({
			from:'uni-id-users',
			foreignField:'_id',
			localField:"uid",
			as:'userInfo'
		}).sort({create_time:-1}).match(
			dbCmd.or(
				{"one_price.uid": payload.uid},
				{"two_price.uid": payload.uid},
			)
		).match(_w).skip((page-1)*limit).limit(limit).end()
		
		let list = []
		res.data.forEach(item=>{
			let disPirce = 0 
			if( item.one_price && item.one_price.uid == payload.uid) {
				disPirce = item.one_price.money
			}
			if( item.two_price && item.two_price.uid == payload.uid) {
				disPirce = item.two_price.money
			}
			list.push({
				...item,
				userInfo:{
					_id:item.userInfo[0]._id,
					nickname:item.userInfo[0].nickname || item.userInfo[0].mobile,
					mobile:item.userInfo[0].mobile || "",
					avatar:item.userInfo[0].avatar_file ?item.userInfo[0].avatar_file.url : "",
				},
				disPirce:disPirce
			})
		})
		
		return { errCode:0,errMsg:'success',data:list}
	},
	
	//获取分销余额记录
	getDisMoneyLog:async function({page,limit}){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code !=0 ){
			return {errCode:0,code:7000,errMsg:'请先登录'}
		}
		
		let res = await db.collection('pk-dis-money-log').where({uid:payload.uid})
			.orderBy('create_time','desc').skip((page-1)*limit).limit(limit).get()
		
		return { errCode:0,errMsg:'success',data:res.data}
	},
	
	//分销用户提现
	disUserWidthdraw:async function({count,method,wx_account,alipay_account,bank_account}){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		let key = [
			'dis_withdraw_service_price',
			'dis_withdraw_low'
		]
		let configRes = await db.collection('pk-set').where({key:dbCmd.in(key)}).get()
		let config = {
			dis_withdraw_service_price:0,
			dis_withdraw_low:0
		}
		configRes.data.forEach(item=>{
			config[item.key] = parseFloat(item.value) 
		})
		
		let disUser =await db.collection('pk-dis-user').where({uid:payload.uid}).get()
		
		if( disUser.data.length == 0 ){
			return { errCode:0,errMsg:'不存在得分销商',code:1001}
		}
	
		if( parseFloat(count) > (parseFloat(disUser.data[0].money)/100)){
			return { errCode:0,errMsg:'余额不足',code:1001}
		}
		if( parseFloat(count) < parseFloat(config.dis_withdraw_low)){
			return { errCode:0,errMsg:'最低提现金额不能小于'+config.dis_withdraw_low+'元',code:1001}
		}
		let method_txt = '' ,account = null
		if( method == 'wx' ) {
			method_txt ='微信'
			account = wx_account
		}
		if( method == 'alipay' ){
			method_txt ='支付宝'
			account = alipay_account
		}
		if( method == 'bank' ) {
			method_txt ='银行卡'
			account = bank_account
		}
		if( method == 'balance' ) method_txt ='账户余额'
		
		let service_price = 0 , final_price= parseFloat(count) 
		count = parseFloat(count)
		if( parseFloat(config.dis_withdraw_service_price) ){
			service_price = parseFloat(count*(config.dis_withdraw_service_price/100)).toFixed(2)
			final_price = parseFloat(count-parseFloat(service_price)).toFixed(2)
		}
		
		const tran = await db.startTransaction()
		let res = await tran.collection('pk-dis-withdraw-log').add({
			uid:payload.uid,
			remark:'提现到'+method_txt,
			count:final_price,
			method:method,
			status:method == 'balance' ? 1 : 0,
			account:account,
			service_price:service_price,
			create_time:new Date().getTime()
		})
		
		let res1 = await tran.collection('pk-dis-user').doc(disUser.data[0]._id).update({
			money:dbCmd.inc(-parseInt(parseFloat(count)*100))
		})
		
		let res2 = await tran.collection('pk-dis-money-log').add({
			uid:payload.uid,
			remark:'提现到'+method_txt,
			type:2,
			count:count,
			create_time:new Date().getTime()
		})
		
		if( method == 'balance' ){
			let res3 = await tran.collection('uni-id-users').doc(payload.uid).update({
				money:dbCmd.inc(parseInt(parseFloat(final_price)*100))
			})
			
			let res4 = await tran.collection('pk-money-log').add({
				uid:payload.uid,
				remark:'分销佣金提现',
				type:1,
				count:final_price,
				create_time:new Date().getTime()
			})
			
			if( !res3.updated || !res4.id ){
				tran.rollback(-100)
				return { errCode:0,errMsg:'提现失败',code:1001,res3,res4}
			}
		}
		
		if( res.id && res1.updated && res2.id ){
			tran.commit()
			return {errCode:0,errMsg:'success'}
		}
		tran.rollback(-100)
		return { errCode:0,errMsg:'提现失败',code:1001}
	},
	
	//获取分销商用户提现记录
	getDisUserWithdrawLog:async function({page,limit}){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		let res = await db.collection('pk-dis-withdraw-log').where({uid:payload.uid})
			.orderBy("create_time","desc")
			.skip((page-1)*limit).limit(limit).get()
			
		return { errCode:0,errMsg:'success',data:res.data}
	},
	
	getDisTeam:async function({page,limit,extra}){
		const payload = await uniID.checkToken(this._event.uniIdToken)
		let _where = {}
		if( extra.status ==0 ){
			_where = dbCmd.or(
				{"one_user": payload.uid},
				{"two_user": payload.uid},
			)
		}
		if( extra.status == 1 ){
			_where = {one_user:payload.uid}
		}
		if( extra.status == 2 ){
			_where = {two_user:payload.uid}
		}
		
		let res = await db.collection('uni-id-users').aggregate().lookup({
			from:'pk-dis-user',
			localField:'_id',
			foreignField:"uid",
			as:'disInfo'
		}).lookup({
			from:'pk-order',
			let: {
			    user_id: '$_id',
			},
			pipeline: $.pipeline()
			    .match(dbCmd.expr($.and([
			        $.eq(['$uid', '$$user_id']),
				]))).match({
					order_status:dbCmd.in([1,2,3]),
					is_dis_order:1
				}).done(),
			as:"orderInfo",
		}).sort({invite_time:-1}).match(
			_where
		).end()
		
		let list = []
		res.data.forEach(item=>{
			let total_order = item.orderInfo.length , total_price = 0
			if( total_order>0 ){
				item.orderInfo.forEach(val=>{
					total_price+= parseFloat(val.total_price)
				})
			}
			list.push({
				_id:item._id,
				nickname:item.nickname || item.username || item.mobile,
				mobile:item.mobile ||'',
				avatar:item.avatar_file ? item.avatar_file.url :'',
				register_date:item.register_date,
				money:item.money ? parseFloat(item.money/100).toFixed(2) : 0,
				score:item.score || 0,
				order_total:item.order_total || 0,
				cost_total:item.cost_total ? parseFloat(item.cost_total/100).toFixed(2):0,
				dis_total_order:total_order,
				dis_total_price:parseFloat(total_price).toFixed(2),
				is_distribution:item.is_distribution || 0,
				disInfo:item.disInfo.length > 0 ? item.disInfo[0]:null,
				invite_time:item.invite_time,
				orderInfo:item.orderInfo
			})
		})
		
		return { errCode:0,errMsg:'success',data:list}
	}
}
