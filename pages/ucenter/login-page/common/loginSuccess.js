import { request } from '@/util/http.js'
export default function(result){
	uni.showToast({
		title: '登录成功',
		icon: 'none'
	});
	console.log('登录成功',result);
	
	if( uni.getStorageSync('__share_code__')){
		request('distribution','becomeDisDownUser',uni.getStorageSync('__share_code__') )
	}
	
	var delta = 0//判断需要返回几层
	let pages = getCurrentPages();
	// console.log(pages);
	pages.forEach((page,index)=>{
		// console.log(pages[pages.length-index-1].route.split('/')[2]);
		pages[pages.length-index-1].route.split('/')
		if(pages[pages.length-index-1].route.split('/')[2] == 'login-page'){
			delta ++
		}
	})
	// console.log('判断需要返回几层',delta);
	uni.navigateBack({delta})
}
