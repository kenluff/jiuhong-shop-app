<template>
<view class="integral-list">
	<view class="order-header">
		<u-tabs :list="nav" :current="nav_index" itemWidth="50%" @change="changeGoods"></u-tabs>
	</view>
	<view class="goods-content flex-sb">
		<view class="goods-item" 
			v-for="(item,index) in goodsList" 
			:key="index"
			@click="toGoodsDetail(item._id)"
		>
			<image :src="item.cover" class="cover" mode=""></image>
			<view class="name text-hidden">
				{{item.name}}
			</view>
			<view class="desc f12 gy text-hidden mt6">{{item.simple_desc}}</view>
			<view class="price mt6">
				<text class="score">{{item.score}}积分</text>
				<text class="old-price f12 gy">￥{{item.old_price}}</text>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
export default{
	components:{
		uTabs
	},
	data(){
		return{
			nav:[
				{name:'实物商品',status:1},
				{name:'优惠券',status:2},
			],
			nav_index:0,
			goodsList:[],
			page:1,
		}
	},
	onLoad() {
		this.getIntegralGoods(1)
	},
	onReachBottom() {
		this.getIntegralGoods(this.page+1)
	},
	methods:{
		async getIntegralGoods(page){
			let t = this
			let _w = {
				type:t.nav[t.nav_index].status
			}
			let res = await t.$request('integral','getIntegralGoods',{page,limit:12,search:_w})
			if( page == 1 ){
				t.goodsList = res.data
			}else{
				t.goodsList = t.goodsList.concat(res.data)
			}
			
			t.page = page
		},
		
		changeGoods(e){
			this.nav_index = e
			this.getIntegralGoods(1)
		},
		toGoodsDetail(id){
			uni.navigateTo({
				url:'./detail?id='+id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-header{
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
.goods-content{
	width: 100%;
	position: relative;
	top: 41px;
	padding: 24rpx;
	flex-wrap: wrap;
	
	.goods-item{
		width: 48%;
		background: #fff;
		border-radius: 24rpx;
		height: 520rpx;
		margin-bottom: 24rpx;
		
		.cover{
			width: 100%;
			height: 350rpx;
			border-radius: 24rpx 24rpx 0 0;
		}
		.desc,.name,.price{
			padding: 0 12rpx;
		}
		.old-price{
			text-decoration: line-through;
		}
		.score{
			color: $uni-color-primary;
		}
	}
}
</style>