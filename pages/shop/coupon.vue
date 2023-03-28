<template>
<view class="coupon">
	<view class="coupon-item flex" v-for="(item,index) in list" :key="index">
		<view class="left">
			<view class="price">
				<text class="f12">￥</text>
				<text class="price-txt">{{item.coupon_price}}</text>
			</view>
			<view class="f13">满{{item.low_price}}元可用</view>
		</view>
		<view class="center">
			<view class="name fw f16 text-hidden">{{item.name}}</view>
			<view class="f12 mt6 gy">
				到期时间：<uni-dateformat :date="item.end_time" format="yyyy/MM/dd hh:mm"></uni-dateformat>
			</view>
		</view>
		<view class="right" @click="receiveCoupon(item._id)" v-if="item.isGet == 0">
			<view>立</view>
			<view>即</view>
			<view>领</view>
			<view>取</view>
		</view>
		<view class="right right-get" v-if="item.isGet == 1">
			<view>已</view>
			<view>领</view>
			<view>取</view>
		</view>
		<view class="cycle">
			<view class="cycle-li" v-for="(val,ind) in 7" :key="ind"></view>
		</view>
	</view>
</view>
</template>

<script>
const pkAppCoupon = uniCloud.importObject('pk-app-coupon')
export default{
	data(){
		return{
			list:[],
			page:1,
		}
	},
	onLoad() {
		this.getCoupon(1)
	},
	onReachBottom() {
		this.getCoupon(this.page+1)
	},
	methods:{
		async getCoupon(page){
			let t = this
			try{
				uni.showLoading({title:'玩命加载中...'})
				let res = await pkAppCoupon.getCouponList(page,10)
				t.page = page
				if( page == 1 ){
					t.list = res.data
				}else{
					t.list = t.list.concat(res.data)
				}
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		async receiveCoupon(id){
			let t = this
			try{
				uni.showLoading({title:'领取中...'})
				let res = await pkAppCoupon.receiveCoupon(id)
				uni.hideLoading()
				uni.showToast({
					title:'领取成功',
					success() {
						setTimeout(function(){
							t.getCoupon(1)
						},1000)
					}
				})
			}catch(e){
				uni.hideLoading()
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.coupon-item{
	width: 94%;
	margin-left: 3%;
	height:200rpx;
	background: #fff;
	border-radius: 12rpx;
	margin-top: 24rpx;
	position: relative;
	
	.left{
		width: 220rpx;
		border-right: 1rpx dashed red;
		height: 80%;
		margin-top: 3%;
		text-align: center;
		padding-top: 24rpx;
		color: $uni-color-primary;
		padding: 24rpx;
		.price-txt{
			font-size: 48rpx;
		}
	}
	.center{
		flex: 1;
		width: 40%;
		padding: 12rpx;
		padding-top: 56rpx;
	}
	.right{
		width: 100rpx;
		background: $uni-color-primary;
		color: #fff;
		text-align: center;
		padding-top: 20rpx;
		border-radius: 0 12rpx 12rpx 0;
	}
	.right-get{
		padding-top: 28rpx;
		background: rgba($uni-color-primary, .3);
	}
	.cycle{
		position: absolute;
		width: 20rpx;
		height: 100%;
		right: 90rpx;
		top: -6rpx;
		
		&-li{
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			background: #f4f4f4;
			margin-bottom: 12rpx;
			position: relative;
		}
	}
	
}
</style>