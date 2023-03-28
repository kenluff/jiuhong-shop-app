<template>
<view v-if="goods">
	<view class="goods-swiper">
		<swiper class="goods-swiper-con" @change="changSlide">
			<swiper-item v-for="(item,index) in goods.slide" :key="index">
				<image :src="item" class="slide" mode=""></image>
			</swiper-item>
		</swiper>
		<view class="slide-count"> {{slide_current}}/{{ goods.slide.length}} </view>
	</view>
	
	<view class="goods-info">
		<view>
			<text class="f12 gy" style="color: red;">￥</text>	
			<text class="price fw">{{goods.price}}</text>
			<text class="old-price gy ml6 f12">￥{{goods.old_price}}</text>	
		</view>
		<view class="mt12 flex-sb goods-info-title">
			<view class="fw goods-name">
				{{goods.name}}
			</view>
			<text class="collect-icon mr6" :style="{color:collect?'#FF6633':''}" 
				:class=" collect?'ri-heart-2-fill': 'ri-heart-2-line'" 
				@click="collectGoods(goods._id)"
			></text>
			<pk-share :path="'/pages/shop/goods_detail?goods_id='+goods._id" :fontSize="21"></pk-share>
		</view>
		<view class="desc f12 gy mt6">
			{{goods.simple_desc}}
		</view>
	</view>
	
	<view class="goods-simple">
		<view class="service flex-c f13" v-if="goods.is_open_sku == 1 && selectSpec">
			<view class="title fw">规格</view>
			<view class="content" @click="openOrCloseSpec(true,2)"> 已选 {{selectSpec.name}} </view>
			<text class="ri-arrow-right-s-line f18"></text>
		</view>
		<view class="service flex-c f13" v-if="serviceData && serviceData.length > 0">
			<view class="title fw">服务</view>
			<view class="flex-sb content" @click="openOrCloseServicePopup(true)">
				<view class="content-center">
					<view class="service-li" v-for="(val,ind) in serviceData" :key="ind">
						<text >
							{{val.name}}
						</text>
						<text class="ml6 mr6" v-if="ind !=  serviceData.length-1"> • </text>		
					</view>
				</view>
				<text class="ri-arrow-right-s-line f18"></text>
			</view>
		</view>
		<view class="service flex-c f13" v-if="address">
			<view class="title fw">配送</view>
			<view class="content"> {{address}} </view>
		</view>
	</view>
	<view class="goods-recommend" v-if="commentData.length >0 ">
		<view class="flex-sb" @click="toCommentList">
			<text class="f16 fw">商品评论</text>
			<view class="gy flex-c">
				<text class="f13">查看全部</text>
				<text class="ri-arrow-right-s-line"></text>
			</view>
		</view>
		<comment-item v-for="(item,index) in commentData" :key="index" :commentData="item"></comment-item>
	</view>
	
	<view class="goods-recommend" v-if="recommendData.length>0">
		<view class="f16 fw">关联推荐</view>
		<scroll-view scroll-x="true" class="goods-content mt6">
			<view class="goods-item" v-for="(item,index) in recommendData" :key="index">
				<image class="goods-item-cover" :src="item.cover" mode=""></image>
				<view class="goods-item-name">{{item.name}}</view>
				<view class="price"> ￥{{item.price}} </view>
				<view class="old-price f12 gy">￥{{item.old_price}}</view>
			</view>
		</scroll-view>
	</view>
	
	<view class="goods-desc">
		<view class="f16 fw">商品详情</view>
		<view class="mt6">
			<u-parse :html="goods.goods_detail"></u-parse>
		</view>
	</view>
	<fix-footer>
		<view class="footer-left flex">
			<view class="left-icon" @click="toCart">
				<text class="ri-shopping-cart-2-line"></text>
				<view class="brage" v-if="cartCount >0">
					<text v-if="cartCount<99">{{cartCount}}</text>	
					<text v-else>99+</text>	
				</view>
				<view class="cart-txt f12">购物车</view>
			</view>
		</view>
		<view class="footer-right">
			<button :loading="joinLoading"
				class="join-cart" 
				type="primary" 
				@click="openOrCloseSpec(true,1)"
			>
				加入购物车
			</button>
			<button :loading="joinLoading"
				class="join-cart" 
				type="primary" 
				@click="openOrCloseSpec(true,2)"
			>
				立即购买
			</button>
		</view>
		
	</fix-footer>

	<!-- 服务信息 -->
	<uni-popup ref="servicePopup" type="bottom">
		<view class="popup-service">
			<text class="ri-close-line" @click="openOrCloseServicePopup(false)"></text>
			<view class="title fw f16">商品服务说明</view>
			<view class="service-con">
				<view class="service-item mt12" v-for="(val,ind) in serviceData" :key="ind">
					<view class="f14 fw">{{val.name}}</view>	
					<view class="f13 gy mt6">
						{{val.content}}
					</view>	
				</view>
			</view>
		</view>
	</uni-popup>
	
	<!-- 规格 -->
	<uni-popup ref="specPopup" type="bottom">
		<view class="popup-spec">
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
import pkShare from '@/components/pk-share.vue'
import uParse from '@/components/u-parse/u-parse.vue'
import fixFooter from '@/components/fix-footer.vue'
import commentItem from './components/comment-item.vue'
const db = uniCloud.database()
const dbCmd = db.command
const pkAppGoods = uniCloud.importObject('pk-app-goods')
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	components:{
		pkShare,
		uParse,
		fixFooter,
		commentItem
	},
	data(){
		return{
			goods_id:0,
			goods:null,
			recommendData:[],
			serviceData:[],
			slide_current:1,
			joinLoading:false,
			cartCount:0,
			selectSpec:null,		//选择的规格
			form:{
				count:1,
				buy:2,	//1加入购物车 2直接购买
			},
			skuData:[],
			commentData:[],
			address:null,
			collect:false,
		}
	},
	async onLoad(opt) {
		let t = this
		t.goods_id = opt.goods_id
		uni.showLoading({
			title:'玩命加载中...'
		})
		if( opt.share_code ){
			uni.setStorageSync('__share_code__',opt.share_code)
		}
		await t.getGoodsDetail()
		//查询购物车商品数量
		let cartRes = await pkAppGoods.getCartCountBuyUser()
		t.cartCount = cartRes.data
		
		//获取商品评论
		let commentRes = await pkAppGoods.getCommentByGoods(1,3,{goods_id:t.goods_id})
		t.commentData = commentRes.data.list
		
		let res = await pkAppUser.getAddressDetail({is_default:1})
		t.address = res.data.provice+' '+res.data.city+' '+res.data.area+' '+res.data.address
		uni.hideLoading()
	},
	async onShareAppMessage() {
		let disUser = await this.$request('distribution','getDisUser')
		let path = '/pages/shop/goods_detail?goods_id='+this.goods._id
		if( disUser.data && disUser.data.share_code){
			path+='&share_code='+disUser.data.share_code
		}
		return {
			path: path,
			title: this.goods.name,
			imageUrl: this.goods.cover
		}
	},
	
	methods:{
		async getGoodsDetail(){
			let t = this
			let res = await db.collection('pk-goods').where({_id:t.goods_id}).get()
			if( res.result.data.length >0 ){
				t.goods = res.result.data[0]
				if( t.goods.is_open_sku == 1 ){
					t.goods.spec.forEach(item=>{
						if( item.specValue.length > 0 ){
							item.checked = item.specValue[0]
						}
					})
					let skuRes = await db.collection('pk-goods-sku').where({goods_id:t.goods_id}).get()
					t.skuData = skuRes.result.data
					t.getSpec()
				}
				
				if( !t.$util.checkLogon(false)){
					t.checkGoodsCollect()
				}
			}
			
			//商品服务
			let serviceRes = await db.collection('pk-goods-service')
				.where({_id:dbCmd.in(t.goods.service_id)})
				.get()
			t.serviceData = serviceRes.result.data
			
			//关联推荐
			t.getRecommendGoods()
		},
		
		
		async getRecommendGoods(){
			let t = this
			let res = await db.collection("pk-goods")
				.where({type_id:t.goods_id.type_id})
				.limit(12)
				.orderBy("rank",'asc')
				.get()
			t.recommendData = res.result.data
		},
		
		async checkGoodsCollect(){
			let t = this
			try{
				let res = await pkAppGoods.checkGoodsCollect(t.goods_id)
				t.collect = res.data
			}catch(e){
				
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
		
		changSlide(e){
			this.slide_current = e.detail.current+1
		},
		
		async sureBuy(){
			let t = this
			try{
				if( t.form.buy == 1 ){
					t.joinLoading = true
					let res = await pkAppGoods.addGoodsCart(t.goods_id,t.form.count,t.selectSpec)
					uni.showToast({title:'已加入购物车'})
					t.openOrCloseSpec(false,1)
					t.joinLoading = false
				}
				if(t.form.buy== 2 ){
					let url = `/pages/shop/confirm?buy_type=1&goods_id=${t.goods_id}&count=${t.form.count}`
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
		
		async collectGoods(goods_id){
			let t = this
			try{
				uni.showLoading({title:'玩命加载中...'})
				let res = await pkAppGoods.collectGoods(goods_id)
				uni.showToast({
					title:res.errMsg,
					success() {
						setTimeout(function(){
							t.checkGoodsCollect()
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
		
		toCart(){
			uni.switchTab({
				url:'/pages/shop/cart'
			})
		},
		
		toBuy(id){
			uni.navigateTo({
				url:'./confirm?goods_id='+id+"&count=1"
			})
		},
		openOrCloseSpec(type,buy){
			this.form.buy = buy
			if( type ) {
				this.$refs.specPopup.open()
			}else{
				this.$refs.specPopup.close()
			}
		},
		openOrCloseServicePopup(type){
			if( type ) {
				this.$refs.servicePopup.open()
			}else{
				this.$refs.servicePopup.close()
			}
		},
		toCommentList(){
			uni.navigateTo({
				url:'./comment_list?goods_id='+this.goods_id
			})
		}
		
	}
}
</script>

<style lang="scss" scoped>
.goods-swiper{
	width: 100%;
	height: 750rpx;
	position: relative;
	
	&-con{
		width: 100%;
		height: 100%;
	}
	
	.slide{
		width: 100%;
		height: 100%;
	}
	
	.slide-count{
		padding: 6rpx 24rpx;
		background: rgba($color:#000, $alpha:.6);
		color: #fff;
		font-size: 12px;
		border-radius: 48rpx;
		display: inline-block;
		bottom: 40rpx;
		right: 24rpx;
		position: absolute;
	}
}

.goods-info{
	width: 100%;
	padding: 24rpx;
	background: #fff;
	&-title{
		width: 100%;
		
		.collect-icon{
			font-size: 44rpx;
		}
	}
	.price{
		color: red;
		font-size: 36rpx;
	}
	.old-price{
		text-decoration: line-through;
	}
	.goods-name{
		letter-spacing: 4rpx;
		width: 90%;
	}
}

.goods-simple{
	width: 100%;
	padding: 8rpx 24rpx;
	background: #fff;
	margin-top:24rpx ;
	.service{
		padding: 16rpx 0;
		.title{
			width: 96rpx;
		}
		.content{
			width: 60%;
			flex: 1;
			.content-center{
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		
		&-li{
			display: inline-block;
		}
	}
}

.goods-recommend{
	width: 100%;
	background: #fff;
	padding: 24rpx;
	margin-top: 24rpx;
	
	.goods-content{
		width: 100%;
		height: 100%;
		white-space: nowrap;
	}
	
	.goods-item{
		width: 220rpx;
		height: 360rpx;
		display: inline-block;
		margin-right: 24rpx;
		
		&-cover{
			width: 100%;
			height: 230rpx;
			border-radius: 6rpx;
		}
		&-name{
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 26rpx;
		}
		.price{
			margin-top: 6rpx;
		}
		.old-price{
			font-size: 12px;
			text-decoration: line-through;
		}
	}
}

.goods-desc{
	width: 100%;
	background: #fff;
	padding: 24rpx;
	margin-top: 24rpx;
}

.footer-left{
	.left-icon{
		width: 120rpx;
		height: 80rpx;
		text-align: center;
		position: relative;
		
		.ri-shopping-cart-2-line{
			font-size: 48rpx;
		}
		
		.brage{
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			background: red;
			color: #fff;
			font-size: 12px;
			right: 16rpx;
			top: -10rpx;
			position: absolute;
			line-height: 36rpx;
			text-align: center;
		}
	}
}

.footer-right{
	flex: 1;
	display: flex;
	align-items: center;
	margin-left: 12rpx;
	.join-cart{
		width: 50%;
		height: 80rpx;
		border: none;
		background: $uni-color-primary;
		text-align: center;
		line-height: 80rpx;
		border-radius: 0;
		color: #fff;
		font-size: 30rpx;
		.ri-add-line{
			position: relative;
			top: 6rpx;
		}
		
		&:first-child{
			background: #000;
		}
	}
	
}

//商品服务
.popup-service{
	width: 100%;
	height: 800rpx;
	background: #fff;
	position: relative;
	.ri-close-line{
		position: absolute;
		right:24rpx;
		font-size: 48rpx;
		top: 16rpx;
	}
	.title{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}
	.service-con{
		width: 100%;
		padding: 24rpx;
		height: 680rpx;
		overflow: hidden;
		overflow-y: auto;
	}
}

.popup-spec{
	width: 100%;
	background: #fff;
	height: 1000rpx;
	border-radius: 24rpx 24rpx 0 0;
	padding: 24rpx;
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
