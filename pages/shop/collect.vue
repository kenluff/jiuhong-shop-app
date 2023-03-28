<template>
<view class="collect">
	<uni-swipe-action>
		<uni-swipe-action-item v-for="(item,index) in list" :key="index">
			<view class="collect-item flex" @click="toGoodsDetail(item.goods_id)">
				<image :src="item.goods.cover" class="cover" mode=""></image>
				<view class="collect-item-right">
					<view>
						<text class="f14">￥</text>
						<text class="f18 fw">{{item.goodsInfo.price}}</text>
						<text class="old-price f12 gy ml6">￥{{item.goodsInfo.old_price}}</text>
					</view>
					<view class="text-hidden mt6 f15">{{item.goods.name}}</view>
					<view class="cart-icon" @click.stop="showSku(item.goodsInfo)">
						<text class="ri-shopping-cart-line"></text>
					</view>
				</view>
			</view>
			<template v-slot:right>
				<view class="delete-con" @click="deleteCollect(item.goods_id)"><text>删除</text></view>
			</template>
		</uni-swipe-action-item>
	</uni-swipe-action>
	
	<goods-sku ref="sku" :goodsData="skuData" :buyType="1"></goods-sku>
</view>
</template>

<script>
import goodsSku from './components/goods-sku.vue'
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	components:{
		goodsSku
	},
	data(){
		return{
			list:[],
			page:1,
			skuData:null
		}
	},
	onLoad() {
		this.getCollectGoods(1,10)
	},
	onReachBottom() {
		this.getCollectGoods(this.page+1,10)
	},
	methods:{
		async getCollectGoods(page,limit){
			let t = this
			try{
				t.page = page
				uni.showLoading({title:"玩命加载中..."})
				let res = await pkAppGoods.getCollectGoods(page,limit)
				uni.hideLoading()
				if( page == 1 ){
					t.list = res.data
				}else{
					t.list = t.list.concat(res.data)
				}
			}catch(e){
				uni.hideLoading()
			}
		},
		async deleteCollect(goods_id){
			let t = this
			try{
				uni.showLoading({title:'正在取消'})
				let res = await pkAppGoods.collectGoods(goods_id)
				uni.hideLoading()
				uni.showToast({
					title:res.errMsg,
					success() {
						setTimeout(function(){
							t.getCollectGoods(1,10)
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
		},
		async showSku(data){
			let t = this
			t.skuData = data
			uni.showLoading({title:'加载中...'})
			if( data.is_open_sku == 1 ){
				setTimeout(function(){
					t.$refs.sku.openOrCloseSpec(true)
					uni.hideLoading()
				},500)
				return
			}
			let res = await pkAppGoods.addGoodsCart(data._id,1,null)
			uni.hideLoading()
			uni.showToast({title:'已加入购物车'})
		},
		
		toGoodsDetail(goods_id){
			uni.navigateTo({
				url:'./goods_detail?goods_id='+goods_id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.collect-item{
	width: 100%;
	background: #fff;
	border-bottom: 1px solid #f4f4f4;
	padding: 24rpx;
	position: relative;
	.cover{
		width: 180rpx;
		height: 180rpx;
		border-radius: 6rpx;
	}
	
	&-right{
		flex: 1;
		width: 60%;
		margin-left: 24rpx;
	}
	.old-price{
		text-decoration: line-through;
	}
	.cart-icon{
		width: 56rpx;
		height: 56rpx;
		background: $uni-color-primary;
		color: #fff;
		text-align: center;
		border-radius: 50%;
		line-height: 56rpx;
		position: absolute;
		bottom: 24rpx;
		right: 24rpx;
	}
}
.delete-con{
	width: 200rpx;
	background: #FF0033;
	text-align: center;
	line-height: 208rpx;
	color: #fff;
}
</style>