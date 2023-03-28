const uniID = require('uni-id')
const createConfig = require('uni-config-center')
const uniPayConfig = createConfig({
	pluginId: 'uni-pay'
}).config()
const uniPay = require('uni-pay')
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command

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
	
	////////////////////////余额充值/////////////////////////////////////
	createRecharOrder:async function(param){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
						const payload = await uniID.checkToken(token)
		if( payload.code != 0 ){
			return { errCode:7000,errMsg:'请先登录'}
		}
		let mealData = null
		if( param.meal_id ){
			let mealRes = await db.collection('pk-recharge-meal').doc(param.meal_id).get()
			if( mealRes.data.length == 0 ){
				return { errCode:1001,errMsg:'不存在的充值套餐'}
			}
			mealData = mealRes.data[0]
		}
		
		let addData = {
			uid:payload.uid,
			order_number:generateOrderNumber(payload.uid),
			price:mealData?mealData.price:param.price,
			send_price:mealData?mealData.send_price:'0',
			meal_id:mealData?mealData._id:'',
			create_time:new Date().getTime(),
			order_status:0,
			pay_method:param.pay_method,
		}
		
		let res = await db.collection('pk-recharge-order').add(addData)
		
		let orderInfo = null , uniPayInstance =null , tradeType ='' , openid = ''
		
		console.log("-----",uniPayConfig.wxConfigMp);
		
		const userList = await db.collection('uni-id-users').where({
			_id: payload.uid
		}).get()
		
		switch (param.pay_method + '_' + this._context.PLATFORM) {
			case 'wxpay_mp-weixin':
				uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigMp)
				openid = userList.data[0].wx_openid['mp-weixin']
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
			let notifyUrl = uniPayConfig.wxConfigMp.notifyUrl+'/'+param.pay_method+'_'+this._context.PLATFORM+'__recharge'
			// 获取支付信息
			orderInfo = await uniPayInstance.getOrderInfo({
				openid:openid, 
				outTradeNo:addData.order_number,
				totalFee:parseInt(parseFloat(addData.price)*100),
				subject: "余额充值",
				body: "余额充值",
				notifyUrl: notifyUrl,
				tradeType:tradeType,
			})
			return orderInfo
		} catch (e) {
			return {
				errCode: -3,
				errMsg: e.errMsg
			}
		}
		
	}
}
