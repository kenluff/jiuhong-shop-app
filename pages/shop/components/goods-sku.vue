<template>
<view class="goods-sku">
	<uni-popup ref="specPopup" type="bottom" :safeArea="false" :mask-click="false">
		<view class="popup-spec" v-if="goods">
			<text class="ri-close-line" @click="openOrCloseSpec(false)"></text>
			<view class="spec-info flex">
				<image :src="selectSpec ?selectSpec.cover:goods.cover" class="cover"></image>
				<view class="spec-info-right ml12">
					<view class="price">
						<text class="f18">￥{{selectSpec?selectSpec.price :goods.price}}</text>	
						<text class="old-price f12 gy ml6">￥{{goods.old_price}}</text>	
					</view>
					<view class="f13 mt12"> 剩余库存：{{selectSpec?selectSpec.stock:goods.stock}} </view>
					<view class="f13 mt12" v-if="selectSpec"> 已选 {{selectSpec.name}} </view>
				</view>
			</view>
			<view class="popup-spec-count flex-sb">
				<text class="f16">购买数量</text>
				<uni-number-box v-model="form.count"></uni-number-box>
			</view>
			<view class="popup-spec-content">
				<view class="popup-spec-item" v-for="(item,index) in goods.spec" :key="index">
					<view class="f16">{{item.name}}</view>
					<view class="item-ul flex">
						<view class="item-ul-li" 
							:class="item.checked == val ?'active':''" 
							v-for="(val,ind) in item.specValue"
							@click="checkSpecValue(index,val)"
						>
							{{val}}
						</view>
					</view>
				</view>
			</view>
			<button class="spec-sure" @click="sureBuy" :loading="joinLoading">确定</button>
		</view>
	</uni-popup>
</view>
</template>

<script>
const db = uniCloud.database()
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	name:'goods-sku',
	props:{
		goodsData:{
			type:Object
		},
		buyType:{
			type:Number,
			default:2,	//2购买 1加入购物车
		},
	},
	data(){
		return{
			selectSpec:null,
			skuData:[],
			form:{
				count:1,
			},
			joinLoading:false,
			goods:null
		}
	},
	methods:{
		async openOrCloseSpec(type){
			let t = this
			if( type ) {
				console.log(t.goodsData);
				if( t.goodsData  ){
					console.log('111');
					t.goods = JSON.parse(JSON.stringify(t.goodsData))
					console.log(t.goods);
					if( t.goodsData.is_open_sku == 1 ){
						t.goods.spec.forEach(item=>{
							if( item.specValue.length > 0 ){
								item.checked = item.specValue[0]
							}
						})
						
						let skuRes = await db.collection('pk-goods-sku')
							.where({goods_id:t.goodsData._id}).get()
						t.skuData = skuRes.result.data
						t.getSpec()
					}
					
				}
				t.$refs.specPopup.open()
			}else{
				this.$refs.specPopup.close()
			}
		},
		checkSpecValue(index,name){
			this.goods.spec[index].checked = name
			this.getSpec()
		},
		
		async getSpec(){
			let t = this, { goods } = t , sku_name_arr = []
			goods.spec.forEach(item=>{
				sku_name_arr.push(item.checked)
			})
			
			for (let i = 0; i < t.skuData.length; i++) {
				if( t.skuData[i].name == sku_name_arr.join('-') ){
					t.selectSpec = t.skuData[i]
				}
			}
		},
		
		async sureBuy(){
			let t = this
			try{
				if( t.buyType == 1 ){
					t.joinLoading = true
					let res = await pkAppGoods.addGoodsCart(t.goods._id,t.form.count,t.selectSpec)
					uni.showToast({title:'已加入购物车'})
					t.openOrCloseSpec(false)
					t.joinLoading = false
				}
				if(t.buyType== 2 ){
					let url = `/pages/shop/confirm?buy_type=1&goods_id=${t.goods._id}&count=${t.form.count}`
					if( t.selectSpec ){
						url+= `&sku_id=${t.selectSpec._id}`
					}
					uni.navigateTo({
						url:url
					})
				}
			}catch(e){
				t.joinLoading = false
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.popup-spec{
	width: 100%;
	background: #fff;
	height: 1000rpx;
	border-radius: 24rpx 24rpx 0 0;
	padding: 24rpx;
	position: relative;
	.ri-close-line{
		position: absolute;
		right: 24rpx;
		top: 24rpx;
		font-size: 44rpx;
	}
	.spec-info{
		.cover{
			width: 220rpx;
			height: 220rpx;
		}
		.old-price{
			text-decoration: line-through;
		}
	}
	
	&-count{
		height: 100rpx;
		width: 100%;
		align-items: center;
	}
	&-content{
		width: 100%;
		height: 460rpx;
		overflow: hidden;
		overflow-y: auto;
	}
	
	&-item{
		width: 100%;
		margin-bottom: 16rpx;
		.item-ul{
			width:100%;
			flex-wrap: wrap;
			margin-top: 12rpx;
			
			&-li{
				display: inline-block;
				padding: 6rpx 24rpx;
				background: #efefef;
				margin-right: 24rpx;
				font-size: 28rpx;
			}
			.active{
				background: #000;
				color: #fff;
			}
		}
	}
	
	.spec-sure{
		width: 100%;
		background: #000;
		color: #fff;
		margin-top: 24rpx;
	}
}
</style>