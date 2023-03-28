<template>
<view class="shop-list">
	<view class="search-con">
		<view class="search-input">
			<text class="ri-search-2-line"></text>
			<input type="text" class="input" v-model="search.name" @confirm="getGoodsList(1)">
		</view>
		<view class="search-ul flex-c">
			<view class="search-ul-item" :class="search.current == 0 ?'active':''" @click="changeSearch(0)">综合</view>
			<view class="search-ul-item" :class="search.current == 1 ?'active':''" @click="changeSearch(1)">销量</view>
			<view class="search-ul-item flex-c" 
				@click="changeSearch(2)" 
				style="width: 30%;justify-content: center;"
			>
				<text :class="(search.current == 2 ||search.current == 3)  ?'active':''">价格</text>
				<view class="ml6 f16">
					<view class="price-icon-up" :class="search.current == 2 ?'active':''">
						<text class="ri-arrow-up-s-line"></text>
					</view>
					<view class="price-icon-down"  :class="search.current == 3 ?'active':''">
						<text class="ri-arrow-down-s-line"></text>
					</view>
				</view>
			</view>
			<view class="search-ul-item" style="width: 20%;">
				<text class="ri-layout-masonry-fill sort-icon" v-if="style==1" @click="style=2"></text>
				<text class="ri-list-check-2 sort-icon" v-if="style==2"  @click="style=1"></text>
			</view>
		</view>
	</view>
	
	<view class="goods-con flex-sb" :style="{top:conTop+'px'}" v-if="style == 1">
		<view class="goods-item"
			v-for="(item,index) in list" 
			:key="index" 
			@click="toGoodsDetail(item._id)"
		>
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
	
	<view class="goods-row1" :style="{top:conTop+'px'}" v-if="style == 2">
		<view class="goods-li" 
			v-for="(item,index) in list " 
			:key="index" 
			@click="toGoodsDetail(item._id)"
		>
			<image :src="item.cover" class="cover" mode=""></image>
			<view class="goods-li-right">
				<view class="name f16">{{item.name}}</view>
				<view class="desc text-hidden f12 gy mt6">
					{{item.simple_desc}}
				</view>
				<view class="price flex-sb">
					<view>
						<text class="price-text f16 fw">￥{{item.price}}</text>
						<text class="old-price f12 gy">￥{{item.old_price}}</text>
					</view>
					<text class="f12 gy ml6">{{item.sale_count || 0}}人付款</text>
				</view>
			</view>
		</view>
	</view>
	
	<none-content v-if="!is_content" :top="120"></none-content>
</view>
</template>

<script>
const db = uniCloud.database()
export default{
	data(){
		return{
			conTop:0,
			list:[],
			page:1,
			is_content:true,
			style:1,
			search:{
				current:0, //0综合排序 1销售 2价格升序 3价格降序
				name:'',
				category_id:[],
			}
		}
	},
	async onLoad(opt) {
		let t = this
		uni.showLoading({
			title:'玩命加载中...'
		})
		if( opt.category_id ){
			t.search.category_id = [opt.category_id]
		}
		if( opt.type_id ){
			let cate_id = []
			let typeRes = await db.collection('pk-goods-type').where({parent_id:opt.type_id}).get()
			if( typeRes.result.data.length > 0 ){
				typeRes.result.data.forEach(item=>cate_id.push(item._id))
			}
			t.search.category_id = cate_id
		}
		
		setTimeout(function(){
			let view = uni.createSelectorQuery().select('.search-con')
			view.boundingClientRect(function(data){
				t.conTop = data.height
				t.getGoodsList(1)
			}).exec()
		},1000)
		uni.hideLoading()
	},
	onReachBottom() {
		this.getGoodsList(this.page+1)
	},
	methods:{
		async getGoodsList(page){
			let t = this
			let _w = {put_away:1}
			let sort = { rank:1 }
			if( t.search.current == 1 ){
				sort.sale_count = -1
			}
			if( t.search.current ==2){
				sort.final_price=1
			}
			if( t.search.current ==3){
				sort.final_price=-1
			}
			if( t.search.name ){
				_w.name = new RegExp(t.search.name)
			}
			if( t.search.category_id.length>0 ){
				_w.type_id = db.command.in( t.search.category_id )
			}
			uni.showLoading({title:'玩命加载中...'})
			let res = await db.collection('pk-goods').aggregate()
				.sort(sort)
				.match(_w).skip((page-1)*12).limit(12)
				.end()
			if( page == 1) {
				t.list = res.result.data
			}else{
				t.list = t.list.concat(res.result.data)
			}
			t.is_content = t.list.length >0
			t.page = page
			uni.hideLoading()
		},
		
		toGoodsDetail(id){
			uni.navigateTo({
				url:'./goods_detail?goods_id='+id
			})
		},
		
		changeSearch(e){
			let t = this
			if( e == 2 ){
				t.search.current = t.search.current == 2 ? 3:2
			}else{
				t.search.current = e
			}
			t.getGoodsList(1)
		}
	}
}
</script>

<style lang="scss" scoped>
.search-con{
	width: 100%;
	padding: 24rpx 24rpx 0 24rpx;
	background: #fff;
	position: fixed;
	z-index: 99;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	
	.search-input{
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		background: #f4f4f4;
		border-radius: 70rpx;
		padding: 0 24rpx 0 64rpx;
		position: relative;
		
		.input{
			width: 100%;
			height: 100%;
		}
		.ri-search-2-line{
			position: absolute;
			left: 24rpx;
		}
	}
	.search-ul{
		width: 100%;
		height: 80rpx;
		&-item{
			width: 25%;
			text-align: center;
			font-size: 28rpx;
		}
		.price-icon-up{
			position: relative;
			top: 8px;
		}
		.price-icon-down{
			position: relative;
			top: -5px;
		}
		.sort-icon{
			font-size: 40rpx;
			position: relative;
			top: 4rpx;
		}
		.active{
			color: $uni-color-primary;
		}
	}
}

.goods-con{
	width: 100%;
	position: relative;
	padding: 16rpx;
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
.goods-row1{
	width: 100%;
	background: #fff;
	position: relative;
	
	.goods-li{
		width: 100%;
		padding: 24rpx;
		display: flex;
		border-bottom: 1px solid #f4f4f4;
		
		.cover{
			width: 200rpx;
			height: 200rpx;
			margin-right: 24rpx;
			border-radius: 16rpx;
		}
		
		&-right{
			width: 60%;
			flex: 1;
			position: relative;
			
			.price{
				width: 100%;
				position: absolute;
				bottom: 0;
				
				.price-text{
					color: #FF3333;
				}
				.old-price{
					text-decoration: line-through;
				}
			}
		}
	}
}
</style>