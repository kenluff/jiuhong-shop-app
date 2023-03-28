import store from '@/store/index.js'
import { request } from '@/util/http.js'
class Util{
	iPhoneX(){
		return store.state.common.iphoneX
	}
	checkLogon(tips){
		let userInfo =  uni.getStorageSync('userInfo');
		let uni_id_token = uni.getStorageSync('uni_id_token')
		if( userInfo && uni_id_token){
			return true
		}
		if( !tips ) return false 
		uni.showModal({
			title:'提示',
			content:'您还没有登录哦',
			confirmText:'立即登录',
			cancelText:'暂不登录',
			success(tip){
				if( tip.confirm ){
					uni.navigateTo({
						url:"/pages/ucenter/login-page/index/index"
					})
				}
			}
		})
	}
	verifyFiled(key,tip){
		if( !key ){
			uni.showToast({
				title:tip,
				icon:'error'
			})
			return false
		}
		return true
	}
}
export default new Util()