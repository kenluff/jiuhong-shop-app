<template>
<view class="my-coupon">
	<view class="nav-header">
		<u-tabs :list="nav" :current="nav_current" @change="changeNav" itemWidth="33.3%"></u-tabs>
	</view>
	
	<view class="coupon-content">
		<view class="coupon-item flex" v-for="(item,index) in list" :key="index">
			<view class="coupon-item-left" :class="(item.is_use == 1 || item.is_expire) ?'coupon-use':''">
				<view class="first-cycle"></view>
				<view class="coupon-price">
					<text class="f13">￥</text>
					<text class="price">{{item.coupon_info.coupon_price}}</text>
				</view>
				<view class="low f14">满{{item.coupon_info.low_price}}减{{item.coupon_info.coupon_price}}</view>
			</view>
			<view class="coupon-item-right">
				<view class="f16 text-hidden mt16">{{item.coupon_info.name}}</view>
				<template v-if="item.is_expire">
					<view class="use-btn f13 mt12 coupon-use">已过期</view>
				</template>
				<template v-else>
					<view class="use-btn f13 mt12" v-if="item.is_use==0">去使用</view>
					<view class="use-btn f13 mt12 coupon-use" v-if="item.is_use==1">已使用</view>
				</template>
				<view class="time f12">
					<uni-dateformat :date="item.coupon_info.start_time" format="yy/MM/dd hh:mm"></uni-dateformat>~
					<uni-dateformat :date="item.coupon_info.end_time" format="yy/MM/dd hh:mm"></uni-dateformat>
				</view>
				<view class="end-cycle"></view>
			</view>
		</view>
		<none-content v-if="!is_content" top="150"></none-content>	
	</view>
	
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
const pkAppCoupon = uniCloud.importObject('pk-app-coupon')
export default{
	components:{
		uTabs
	},
	data(){
		return{
			nav:[
				{name:'未使用',status:0},
				{name:'已使用',status:1},
				{name:'已过期',status:2},
			],
			list:[],
			page:1,
			nav_current:0,
			is_content:true
		}
	},
	onLoad() {
		this.getMyCoponList(1)
	},
	methods:{
		async getMyCoponList(page){
			let t = this
			try{
				uni.showLoading({title:'玩命加载中...'})
				let res = await pkAppCoupon.getMyCoupon(page,10,{status:t.nav_current})
				t.page = page
				if( page == 1 ) {
					t.list = res.data
				}else{
					t.list = t.list.concat(res.data)
				}
				t.is_content = t.list.length != 0
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		
		changeNav(e){
			this.nav_current = e
			this.getMyCoponList(1)
		}
	}
}
</script>

<style lang="scss" scoped>
.coupon-content{
	margin-top: 54px;
}
.coupon-item{
	width: 94%;
	margin-left: 3%;
	background: #fff;
	border-radius: 12rpx;
	height: 260rpx;
	margin-top: 24rpx;
	&-left{
		width: 240rpx;
		height: 100%;
		text-align: center;
		padding-top: 56rpx;
		color: #fff;
		background: linear-gradient(45deg, #f4ddc0, #f38989);
		border-radius: 12rpx 0 0 12rpx;
		position: relative;
		
		.first-cycle{
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			background: #f4f4f4;
			border-radius: 50%;
			left: -20rpx;
			top: 105rpx;
		}
	}
	
	
	.price{
		font-size: 64rpx;
	}
	
	&-right{
		width: 60%;
		flex: 1;
		padding-left: 24rpx;
		position: relative;
		.end-cycle{
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			background: #f4f4f4;
			border-radius: 50%;
			right: -20rpx;
			top: 105rpx;
		}
	}
	.use-btn{
		display: inline-block;
		padding: 6rpx 24rpx;
		background: #f38989;
		color: #fff;
		border-radius: 80rpx;
	}
	.time{
		height: 70rpx;
		border-top: 1px dashed #999;
		line-height: 70rpx;
		width: 90%;
		position: absolute;
		bottom: 0;
	}
	.coupon-use{
		background: #d7d7d7;
	}
}
</style>