<template>
<view>
	<uni-swipe-action>
		<uni-swipe-action-item v-for="(val,ind) in list" :key="ind">
			<view class="cart-item flex-sb">
				<checkbox @click="checkCart(ind)" :checked="val.checked" :disabled="val.goodsInfo.put_away!=1"/>
				<view class="goods flex">
					<image :src="val.sku ?val.sku.cover:val.goods.cover" class="cover" mode=""></image>
					<view class="goods-right">
						<view class="flex">
							<text class="put-away" v-if="val.goodsInfo.put_away!=1">已下架</text>	
							<text class="name f14">{{val.goods.name}} </text> 
						</view>
						<view class="f13 gy mt6" v-if="val.sku">{{val.sku.name}}</view>
						<view class="flex-sb mt12">
							<text class="price">￥{{val.goodsInfo.price}}</text>
							<uni-number-box :min="1" 
								:max="val.goodsInfo.stock"
								v-model="val.count"
								@change="joinCart(val,val.count)"
							></uni-number-box>
						</view>
					</view>
				</view>
			</view>
			<template v-slot:right>
				<view class="delete-con" @click="deleteCart(val._id)"><text>删除</text></view>
			</template>
		</uni-swipe-action-item>
	</uni-swipe-action>
	<none-content v-if="!is_content" :top="100"></none-content>
	
	<view class="login-btn flex" v-if="!isLogin">
		<text>您还没有登录，</text>
		<view class="to-btn" @click="toLogin">立即登录 <text class="ri-arrow-right-line"></text>	</view>
	</view>	
	<view style="width: 100%;height: 130rpx;"></view>
	<view class="footer-con flex-sb" v-if="isLogin">
		<view class="flex">
			<label>
				<checkbox @click="checkAllCart" :checked="checkAll"/>全选
			</label>
			<text class="ml12 total fw">合计：￥{{totalPrice}}</text>
		</view>
		<view class="footer-con-btn" @click="toConfirm"> 立即下单 </view>
	</view>
</view>
</template>

<script>
const pkAppGoods = uniCloud.importObject('pk-app-goods')

export default{
	data(){
		return{
			list:[],
			totalPrice:0,
			checkAll:false,
			is_content:true,
			isLogin:true
		}
	},
	async onShow() {
		if( !this.$util.checkLogon(false) ){
			this.isLogin = false
			this.is_content = false
		}
		this.getCartList(1)
	},
	methods:{
		async getCartList(page){
			let t = this
			try{
				uni.showLoading({
					title:'玩命加载中'
				})
				let res = await pkAppGoods.getCaryListBuyUser(1,10)
				t.list = res.data
				t.list.forEach((item)=>{
					item.checked = t.checkAll
				})
				t.is_content = t.list.length >0
				t.getTotalPrice()
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		async joinCart(data){
			let t = this
			try{
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				let res = await pkAppGoods.addGoodsCart( data.goods_id,data.count,data.sku,false)
				uni.hideLoading()
				uni.showToast({
					title:'操作成功'
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
		
		async deleteCart(id){
			let t = this
			try{
				let res = pkAppGoods.deleteCart(id)
				uni.showToast({
					title:'删除成功'
				})
				t.getCartList(1)
			}catch(e){
				uni.showToast({
					title:e.errMsg,
					icon:'error'
				})
			}
		},
		
		//单选
		checkCart(index){
			this.list[index].checked = !this.list[index].checked
			this.getTotalPrice()
		},
		
		//全选
		checkAllCart(){
			let t = this
			t.checkAll = !t.checkAll
			t.list.forEach(item=>{
				item.checked = t.checkAll
			})
			t.getTotalPrice()
		},
		
		getTotalPrice(){
			let t = this , total = 0
			t.list.forEach(item=>{
				if( item.checked ){
					total += parseFloat(item.goodsInfo.price)*item.count
				}
			})
			t.totalPrice = parseFloat(total).toFixed(2)
		},
		
		toConfirm(){
			let t = this ,cartIds = []
			t.list.forEach(item=>{
				if( item.checked ){
					cartIds.push(item._id)
				}
			})
			if( cartIds.length == 0 ){
				uni.showToast({
					title:'请选择要结算的商品',
					icon:"error"
				})
				return
			}
			
			uni.navigateTo({
				url:'./confirm?buy_type=2&cart_ids='+cartIds.join(',')
			})
		},
		
		toLogin(){
			uni.navigateTo({
				url:"/pages/ucenter/login-page/index/index"
			})
		}
	}
}
</script>

<style lang="scss">
	
.cart-item{
	width: 100%;
	background: #fff;
	padding: 24rpx;
	align-items: center;
	.goods{
		flex: 1;
		margin-left: 24rpx;
		
		&-right{
			margin-left: 24rpx;
			width: 400rpx;
			flex: 1;
		}
	}
	.put-away{
		display: inline-block;
		font-size: 12px ;
		background: #eee;
		padding: 2rpx 6rpx;
		color: #999;
	}
	.name{
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex: 1;
		margin-left: 6rpx;
	}
	.price{
		color: #FF0033;
	}
	.cover{
		width: 140rpx;
		height: 140rpx;
		border-radius: 12rpx;
	}
}
.delete-con{
	width: 200rpx;
	height: 100%;
	background: #FF0033;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	margin-left: 2rpx;
}
.cart-item-disable{
	background: #ececec;
}

.footer-con{
	width: 100%;
	height: 120rpx;
	background: #fff;
	position: fixed;
	padding: 0 24rpx;
	align-items: center;
	
	/* #ifndef H5 */
	bottom: 0;
	/* #endif */
	/* #ifdef H5 */
	bottom: 50px;
	/* #endif */
	
	&-btn{
		padding: 16rpx 48rpx;
		background: $uni-color-primary;
		border-radius: 80rpx;
		color: #fff;
	}
	
	.total{
		color: #FF0033;
	}
}

.login-btn{
	width: 100%;
	justify-content: center;
	align-items: center;
	margin-top: 240rpx;
	
	.to-btn{
		width: 220rpx;
		background: $uni-color-primary;
		text-align: center;
		height: 64rpx;
		border-radius: 64rpx;
		color: #fff;
		line-height: 56rpx;
		
		.ri-arrow-right-line{
			position: relative;
			top: 4rpx;
		}
	}
}

</style>
