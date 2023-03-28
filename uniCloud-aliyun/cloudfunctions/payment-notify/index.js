'use strict';
const db = uniCloud.database()
const uniPay= require('uni-pay')
const pkNotify = require('pk-pay-notify')
const createConfig = require('uni-config-center')
const uniPayConfig = createConfig({
	pluginId: 'uni-pay'
}).config()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	let uniPayInstance = null , provider = null
	let actionStr = event.path.split('/').pop()
	let actionArr = actionStr.split('__')
	let pay_method = actionArr[0]
	
	console.log('pay_method',pay_method);
	
	switch (pay_method) {
		case 'wxpay_mp-weixin':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigMp)
			break;
		case 'wxpay_app-plus':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigApp)
			break;
		case 'wxpay_h5':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(uniPayConfig.wxConfigH5)
			break;
		case 'alipay_mp-alipay':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigMp)
			break;
		case 'alipay_app-plus':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigApp)
			break;
		case 'alipay_h5':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(uniPayConfig.aliConfigH5)
			break;
		default:
			console.log('---------参数错误-------')
			return {
				code: -1,
				msg: '参数错误'
			}
	}
	if (uniPayInstance.checkNotifyType(event) === 'refund') {
	  // 支付宝支付时，如果执行退款操作且非全量退款，会再次调用支付时设置的notify_url，这里需要根据自己的业务做下处理
	  // 补充自己的退款逻辑
	  return
	}
	
	let verifyResult = await uniPayInstance.verifyPaymentNotify(event)
	if (!verifyResult) {
		console.log('---------!verifyResult-------')
		return {}
	}
	
	let { outTradeNo,totalFee,transactionId,resultCode } = verifyResult
	// const orderDetail = orderRes.data[0]
	// if (totalFee === orderDetail.total_price && (resultCode === 'SUCCESS' || resultCode === 'FINISHED')) {
	// }
	
	if (resultCode === 'SUCCESS' || resultCode === 'FINISHED') {
		console.log('---------updatedb-------')
		//数据库状态修改操作
		//修改订单状态信息
		let updateres =await pkNotify({
			outTradeNo:outTradeNo,
			pay_method:pay_method,
			total_fee:totalFee,
			transaction_id:transactionId,
			scene:actionArr[1]
		})
		console.log("updateRes",updateres);
	}
	
	// 注意如果处理成功需要严格按照下面的格式进行返回，否则厂商会持续通知
	if (provider === 'weixin') {
		// 微信处理成功之后 
		return {
			mpserverlessComposedResponse: true,
			statusCode: 200,
			headers: {
				'content-type': 'text/xml;charset=utf-8'
			},
			body: `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`
		}
	}
	// 支付宝处理成功后  
	return {
		mpserverlessComposedResponse: true,
		statusCode: 200,
		headers: {
			'content-type': 'text/plain'
		},
		body: "success"
	}
	//返回数据给客户端
	return event
};
