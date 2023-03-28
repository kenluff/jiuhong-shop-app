<template>
<view class="goods-coupon">
	<view class="gc-view flex-sb" @click="openSelect" v-if="couponData.length > 0">
		<text class="f14">优惠券</text>
		<view class="flex-c">
			<text style="color: #FF0033;" v-if="select_index>=0">
				-{{couponData[select_index].coupon_info.coupon_price}}
			</text>
			<text v-else>暂不使用优惠券</text>
			<text class="ri-arrow-right-s-line ri-lg gy"></text>
		</view>
	</view>
	<uni-popup ref="popup" type="bottom" radius="12px 12px 0 0">
		<view class="coupon-select">
			<text class="ri-close-line" @click="closePopup"></text>
			<view class="fw f16">选择优惠券</view>
			<view class="coupon-con mt12">
				<label class="coupon-item flex-sb" 
					v-for="(item,index) in couponData" 
					:key="index"
					@click="selectCouponItem(index)"
				>
					<view class="coupon-item-left">
						<view class="price">￥{{item.coupon_info.coupon_price}}</view>
						<view class="f12 gy mt6">满{{item.coupon_info.low_price}}可用</view>
					</view>
					<view class="coupon-item-center">
						<view class="name text-hidden">{{item.coupon_info.name}}</view>
						<view class="f12 gy mt6">
							<uni-dateformat :date="item.coupon_info.start_time" format="MM/dd hh:mm"></uni-dateformat>~
							<uni-dateformat :date="item.coupon_info.end_time" format="MM/dd hh:mm"></uni-dateformat>
						</view>
					</view>	
					<radio :checked="select_index == index"/><text></text>
				</label>
				<label class="coupon-item flex-sb" @click="selectCouponItem(-1)">
					<view class="coupon-item-center">暂不使用优惠券</view>
					<radio :checked="select_index == -1"/><text></text>
				</label>
			</view>
			<view class="coupon-button" @click="selectSuccess">确认</view>
		</view>
	</uni-popup>
</view>
</template>

<script>
export default{
	name:'goods-coupon',
	props:{
		couponData:{
			type:Array
		},
	},
	data(){
		return{
			select_index:0,
		}
	},
	mounted() {
		if( this.couponData.length > 0 ){
			this.selectSuccess()
		}
	},
	methods:{
		openSelect(){
			this.$refs.popup.open()
		},
		closePopup(){
			this.$refs.popup.close()
		},
		selectSuccess(){
			if( this.select_index >=0 ){
				this.$emit('success',this.couponData[this.select_index])
			}else{
				this.$emit('success',null)
			}
			this.closePopup()
		},
		selectCouponItem(index){
			this.select_index = index
		}
	}
}
</script>

<style lang="scss" scoped>
.gc-view{
	width: 100%;
	align-items: center;
	height: 80rpx;
}
.coupon-select{
	width: 100%;
	height: 1000rpx;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	padding: 24rpx;
	position: relative;
	.ri-close-line{
		position: absolute;
		right: 24rpx;
		top: 24rpx;
		font-size: 44rpx;
	}
	
	.coupon-con{
		width: 100%;
		height: 700rpx;
		overflow: hidden;
		overflow-y: auto;
	}
	.coupon-item{
		width: 100%;
		height: 150rpx;
		align-items: center;
		border-bottom: 1px solid #f4f4f4;
		
		&-left{
			width:200rpx;
		}
		&-center{
			flex: 1;
			width: 60%;
		}
		.price{
			color: #FF0066;
		}
	}
	.coupon-button{
		width: 100%;
		height: 90rpx;
		border-radius: 90rpx;
		background: $uni-color-primary;
		text-align: center;
		line-height: 90rpx;
		font-size: 36rpx;
		margin-top: 24rpx;
		color: #fff;
	}
}
</style>