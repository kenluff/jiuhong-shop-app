<template>
<view>
	<view class="type-search">
		<view class="search-inpit f12" @click="toSearch">
			<text class="ri-search-2-line"></text>
			<text>搜索关键字</text>
		</view>
	</view>
	<view class="type-con flex" :style="{height:conH+'px'}">
		<view class="type-con-left">
			<view class="type-item" v-for="(item,index) in typeData" 
				:key="index"
				:class="current_type == item._id ?'active':''"
				@click="changeParentType(item._id)"
			>
				{{item.name}}
			</view>
		</view>
		<view class="type-con-right">
			<view class="type-ul flex">
				<view class="right-item" 
					v-for="(item,index) in typeChild" 
					:key="index"
					@click="toGoodsList(item._id)"
				>
					<image :src="item.icon" class="type-icon" mode=""></image>
					<view class="name f13">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>
<script>
let db = uniCloud.database()
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	data(){
		return{
			conH:0,
			typeData:[],
			typeChild:[],
			current_type:'',
		}
	},
	async onLoad() {
		let t = this
		uni.showLoading({
			title:'玩命加载中'
		})
		uni.getSystemInfo({
			success(res) {
				let _h = res.windowHeight
				t.conH = _h - 60
				// #ifdef H5
				t.conH -=50
				t.conH -= 44
				// #endif
				
				
			}
		})
		
		try{
			let typeRes = await db.collection('pk-goods-type')
				.where({parent_id:''})
				.orderBy('rank','asc')
				.get()
			t.typeData = typeRes.result.data
			if( t.typeData.length > 0 ){
				t.current_type = t.typeData[0]._id
				await t.getType(t.typeData[0]._id)
			}
			
		}catch(e){}
		
		uni.hideLoading()
	},
	methods:{
		async getType(parent_id){
			let t = this
			uni.showLoading({
				title:'玩命加载中...'
			})
			let res = await db.collection('pk-goods-type')
				.where({parent_id:parent_id})
				.orderBy('rank','asc')
				.get()
				
			t.typeChild = res.result.data
			uni.hideLoading()
		},
		
		changeParentType(id){
			this.current_type = id
			this.getType(id)
		},
	
		changeChildType(id){
			this.search.child_id = id
		},
		toGoodsDetail(id){
			uni.navigateTo({
				url:'./goods_detail?goods_id='+id
			})
		},
		async showSku(data){
			let t = this
			this.skuData = data
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
		toGoodsList(id){
			uni.navigateTo({
				url:'./list?category_id='+id
			})
		},
		toSearch(){
			uni.navigateTo({
				url:'./list'
			})
		}
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
.type-search{
	width: 100%;
	height:60px;
	position: fixed;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	padding: 24rpx;
	
	.search-inpit{
		width: 100%;
		height: 70rpx;
		border-radius: 70rpx;
		background: #f4f4f4;
		text-align: center;
		line-height: 60rpx;
		color: #999;
		
		.ri-search-2-line{
			font-size: 32rpx;
			margin-right: 12rpx;
			position: relative;
			top: 4rpx;
		}
	}
}

.type-con{
	width: 100%;
	position: fixed;
	
	height: 200px;
	/* #ifdef H5 */
	top: 104px;
	/* #endif */
	/* #ifndef H5 */
	top: 60px;
	/* #endif */
	
	&-left{
		width: 100px;
		height: 100%;
		background: #f4f4f4;
		
		.type-item{
			width: 100%;
			height: 100rpx;
			border-bottom: 1px solid #f4f4f4;
			text-align: center;
			line-height: 100rpx;
			font-size: 28rpx;
			color: #666;
		}
		.active{
			background: #fff;
			position: relative;
			
			&:before{
				content: '';
				position: absolute;
				width: 10rpx;
				height: 100%;
				background: $uni-color-primary;
				left: -1px;
			}
		}
	}
	
	&-right{
		width: 50%;
		flex: 1;
		.type-ul{
			flex-wrap: wrap;
			align-content: flex-start;
		}
		.right-item{
			width: 32%;
			height: 180rpx;
			// border: 1px solid;
			text-align: center;
			
			.type-icon{
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
}
</style>
