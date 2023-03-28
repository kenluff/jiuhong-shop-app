<template>
	<view class="center">
		<view class="header">
			<view class="user flex" @click.capture="toUserInfo">
				<image v-if="userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url" class="head" mode=""></image>
				<image v-else class="head" src="@/static/uni-center/defaultAvatarUrl.png"></image>
				<view class="user-right ml12" v-if="hasLogin">
					<view class="fw f16"> {{userInfo.nickname||userInfo.username||userInfo.mobile}} </view>
					<view class="f13 mt6"> {{userInfo.mobile}}</view>
				</view>
				<view class="user-right ml12" v-else>
					<view class="fw f16">{{$t('mine.notLogged')}}</view>
				</view>
				
				<text class="ri-settings-4-line"></text>
			</view>
			<!-- <view class="user-vip flex-sb">
				<view class="f14">
					<text class="ri-vip-crown-2-line mr6"></text>升级成为会员，享更多优惠~
				</view>
				<view class="btn f14">
					开通会员
				</view>	
			</view> -->
		</view>
		
		<view class="order">
			<view class="order-title flex-sb"> 
				<text class="f16 fw">我的订单</text>
				<view class="gy" @click="toOrderList">
					全部订单
					<text class="ri-arrow-right-s-line ri-lg"></text>
				</view>
			</view>
			
			<view class="order-con flex-sb">
				<view class="order-item">
					<text class="ri-wallet-3-line ri-icon"></text>
					<view class="title">
						待支付
					</view>
				</view>
				<view class="order-item">
					<text class="ri-inbox-unarchive-line ri-icon"></text>
					<view class="title">
						待发货
					</view>
				</view>
				<view class="order-item">
					<text class="ri-truck-line ri-icon"></text>
					<view class="title">
						待收货
					</view>
				</view>
				<view class="order-item">
					<text class="ri-chat-check-line ri-icon"></text>
					<view class="title">
						已完成
					</view>
				</view>
			</view>
		</view>
		
		<view class="user-total flex" v-if="accountInfo">
			<view class="user-total-item" @click="toMyCoupon()">
				<view class="val">{{accountInfo.couponCount}}</view>
				<view class="f13">优惠券</view>
			</view>
			<view class="user-total-item" @click="toScoreRecord">
				<view class="val">{{accountInfo.score || 0}}</view>
				<view class="f13">积分</view>
			</view>
			<view class="user-total-item" @click="toWalletCenter">
				<view class="val">{{accountInfo.money || 0}}</view>
				<view class="f13">余额</view>
			</view>
			<view class="user-total-item" @click="toWalletCenter">
				<text class="ri-coins-line"></text>
				<view class="f13">我的资产</view>
			</view>
		</view>
		
		<view class="order">
			<view class="order-title flex-sb"> 
				<text class="f16 fw">常用工具</text>
			</view>
			<view class="order-con flex" style="flex-wrap: wrap;">
				<view class="order-item" @click="toIntegralOrder">
					<text class="ri-file-list-3-line ri-icon"></text>
					<view class="title f14">
						兑换订单
					</view>
				</view>
				<view class="order-item" @click="toDistribution">
					<text class="ri-share-line ri-icon"></text>
					<view class="title f14">
						分销中心
					</view>
				</view>
				<view class="order-item" @click="toCoupon()">
					<text class="ri-coupon-line ri-icon"></text>
					<view class="title f14">
						领券中心
					</view>
				</view>
				<view class="order-item" @click="toCollect()">
					<text class="ri-heart-2-line ri-icon"></text>
					<view class="title f14">
						收藏夹
					</view>
				</view>
				<view class="order-item" @click="toMyCoupon">
					<text class="ri-coupon-line ri-icon"></text>
					<view class="title f14">
						我的优惠券
					</view>
				</view>
				<view class="order-item" @click="toAddress">
					<text class="ri-map-pin-2-line ri-icon"></text>
					<view class="title f14">
						收货地址
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex';
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
// #ifdef APP
import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
const uniShare = new UniShare()
// #endif
const db = uniCloud.database();

const pkAppUser = uniCloud.importObject('pk-app-user')

export default {
	data() {
		return {
			accountInfo:null
		}
	},
	onShow() {
		this.getUserAccountTotal()
	},
	computed: {
		...mapGetters({
			userInfo: 'user/info',
			hasLogin: 'user/hasLogin'
		}),
		appConfig() {
			return getApp().globalData.config
		}
	},
	methods: {
		...mapMutations({
			setUserInfo: 'user/login'
		}),
		
		async getUserAccountTotal(){
			let t = this
			let res = await pkAppUser.getUserAccountTotal()
			t.accountInfo = res.data
		},
		
		toSettings() {
			uni.navigateTo({
				url: "/pages/ucenter/settings/settings"
			})
		},
		async checkVersion() {
			let res = await callCheckVersion()
			console.log(res);
			if (res.result.code > 0) {
				checkUpdate()
			} else {
				uni.showToast({
					title: res.result.message,
					icon: 'none'
				});
			}
		},
		toUserInfo() {
			uni.navigateTo({
				url: '/pages/ucenter/set/set'
			})
		},
		
		async share() {
			let {
				result
			} = await uniCloud.callFunction({
				name: 'uni-id-cf',
				data: {
					action: 'getUserInviteCode'
				}
			})
			console.log(result);
			let myInviteCode = result.myInviteCode || result.userInfo.my_invite_code
			console.log(myInviteCode);
			let {
				appName,
				logo,
				company,
				slogan
			} = this.appConfig.about
			// #ifdef APP-PLUS
			uniShare.show({
				content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
					type: 0,
					href: this.appConfig.h5.url +
						`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
					title: appName,
					summary: slogan,
					imageUrl: logo +
						'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
				},
				menus: [{
						"img": "/static/app-plus/sharemenu/wechatfriend.png",
						"text": this.$t('common').wechatFriends,
						"share": {
							"provider": "weixin",
							"scene": "WXSceneSession"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/wechatmoments.png",
						"text": this.$t('common').wechatBbs,
						"share": {
							"provider": "weixin",
							"scene": "WXSceneTimeline"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/weibo.png",
						"text": this.$t('common').weibo,
						"share": {
							"provider": "sinaweibo"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/qq.png",
						"text": "QQ",
						"share": {
							"provider": "qq"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/copyurl.png",
						"text": this.$t('common').copy,
						"share": "copyurl"
					},
					{
						"img": "/static/app-plus/sharemenu/more.png",
						"text": this.$t('common').more,
						"share": "shareSystem"
					}
				],
				cancelText: this.$t('common').cancelShare,
			}, e => { //callback
				console.log(e);
			})
			// #endif
		},
		
		toOrderList(){
			uni.navigateTo({
				url:"/pages/shop/order"
			})
		},
		toAddress(){
			uni.navigateTo({
				url:'/pages/common/address'
			})
		},
		toCollect(){
			uni.navigateTo({
				url:'/pages/shop/collect'
			})
		},
		toCoupon(){
			uni.navigateTo({
				url:'/pages/shop/coupon'
			})
		},
		toMyCoupon(){
			uni.navigateTo({
				url:'./my_coupon'
			})
		},
		toWalletCenter(){
			uni.navigateTo({
				url:'./wallet/center'
			})
		},
		toScoreRecord(){
			uni.navigateTo({
				url:'./wallet/score_record'
			})
		},
		toIntegralOrder(){
			uni.navigateTo({
				url:'/pages/marketing/integral/order'
			})
		},
		toDistribution(){
			uni.navigateTo({
				url:'/pages/marketing/distribution/center'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.header{
	width: 100%;
	background: #fff;
	height: 200rpx;
	padding: 24rpx;
	position: relative;
	.user{
		align-items: center;
		width: 100%;
		position: relative;
		.head{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}
		.ri-settings-4-line{
			position: absolute;
			top: 24rpx;
			right: 0;
			font-size: 48rpx;
		}
	}
	
	.user-vip{
		width: 90%;
		height: 100rpx;
		background: #000;
		color: #ffc933;
		position: absolute;
		bottom: 0;
		left: 0;
		margin-left: 5%;
		border-radius: 12rpx 12rpx 0 0;
		padding: 0 24rpx;
		
		.btn{
			padding: 12rpx 32rpx;
			border-radius: 80rpx;
			background:#ffc933;
			color: #000;
		}
	}
}

.order{
	width: 94%;
	margin-left: 3%;
	background: #fff;
	border-radius: 24rpx;
	margin-top: 24rpx;
	box-shadow: 1px 1px 10px #e8e8e8;
	padding-bottom: 32rpx;
	
	
	&-title{
		height: 100rpx;
		padding: 0 24rpx;
		border-bottom: 1rpx solid #f4f4f4;
		
		.ri-arrow-right-s-line{
			position: relative;
			top: 6rpx;
		}
	}
	
	&-con{
		width: 100%;
		margin-top: 32rpx;
	}
	
	&-item{
		width: 25%;
		text-align: center;
		margin-bottom: 24rpx;
		.ri-icon{
			font-size: 52rpx;
		}
	}
}
.user-total{
	width: 94%;
	margin-left: 3%;
	background: #fff;
	border-radius: 24rpx;
	margin-top: 24rpx;
	box-shadow: 1px 1px 10px #e8e8e8;
	align-items: center;
	height: 160rpx;
	
	&-item{
		width: 25%;
		text-align: center;
	}
	.val{
		font-size: 34rpx;
		margin-bottom: 12rpx;
		font-weight: bold;
	}
	.ri-coins-line{
		font-size: 48rpx;
	}
}
</style>