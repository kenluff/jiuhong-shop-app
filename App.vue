<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js';
	import store from '@/store/index.js'
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function() {
			let t = this
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)
			
			uni.getSystemInfo({
				success(e) {
					console.log('系统信息',e)
					t.checkIphoneX(e)
				}
			})

			initApp();
			
			// #ifdef H5
				openApp() //创建在h5端全局悬浮引导用户下载app的功能
			// #endif
			// #ifdef APP-PLUS
			//checkIsAgree(); APP端暂时先用原生默认生成的。目前，自定义方式启动vue界面时，原生层已经请求了部分权限这并不符合国家的法规
			// #endif

			// #ifdef H5
			// checkIsAgree(); // 默认不开启。目前全球，仅欧盟国家有网页端同意隐私权限的需要。如果需要可以自己去掉注视后生效
			// #endif

			// #ifdef APP-PLUS
			//idfa有需要的用户在应用首次启动时自己获取存储到storage中
			//https://ask.dcloud.net.cn/article/36107
			/*if(~plus.storage.getItem('idfa')){
				plus.device.getInfo({//需要勾选IDFA
					success:function(e){  
						console.log('idfa =  '+JSON.stringify(e.idfa));  
					},
					fail:function(e){
						console.log('getDeviceInfo failed: '+JSON.stringify(e));  
					}  
				});
			}*/
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			checkIphoneX(e){
				let iPhone =  [
					'iPhone X','iPhoneX',
					'iPhone 11','iPhone11',
					'iPhone 12','iPhone12',
					'iPhone 13','iPhone13',
					'iPhone 12/13','iPhone12/13'
				]
				let flag = false
				for (let i = 0; i < iPhone.length; i++) {
					if( e.model.indexOf(iPhone[i]) !=-1 ){
						flag = true
						break
					}
				}
				// #ifdef H5
				flag = e.platform == 'ios' ? e.screenHeight >=812 :false
				// #endif
				store.dispatch('common/setIPhoneX',flag)
				store.dispatch('common/setPlatform',e.platform)
			},
		}
	}
</script>

<style>
	@import '@/remixicon.css';
	page,body{
		background: #f4f4f4;
	}
	view,label{
		box-sizing: border-box;
	}
	.f12{ font-size:12px; }
	.f13{ font-size:26rpx; }
	.f14{ font-size:28rpx; }
	.f15{ font-size:30rpx; }
	.f16{ font-size:32rpx; }
	.f17{ font-size:34rpx; }
	.f18{ font-size:36rpx; }
	.fw{ font-weight: bold; }
	.mt6{ margin-top: 12rpx;}
	.mt12{ margin-top: 24rpx;}
	.mt16{ margin-top: 32rpx;}
	.ml6{ margin-left: 12rpx;}
	.ml12{ margin-left: 24rpx;}
	.ml16{ margin-left: 32rpx;}
	.mr6{ margin-right: 12rpx;}
	.mr12{ margin-right: 24rpx;}
	.mr16{ margin-right: 32rpx;}
	.mb6{ margin-bottom: 12rpx;}
	.mb12{ margin-bottom: 24rpx;}
	.mb16{ margin-bottom: 32rpx;}
	.flex{ display: flex;}
	.flex-c { display: flex; align-items: center;}
	.flex-sb { display: flex; justify-content:space-between; align-items: center;}
	.top2{ position: relative;top: 4rpx;}
	.top4{ position: relative;top: 8rpx;}
	.top6{ position: relative;top: 12rpx;}
	.gy{color: #999;}
	.pk-card{
		width: 94%;
		margin-left: 3%;
		padding: 24rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 1px 1px 10px #efefef;
	}
	.text-hidden{
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.nav-header{
		width: 100%;
		position: fixed;
		z-index: 9;
		/* #ifdef H5 */
		top: 43px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
	}
</style>
