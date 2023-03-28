<template>
<view class="pk-shop">
	<view class="shop-search">
		<view class="shop-search-input gy" @click="toSearch">
			<text class="ri-search-2-line f18 top2"></text>
			<text class="ml6">搜索你想要的商品~</text>
		</view>
	</view>
	<view class="shop-swiper">
		<swiper class="shop-swiper-con" :current="slide_index" @change="changeSlide">
			<swiper-item v-for="(item,index) in slideData" :key="index" >
				<image class="swiper-img" 
					:src="item.url" mode=" aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="swiper-dot">
			<view class="swiper-dot-item" 
				v-for="(item,index) in slideData" 
				:key="index"
				:class="slide_index == index ?'active':''"
			></view>
		</view>
	</view>
	
	
	<view class="shop-type flex" v-if="typeData.length>0">
		<view class="shop-type-item mb16" 
			v-for="(item,index) in typeData" 
			:key="index"
			@click="toGoodsList(item._id)"
		>
			<image class="type-icon" :src="item.icon" mode=""></image>
			<view class="type-name f13 mt6">{{item.name}}</view>
		</view>
		<view class="shop-type-item mb16" @click="toMore">
			<image class="type-icon" src="../../static/img/type-more.png" mode=""></image>
			<view class="type-name f13 mt6">更多分类</view>
		</view>
	</view>

	<view class="shop-nav flex-c">
		<view class="shop-nav-item" @click="changeNav(1)" :class="shop_nav ==1 ?'active':''">猜你喜欢</view>
		<view class="shop-nav-item" @click="changeNav(2)" :class="shop_nav ==2 ?'active':''">新品抢先</view>
		<view class="shop-nav-item" @click="changeNav(3)" :class="shop_nav ==3 ?'active':''">热门推荐</view>
		<view class="shop-nav-item" @click="changeNav(4)" :class="shop_nav ==4 ?'active':''">爆款清单</view>
		<view class="nav-tab"></view>
	</view>
	
	<view class="shop-goods flex-sb">
		<view class="goods-item" v-for="(item,index) in goods.list" :key="index" @click="toGoodsDetail(item._id)">
			<image class="cover" :src="item.cover" mode=""></image>
			<view class="goods-name f14"> {{ item.name}} </view>
			<view class="desc f12 gy mt6">{{item.simple_desc}}</view>
			<view class="price mt6 flex-sb">
				<view>
					<text class="f12">￥</text>
					<text class="f16 fw">{{item.price}}</text>
					<text class="ml6 old-price f12 gy">￥{{item.old_price}}</text>
				</view>
				<text class="ri-add-circle-fill"></text>
			</view>
		</view>
	</view>
</view>	
</template>

<script>
let db = uniCloud.database()
export default{
	data(){
		return {
			shop_nav:1,
			slide_index:0,
			slideData:[],
			typeData:[],
			goods:{
				list:[],
				page:1
			}
		}
	},
	onLoad() {
		this.initData()
	},
	onReachBottom() {
		this.getGoodsList(this.goods.page+1)
	},
	methods:{
		async initData(){
			let t = this
			uni.showLoading({
				title:'玩命加载中...'
			})
			let slideRes = await db.collection('pk-shop-slide')
				.where({status:1})
				.orderBy('rank','asc')
				.get()
			t.slideData = slideRes.result.data
			let typeRes = await db.collection('pk-goods-type')
				.where({parent_id:''})
				.limit(9)
				.orderBy('rank','asc')
				.get()
			t.typeData = typeRes.result.data
			t.getGoodsList(1)
			uni.hideLoading()
		},
		
		changeNav(e){
			this.shop_nav = e
			this.getGoodsList(1)
		},
		
		async getGoodsList(page){
			let t = this
			let _w = { put_away:1 } ,sort = { rank:1 }
			if(t.shop_nav == 2 ){
				sort.create_time = -1
			}
			if( t.shop_nav == 4 ){
				sort.sale_count = -1
			}
			if( t.shop_nav == 3){
				_w.is_recommend = 1
			}
			
			let res = await db.collection('pk-goods').aggregate()
				.sort(sort)
				.match(_w).skip((page-1)*12).limit(12)
				.end()
			let _d = res.result.data
			if( page == 1 ){
				t.goods.list = _d 
			}else{
				t.goods.list = t.goods.list.concat(_d)
			}
			t.goods.page = page
		},
		changeSlide(e){
			this.slide_index = e.detail.current
		},
		toGoodsDetail(id){
			uni.navigateTo({
				url:'./goods_detail?goods_id='+id
			})
		},
		toMore(){
			uni.switchTab({
				url:'/pages/shop/type'
			})
		},
		toSearch(){
			uni.navigateTo({
				url:'./list'
			})
		},
		toGoodsList(id){
			uni.navigateTo({
				url:'./list?type_id='+id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.shop-search{
	width: 100%;
	height: 120rpx;
	background: #fff;
	padding: 24rpx;
	&-input{
		width: 100%;
		border-radius: 80rpx;
		height: 80rpx;
		background: #f4f4f4;
		text-align: center;
		line-height: 70rpx;
	}
}

.shop-swiper{
	width: 100%;
	height: 400rpx;
	position:relative;
	&-con{
		width: 100%;
		height: 400rpx;
	}
	.swiper-img{
		width: 100%;
		height: 100%;
	}
	
	.swiper-dot{
		position: absolute;
		height: 40rpx;
		width: 100%;
		// border: 1px solid;
		bottom: 12rpx;
		display: flex;
		justify-content: center;
		
		&-item{
			width: 16rpx;
			height: 16rpx;
			margin: 8rpx;
			transform:rotate(45deg);
			background: #fff;
		}
		.active{
			background: #000;
		}
	}
}

.shop-type{
	width: 100%;
	background: #fff;
	padding: 24rpx 24rpx 0 24rpx;
	flex-wrap: wrap;
	
	&-item{
		width: 20%;
		text-align: center;
		
		.type-icon{
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
		}
	}
}

.shop-nav{
	width: 100%;
	height: 90rpx;
	background: #fff;
	&-item{
		width: 25%;
		height: 100%;
		text-align: center;
		line-height: 90rpx;
		font-size: 28rpx;
		transition: all .2s;
		position: relative;
		&:after{
			position: absolute;
			content: '';
			width: 0;
			left: 0;
			height:6rpx;
			bottom: 0;
			border-radius: 6rpx;
			background: $uni-color-primary;
			transition: width .5s; 
		}
	}
	.active{
		font-weight: bold;
		font-size: 32rpx;
		position: relative;
		&:after{
			position: absolute;
			content: '';
			width: 40%;
			left: 30%;
			height:6rpx;
			background: $uni-color-primary;
			bottom: 0;
			border-radius: 6rpx;
		}
	}
}

.shop-goods{
	width: 100%;
	padding: 24rpx;
	flex-wrap: wrap;
	.goods-item{
		width: 49%;
		height: 500rpx;
		background: #fff;
		margin-bottom: 16rpx;
		border-radius: 12rpx;
		box-shadow: 1px 1px 10px #ececec;
		
		.cover{
			width: 100%;
			height: 340rpx;
			border-radius: 12rpx 12rpx 0 0;
		}
		.goods-name,.desc{
			padding: 0 12rpx;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.price{
			padding: 0 12rpx;
		}
		.old-price{
			text-decoration: line-through;
		}
		.ri-add-circle-fill{
			font-size: 48rpx;
			color: $uni-color-primary;
		}
	}
}



</style>