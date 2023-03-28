<template>
<view v-if="userInfo">
	<view class="header flex-c">
		<!-- <view class="num f14">榜单</view> -->
		<image v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" mode=""></image>
		<image v-else src="../../../static/img/default-head.png" class="avatar" mode=""></image>
		<view class="header-right">
			<view class="f16 fw">{{userInfo.nickname}}</view>
			<view class="f12 mt12">邀请码：{{userInfo.disUser.share_code}}</view>
		</view>
	</view>
	<view class="pk-card dis-money flex mt12">
		<view class="dis-money-item" @click="toWithdraw">
			<view class="value fw" style="color: #FF6633;">
				<text class="f12">￥</text>{{userInfo.disUser.money}}
			</view>
			<view class="mt6 f13 gy">待提现金额</view>
		</view>
		<view class="dis-money-item">
			<view class="value fw" style="color: #FF6633;">
				<text class="f12">￥</text>{{userInfo.disUser.frozen_money}}
			</view>
			<view class="mt6 f13 gy">待结算金额</view>
		</view>
	</view>
	
	<view class="pk-card dis-money flex mt12">
		<view class="dis-money-item" @click="toDisOrder">
			<view class="value">{{userInfo.disUser.total_order || 0}}</view>
			<view class="mt6 f13 gy flex-c">累计分销订单 <text class="ri-arrow-right-s-line"></text></view>
		</view>
		<view class="dis-money-item" @click="toTeam">
			<view class="value">{{userInfo.disUser.total_user || 0}}</view>
			<view class="mt6 f13 gy flex-c">累计下线人数 <text class="ri-arrow-right-s-line"></text></view>
		</view>
	</view>
	
	<view class="pk-card mt12">
		<view class="title f16 fw">常用工具</view>
		
		<view class="dis-tool flex mt12">
			<view class="dis-tool-item" @click="toWithdraw">
				<view class="tool-icon icon-1">
					<text class="ri-file-list-3-line ri-icon"></text>
				</view>
				<view class="name f14 mt6">提现</view>
			</view>
			<view class="dis-tool-item" @click="toMoneyLog">
				<view class="tool-icon icon-2">
					<text class="ri-wallet-3-line ri-icon"></text>
				</view>
				<view class="name f14 mt6">余额记录</view>
			</view>
			<view class="dis-tool-item" @click="toTeam">
				<view class="tool-icon icon-3">
					<text class="ri-team-line ri-icon"></text>
				</view>
				<view class="name f14 mt6">下线用户</view>
			</view>
			<view class="dis-tool-item" @click="toAgreement">
				<view class="tool-icon icon-5">
					<text class="ri-list-unordered ri-icon"></text>
				</view>
				<view class="name f14 mt6">分销协议</view>
			</view>
		</view>
	</view>
	
</view>
</template>

<script>
export default{
	data(){
		return{
			userInfo:null,
		}
	},
	onShow() {
		this.getDisInfo()
	},
	methods:{
		async getDisInfo(){
			let t = this
			let res =await t.$request('distribution','getDisUserbyUser')
			if( res.data ){
				t.userInfo = res.data
			}else{
				uni.redirectTo({
					url:'./apply'
				})
			}
			
		},
		
		toWithdraw(){
			uni.navigateTo({
				url:'./withdraw'
			})
		},
		toDisOrder(){
			uni.navigateTo({
				url:'./order'
			})
		},
		toMoneyLog(){
			uni.navigateTo({
				url:'./money-record'
			})
		},
		toTeam(){
			uni.navigateTo({
				url:'./team'
			})
		},
		toAgreement(){
			uni.navigateTo({
				url:'/pages/common/agreement?type='+2
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.header{
	width: 100%;
	position: relative;
	height: 240rpx;
	background: $uni-color-primary;
	color: #fff;
	padding-left: 24rpx;
	.avatar{
		width:120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	
	.num{
		position: absolute;
		background: rgba(#fff, .2);
		color: #fff;
		right: 0;
		border-radius: 40rpx 0 0 40rpx;
		padding: 6rpx 24rpx 6rpx 32rpx;
		top: 48rpx;
	}
}

.dis-money{
	&-item{
		width: 50%;
		height: 140rpx;
		text-align: center;
		padding-top: 24rpx;
		
		&:first-child{
			border-right: 1rpx solid #f4f4f4;
		}
		.value{
			font-size: 40rpx;
		}
		
		.flex-c{
			justify-content: center;
		}
	}
}

.dis-tool{
	flex-wrap: wrap;
	
	&-item{
		width: 25%;
		height: 160rpx;
		text-align: center;
		
		.tool-icon{
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			background: greenyellow;
			text-align: center;
			line-height: 90rpx;
			color: #fff;
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			
			.ri-icon{
				font-size: 48rpx;
			}
		}
		.icon-1{
			background: linear-gradient(220.55deg, #FFF500 0%, #FFB800 100%);
		}
		.icon-2{
			background: linear-gradient(220.55deg, #8FFF85 0%, #39A0FF 100%);
			
		}
		.icon-3{
			background: linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%);
		}
		.icon-4{
			background: linear-gradient(220.55deg, #FFD439 0%, #FF7A00 100%);
		}
		.icon-5{
			background: linear-gradient(220.55deg, #7CF7FF 0%, #4B73FF 100%);
		}
	}
}

</style>