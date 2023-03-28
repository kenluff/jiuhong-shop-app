<template>
<view class="wallet-center">
	<view class="wallect-card">
		<view class="header flex-sb">
			<text>可用余额</text>
			<view class="header-btn flex">
				<!-- <view class="header-btn-li">提现</view>
				<view class="header-btn-li">充值</view> -->
			</view>
		</view>
		<view class="price">
			<text class="f14">￥</text>
			<text class="price-txt">{{accountInfo ? accountInfo.money : '0.00'}}</text>
		</view>
	</view>
	
	
	<view class="pk-card flex-sb wallect-record" style="margin-top: 48rpx;" @click="toMoneyRecord">
		<view class="flex-c"> 
			<text class="ri-file-list-3-line" style="font-size: 44rpx;"></text> 
			<text class="fw ml6">交易记录</text>
		</view>
		<text class="ri-arrow-right-s-line" style="font-size: 44rpx;"></text>
	</view>
	<view class="pk-card flex-sb wallect-record mt12" 
		@click="toRecharge" 
		v-if="recharge_open == 1"
	>
		<view class="flex-c"> 
			<text class="ri-refund-line" style="font-size: 44rpx;"></text> 
			<text class="fw ml6">余额充值</text>
		</view>
		<text class="ri-arrow-right-s-line" style="font-size: 44rpx;"></text>
	</view>
	<view class="pk-card flex-sb wallect-record mt12" @click="toSetPassword">
		<view class="flex-c"> 
			<text class="ri-key-line" style="font-size: 44rpx;"></text> 
			<text class="fw ml6">支付密码设置</text>
		</view>
		<text class="ri-arrow-right-s-line" style="font-size: 44rpx;"></text>
	</view>
</view>
</template>

<script>
const pkAppUser = uniCloud.importObject('pk-app-user')
const pkAppCommon = uniCloud.importObject('pk-app-common')
export default{
	data(){
		return{
			accountInfo:null,
			recharge_open:0,
		}
	},
	async onLoad() {
		let t = this
		let res = await pkAppCommon.getSet(['recharge_open'])
		if( res.data ){
			t.recharge_open = res.data.recharge_open || 0
		}
	},
	onShow() {
		let t = this
		uni.showLoading({title:'玩命加载中...'})
		this.getUserAccountTotal()
		uni.hideLoading()
	},
	methods:{
		async getUserAccountTotal(){
			let t = this
			let res = await pkAppUser.getUserAccountTotal()
			t.accountInfo = res.data
		},
		toMoneyRecord(){
			uni.navigateTo({
				url:'./money-record'
			})
		},
		toSetPassword(){
			uni.navigateTo({
				url:'./set_pay_password'
			})
		},
		toRecharge(){
			uni.navigateTo({
				url:'./recharge'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.wallect-card{
	width: 94%;
	margin-left: 3%;
	border-radius: 16rpx;
	height: 300rpx;
	background: linear-gradient(45deg,#FF9900,#FF0033);
	position: relative;
	top: 24rpx;
	padding: 24rpx;
	color: #fff;
	.header{
		align-items: center;
	}
	.header-btn{
		&-li{
			padding: 8rpx 32rpx;
			border: 1px solid #fff;
			margin-left: 24rpx;
			border-radius: 80rpx;
			font-size: 26rpx;
		}
	}
	.price{
		margin-top: 48rpx;
	}
	.price-txt{
		font-size: 64rpx;
	}
}

.wallect-record{
	height: 100rpx;
}
</style>