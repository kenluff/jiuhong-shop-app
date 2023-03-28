<template>
<view class="ucenter-set" v-if="info">
	<view class="set-item flex">
		<view class="title">
			<text class="ri-file-user-line title-icon" style="color: #FF0099;"></text>
			头像
		</view>
		<view class="value" @click="uploadAvatarImg">
			<image v-if="info.avatar" :src="info.avatar" class="avatar" mode=""></image>
			<image v-else src="/static/img/default-head.png" class="avatar" mode=""></image>
		</view>
		<text class="ri-arrow-right-s-line"></text>
	</view>
	<view class="set-item flex">
		<view class="title">
			<text class="ri-user-5-line title-icon" style="color: #0099FF;"></text>
			昵称
		</view>
		<view class="value" @click="setNickname('')"> {{info.nickname}} </view>
		<text class="ri-arrow-right-s-line"></text>
	</view>
	<view class="set-item flex" @click="toBindPhone">
		<view class="title">
			<text class="ri-phone-line title-icon" style="color: #33CC66;"></text>
			手机号
		</view>
		<view class="value"> {{info.mobile}} </view>
		<text class="ri-arrow-right-s-line"></text>
	</view>
	<view class="set-item flex" @click="toUpdatePassword">
		<view class="title">
			<text class="ri-key-line title-icon" style="color: #FF3300;"></text>
			修改密码
		</view>
		<text class="ri-arrow-right-s-line"></text>
	</view>
	<view class="set-item flex" @click="deactivate">
		<view class="title">
			<text class="ri-logout-circle-r-line title-icon" style="color: #FFCC33;"></text>
			注销账号
		</view>
		<text class="ri-arrow-right-s-line"></text>
	</view>
	<view class="logot-btn" @click="clickLogout">
		退出登录
	</view>
	
	<uni-popup ref="dialog" type="dialog">
		<uni-popup-dialog mode="input" 
			:value="info.nickname" 
			@confirm="setNickname" 
			:title="$t('userinfo.setNickname')"
			:placeholder="$t('userinfo.setNicknamePlaceholder')">
		</uni-popup-dialog>
	</uni-popup>
	
	<uni-bindMobileByMpWeixin ref="uni-bindMobileByMpWeixin"></uni-bindMobileByMpWeixin>
</view>
</template>

<script>
import {mapMutations,mapGetters,mapActions} from 'vuex';
const pkAppUser = uniCloud.importObject('pk-app-user')
const usersTable = uniCloud.database().collection('uni-id-users')
export default{
	data(){
		return{
			info:null
		}
	},
	computed: {
		...mapGetters({
			'hasLogin': 'user/hasLogin',
		}),
		i18nEnable(){
			return getApp().globalData.config.i18n.enable
		}
	},
	onShow() {
		this.getUserDetail()
	},
	
	methods:{
		...mapMutations({
			setUserInfo: 'user/login'
		}),
		...mapActions({
			logout: 'user/logout'
		}),
		
		async getUserDetail(){
			let t = this
			try{
				uni.showLoading({title:'玩命加载中...'})
				let res = await pkAppUser.getPkUserDetail()
				t.info = res.data
				uni.hideLoading()
			}catch(e){
				console.log(e);
				uni.hideLoading()
			}
		},
		
		uploadAvatarImg(){
			const crop = {
				quality: 100,
				width: 600,
				height: 600,
				resize: true
			};
			uni.chooseImage({
				count: 1,
				crop,
				success: async (res) => {
					console.log(res);
					let tempFile = res.tempFiles[0],
						avatar_file = {
							// #ifdef H5
							extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
							// #endif
							// #ifndef H5
							extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
							// #endif
						},
						filePath = res.tempFilePaths[0]
					// #ifndef APP-PLUS
					//非app端用前端组件剪裁头像，app端用内置的原生裁剪
					filePath = await new Promise((callback) => {
						uni.navigateTo({
							url: '/pages/ucenter/set/cropImage?path=' + filePath +
								`&options=${JSON.stringify(crop)}`,
							animationType: "fade-in",
							events: {
								success: url => {
									callback(url)
								}
							}
						});
					})
					// #endif
					let cloudPath = this.info._id + '' + Date.now()
					avatar_file.name = cloudPath
					uni.showLoading({
						title:this.$t('userinfo.uploading'),
						mask: true
					});
					let {
						fileID
					} = await uniCloud.uploadFile({
						filePath,
						cloudPath,
						fileType: "image"
					});
					avatar_file.url = fileID
					uni.hideLoading()
			
					this.setAvatarFile(avatar_file)
				}
			})
		},
		setAvatarFile(avatar_file) {
			let t = this
			uni.showLoading({
				title: this.$t('userinfo.setting'),
				mask: true
			});
			// 使用 clientDB 提交数据
			usersTable.where('_id==$env.uid').update({
				avatar_file
			}).then((res) => {
				if (avatar_file) {
					uni.showToast({
						icon: 'none',
						title: this.$t('userinfo.setSucceeded')
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: this.$t('userinfo.deleteSucceeded')
					})
				}
				this.setUserInfo({
					avatar_file
				});
				t.getUserDetail()
			}).catch((err) => {
				uni.showModal({
					content: err.message ||this.$t('userinfo.requestFail'),
					showCancel: false
				})
			}).finally(() => {
				uni.hideLoading()
			})
		},
		
		setNickname(nickname) {
			let t = this
			if (nickname) {
				usersTable.where('_id==$env.uid').update({
					nickname
				}).then(e => {
					if (e.result.updated) {
						uni.showToast({
							title:this.$t('common.updateSucceeded'),
							icon: 'none'
						});
						t.info.nickname = nickname
					} else {
						uni.showToast({
							title: this.$t('userinfo.noChange'),
							icon: 'none'
						});
					}
				})
				this.$refs.dialog.close()
			} else {
				this.$refs.dialog.open()
			}
		},
		
		toBindPhone(){
			// #ifdef APP-PLUS
			uni.preLogin({
				provider: 'univerify',
				success: this.univerify(), //预登录成功
				fail: (res) => { // 预登录失败
					// 不显示一键登录选项（或置灰）
					console.log(res)
					uni.navigateTo({
						url:'/pages/ucenter/set/bind-mobile'
					})
				}
			})
			// #endif
			
			// #ifdef MP-WEIXIN
			this.$refs['uni-bindMobileByMpWeixin'].open()
			// #endif
			
			// #ifdef H5
				//...去用验证码绑定
			uni.navigateTo({
				url:'/pages/ucenter/set/bind-mobile'
			})
			// #endif
			
		},
		
		univerify() {
			uni.login({
				"provider": 'univerify',
				"univerifyStyle": this.univerifyStyle,
				success: async e => {
					console.log(e.authResult);
					uniCloud.callFunction({
						name: 'uni-id-cf',
						data: {
							action: 'bindMobileByUniverify',
							params: e.authResult,
						},
						success: ({
							result
						}) => {
							console.log(result);
							if (result.code === 0) {
								t.info.mobile =  result.mobile
								uni.closeAuthView()
							} else {
								uni.showModal({
									content: result.msg,
									showCancel: false,
									complete() {
										uni.closeAuthView()
									}
								});
							}
						}
					})
				},
				fail: (err) => {
					console.log(err);
					if (err.code == '30002' || err.code == '30001') {
						this.bindMobileBySmsCode()
					}
				}
			})
		},
		toUpdatePassword(){
			uni.navigateTo({
				url:'/pages/ucenter/login-page/pwd-retrieve/pwd-retrieve?phoneNumber='+this.info.mobile
			})
		},
		deactivate(){
			uni.navigateTo({
				url:"./deactivate"
			})
		},
		clickLogout() {
			if (this.hasLogin) {
				uni.showModal({
					title: this.$t('settings.tips'),
					content: this.$t('settings.exitLogin'),
					cancelText: this.$t('settings.cancelText'),
					confirmText: this.$t('settings.confirmText'),
					success: res => {
						if (res.confirm) {
							this.logout()
							uni.navigateBack();
						}
					},
					fail: () => {},
					complete: () => {}
				});
			} else {
				uni.navigateTo({
					url: '/pages/ucenter/login-page/index/index'
				});
			}
		},
		
	}
}
</script>

<style lang="scss" scoped>
.set-item{
	width: 100%;
	padding: 32rpx 24rpx;
	background: #fff;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f4f4f4;
	.title{
		font-size: 28rpx;
		color: #666;
	}
	.title-icon{
		font-size: 36rpx;
		position: relative;
		top: 4rpx;
		margin-right: 12rpx;
	}
	.value{
		flex: 1;
		width: 60%;
		text-align: right;
		font-size: 30rpx;
	}
	.avatar{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.ri-arrow-right-s-line{
		font-size:36rpx;
		color: #999;
	}
}

.logot-btn{
	width: 100%;
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
	background: #fff;
	margin-top: 24rpx;
}
</style>