const pkAppUser = uniCloud.importObject('pk-app-user')
const pkAppIntegral = uniCloud.importObject('pk-app-integral')
const pkAppOrder = uniCloud.importObject('pk-app-order')
const pkAppDistribution = uniCloud.importObject('pk-app-distribution')

let modules = {
	user:pkAppUser,
	integral:pkAppIntegral,
	order:pkAppOrder,
	distribution:pkAppDistribution
}

export async function request(module,api,param=null){
	let collection  = modules[module]
	try{
		let res = await collection[api](param)
		if( res.code ){
			if( res.code == 7000 ){
				uni.setStorageSync('userInfo', {});
				uni.removeStorageSync('uni_id_token');
				uni.setStorageSync('uni_id_token_expired', 0)
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
			if( res.code == 1001 ){
				uni.showModal({
					title:'提示',
					content:res.errMsg,
					showCancel:false
				})
			}
		}
		return res 

	}catch(e){
		uni.showModal({
			title:'提示',
			content:e.errMsg,
			showCancel:false
		})
	}
}