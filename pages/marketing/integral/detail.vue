<template>
<view class="integral-detail" v-if="info">
	<view class="swiper">
		<swiper class="swiper-view" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in info.slide" :key="index">
				<image class="cover" :src="item" mode=""></image>
			</swiper-item>
		</swiper>
	</view>
	<view class="goods-info">
		<view class="name f15">
			{{info.name}}
		</view>
		<view class="f12 gy mt6">{{info.simple_desc}}</view>
		<view class="price flex-sb mt12">
			<view>
				<text class="score f16 fw">{{info.score}}积分</text>
				<text class="old-price ml6 f12 gy">￥{{info.old_price}}</text>
			</view>
			
			<text class="f13 gy">已兑{{info.sale_count}}件</text>
		</view>
	</view>
	<view class="goods-detail mt12">
		<u-parse :html="info.detail"></u-parse>
	</view>
	<fix-footer>
		<view class="exchange-btn" @click="toExchange">立即兑换</view>
	</fix-footer>
</view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue'
import fixFooter from '@/components/fix-footer.vue'
export default{
	components:{
		uParse,
		fixFooter
	},
	data(){
		return{
			id:'',
			info:null
		}
	},
	onLoad(opt) {
		let t = this
		t.id = opt.id
		t.getGoodsDetail()
	},
	methods:{
		async getGoodsDetail(){
			let t = this
			let res = await t.$request('integral','getIntegralGoodsDetail',t.id)
			t.info = res.data
		},
		async toExchange(){
			let t = this
			if( t.info.type == 1 ){
				uni.navigateTo({
					url:'./confirm?id='+this.id
				})
				return
			}
			
			//优惠券直接兑换
			uni.showLoading({
				title:'正在兑换...',
			})
			let res = await t.$request('integral','exchangeGoods',{goods_id:t.id,count:1})
			uni.hideLoading()
			if( res.errCode == 0 && !res.code ){
				uni.showToast({
					title:'兑换成功',
					success() {
						setTimeout(function(){
							uni.redirectTo({
								url:'./order'
							})
						},1000)
					}
				})
			}
			
		}
	}
}
</script>

<style lang="scss" scoped>
.swiper{
	width: 100%;
	height: 750rpx;
	
	.swiper-view,.cover{
		width: 100%;
		height: 100%;
	}
}
.goods-info{
	padding: 24rpx;
	background: #fff;
	.score{
		color: $uni-color-primary;
	}
	.old-price{
		text-decoration: line-through;
	}
}
.goods-detail{
	background: #fff;
	width: 100%;
	padding: 24rpx;
}
.exchange-btn{
	width: 94%;
	margin-left: 3%;
	height: 90rpx;
	text-align: center;
	line-height: 90rpx;
	border-radius: 12rpx;
	background: $uni-color-primary;
	color: #fff;
}
</style>