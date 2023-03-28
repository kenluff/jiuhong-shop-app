<template>
<view class="integral-exchange">
	<view class="pk-card address flex-sb mt12" @click="toChooseAddress">
		<text class="ri-map-pin-fill ri-lg"></text>
		<view class="address-info">
			<template v-if="form.address">
				<view>
					<text class="f16 fw">{{form.address.name}}</text>
					<text class="f13"> {{form.address.mobile}}</text>	
				</view>	
				<view class="f14">
					{{form.address.province}}
					{{form.address.city}}
					{{form.address.area}}
					{{form.address.address}}
				</view>	
			</template>
			<view class="f16 fw" v-else> 请选择收货地址 </view>
		</view>
		<text class="ri-arrow-right-s-line ri-lg"></text>	
	</view>
	
	<view class="pk-card goods mt12" v-if="info">
		<view class="goods-item flex">
			<image :src="info.cover" class="cover" mode=""></image>
			<view class="goods-item-right">
				<view class="f16 fw text-hidden">
					{{info.name}}
				</view>
				<view class="flex-sb mt6">
					<text class="price">{{info.score}}积分</text>
					<text>× {{form.count}}</text>
				</view>
			</view>
		</view>
		<view class="total flex-sb">
			<text class="f14">运费</text> <text>免运费</text>
		</view>
		<view class="total flex-sb">
			<text class="f14">小计</text> <text class="price">{{info.score}}积分</text>
		</view>
		<view class="total flex-sb">
			<text class="f14">备注：</text>
			<input class="total-input" v-model="form.remark" type="text" placeholder="备注">
		</view>
	</view>
	
	<fix-footer>
		<view class="footer-con" v-if="info">
			<text>待支付：</text>
			<text class="fw f16 price">{{info.score}}积分</text>
			<button type="primary" 
				:loading="payLoading" 
				class="pay-btn" 
				@click="createOrder"
			>立即支付</button>
		</view>
	</fix-footer>
</view>
</template>

<script>
import fixFooter from '@/components/fix-footer.vue'
export default{
	components:{
		fixFooter
	},
	data(){
		return{
			payLoading:false,
			form:{
				goods_id:'',
				address:null,
				final_price:0,
				remark:'',
				count:1,
			},
			info:null
		}
	},
	async onLoad(opt) {
		let t = this
		t.form.goods_id =opt.id
		
		if( opt.id ){
			let res = await t.$request('integral','getIntegralGoodsDetail',opt.id)
			t.info = res.data
		}
		
		let addressRes = await t.$request('user','getAddressDetail',{is_default:1})
		let _d = addressRes.data
		t.form.address = {
			name:_d.name,
			mobile:_d.mobile,
			address:_d.provice+' '+_d.city+' '+_d.area+' '+_d.address,
			latlng:_d.latlng
		}
	},
	onShow() {
		let t = this
		if( uni.getStorageSync('__selectAddress__')){
			let _d = uni.getStorageSync('__selectAddress__')
			uni.removeStorageSync('__selectAddress__')
			t.form.address = {
				name:_d.name,
				mobile:_d.mobile,
				address:_d.provice+' '+_d.city+' '+_d.area+' '+_d.address,
				latlng:_d.latlng
			}
		}	
	},
	methods:{
		toChooseAddress(){
			uni.navigateTo({
				url:'/pages/common/address?scene=1'
			})
		},
		
		async createOrder(){
			let t = this
			if( !t.form.address ) {
				uni.showToast({
					title:'请选择收货地址',
					icon:'error'
				})
				return
			}
			t.payLoading = true
			
			let res = await t.$request('integral','exchangeGoods',t.form)
			if( res.errCode == 0 && !res.code){
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
			t.payLoading = false
		}
	}
}
</script>

<style lang="scss" scoped>
.address{
	min-height: 100rpx;
	&-info{
		flex: 1;
		width: 70%;
		margin-left: 12rpx;
	}
	.ri-map-pin-fill{
		color: $uni-color-primary;
	}
}
.goods{
	&-item{
		width: 100%;
		padding-bottom: 24rpx;
		border-bottom: 1rpx solid #f4f4f4;
		&-right{
			flex: 1;
			width: 60%;
		}
	}
	.cover{
		width: 160rpx;
		height: 160rpx;
		margin-right: 24rpx;
		border-radius: 12rpx;
	}
	
	.price{
		color: #FF0033;
	}
	.total{
		height: 80rpx;
		
		&-input{
			flex: 1;
			width: 60%;
			text-align: right;
		}
	}
}
.footer-con{
	height: 120rpx;
	display: flex;
	justify-content: flex-end;
	width: 100%;
	padding: 0 24rpx;
	align-items: center;
	.pay-btn{
		width: 270rpx;
		height: 90rpx;
		border-radius: 90rpx;
		background: $uni-color-primary;
		color: #fff;
		margin: 0;
		margin-left: 24rpx;
	}
	.price{
		color: #FF0033;
	}
}
</style>