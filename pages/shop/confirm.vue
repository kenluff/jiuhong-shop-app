<template>
<view>
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
	
	<view class="pk-card goods mt12">
		<view class="goods-item flex" v-for="(val,ind) in list.goods_detail" :key="ind">
			<image :src="val.sku ? val.sku.cover:val.cover" class="cover" mode=""></image>
			<view class="goods-item-right">
				<view class="f16 fw">
					{{val.name}}
				</view>
				<view class="f13 gy mt6" v-if="val.sku">{{val.sku.name}}</view>
				<view class="flex-sb mt6">
					<text class="price">￥{{val.price}}</text>
					<text>× {{val.count}}</text>
				</view>
			</view>
		</view>
		<view v-if="couponData.length > 0">
			<goods-coupon :couponData="couponData" @success="getCouponPrice"></goods-coupon>
		</view>
		
		<view class="total flex-sb">
			<text class="f14">运费</text> <text>免运费</text>
		</view>
		<view class="total flex-sb">
			<text class="f14">小计</text> <text class="price">{{form.final_price}}元</text>
		</view>
		<view class="total flex-sb">
			<text class="f14">备注：</text>
			<input class="total-input" v-model="form.remark" type="text" placeholder="备注">
		</view>
	</view>
	
	<view class="pk-card method mt12" v-if="form.final_price > 0">
		<view class="f16 fw">支付方式 </view>
		<pay-method ref="pay" :money="form.final_price" @success="getPwd"></pay-method>
	</view>
	
	<fix-footer>
		<view class="footer-con">
			<text>待支付：</text>
			<text class="fw f16 price">￥{{form.final_price}}</text>
			<button type="primary" :loading="payLoading" class="pay-btn" @click="createOrder">立即支付</button>
		</view>
	</fix-footer>
</view>
</template>

<script>
import fixFooter from '@/components/fix-footer.vue'
import payMethod from '@/components/pay-method.vue'
import goodsCoupon from './components/goods-coupon.vue'
import md5 from 'js-md5'
const pkAppGoods = uniCloud.importObject('pk-app-goods')
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	components:{
		fixFooter,
		payMethod,
		goodsCoupon
	},
	data(){
		return{
			form:{
				address:null,
				buy_type:1,
				goods_id:'',
				count:0,
				sku_id:'',
				remark:'',
				total_price:0,
				pay_method:'',
				order_id:'',
				cart_id:[],
				coupon_id:0,
				final_price:0
			},
			list:[],
			payLoading:false,
			couponData:[],
		}
	},
	async onLoad(opt) {
		let t = this
		t.form.buy_type = opt.buy_type
		if( opt.buy_type == 1 ){
			t.form.goods_id = opt.goods_id
			t.form.count = opt.count
			t.form.sku_id = opt.sku_id
			t.getPreviewOrder()
		}
		
		if( opt.buy_type == 2 ){
			t.form.cart_id = opt.cart_ids.split(',')
			t.getPreviewOrderByCart()
		}
		
		//获取用户默认地址
		let res = await pkAppUser.getAddressDetail({is_default:1})
		if( res.data ){
			let {provice,city,area ,address} = res.data
			t.form.address = {
				provice:provice,
				city:city,
				area:area,
				name:res.data.name,
				mobile:res.data.mobile,
				address:provice+' '+city+' '+area+' '+address,
				latlng:res.data.latlng
			}
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
		async getPreviewOrder(){
			let t = this
			try{
				uni.showLoading({title:'加载中...'})
				let param = { 
					goods_id:t.form.goods_id,
					count:t.form.count,
					sku_id:t.form.sku_id,
					buy_type:t.form.buy_type,
				}
				let res =await pkAppGoods.getPreviewOrder(param)
				t.form.total_price = res.data.total_price
				t.form.final_price = res.data.total_price
				t.list = res.data.preOrder
				t.couponData = res.data.coupon
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
				uni.showToast({
					title:e.errMsg,
					icon:'error'
				})
			}
		},
		
		async getPreviewOrderByCart(){
			let t = this
			try{
				uni.showLoading({title:'加载中...'})
				let res =await pkAppGoods.getPreviewOrder({cart_id:t.form.cart_id,buy_type:t.form.buy_type})
				t.form.total_price = res.data.total_price
				t.form.final_price = res.data.total_price
				t.list = res.data.preOrder
				t.couponData = res.data.coupon
				console.log(t.couponData);
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
				uni.showToast({
					title:e.errMsg,
					icon:'error'
				})
			}
		},
		
		async createOrder(){
			let t = this
			let pay_method = t.$refs.pay.getMethod()
			t.form.pay_method = pay_method
			if( t.form.order_id ){
				if( pay_method == 'balance_pay'){
					t.$refs.pay.showPasswordPopup()
				}else{
					let payRes = await pkAppGoods.orderPay(t.form.order_id,pay_method)
					t.wxPay(payRes.data)
				}
				return
			}
			try{
				t.payLoading = true
				let res = null 
				if( t.form.buy_type == 1 ){
					res = await pkAppGoods.createOrder({
						goods_id:t.form.goods_id,
						count:t.form.count,
						address:t.form.address,
						buy_type:t.form.buy_type,
						sku_id:t.form.sku_id,
						remark:t.form.remark,
						coupon_id:t.form.coupon_id
					})
				}
				if( t.form.buy_type == 2 ){
					res = await pkAppGoods.createOrder({
						address:t.form.address,
						buy_type:t.form.buy_type,
						remark:t.form.remark,
						cart_id:t.form.cart_id,
						coupon_id:t.form.coupon_id
					})
				}
				if( res.data ){
					t.form.order_id = res.data
					if( pay_method == 'balance_pay'){
						t.$refs.pay.showPasswordPopup()
					}else{
						let payRes = await pkAppGoods.orderPay(t.form.order_id,pay_method)
						t.wxPay(payRes.data)
					}
				}
				
				t.payLoading = false
			}catch(e){
				t.payLoading = false
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
		
		async getPwd(e){
			let t = this
			try{
				uni.showLoading({
					title:'正在支付...'
				})
				let res = await pkAppGoods.balancePay({
					password:md5(e),
					order_id:t.form.order_id,
					pay_method:t.form.pay_method
				})
				uni.hideLoading()
				uni.showToast({
					title:'支付成功',
					success() {
						setTimeout(function(){
							uni.redirectTo({
								url:'/pages/shop/order_detail?id='+t.form.order_id
							})
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
		
		toChooseAddress(){
			uni.navigateTo({
				url:'/pages/common/address?scene=1'
			})
		},
		
		getCouponPrice(data){
			let price = parseFloat(this.form.total_price)
			if( data ){
				this.form.coupon_id = data._id
				this.form.final_price = parseFloat(price-data.coupon_info.coupon_price).toFixed(2)
			}else{
				this.form.final_price = price.toFixed(2)
			}
		},
		
		wxPay(data){
			let t = this
			uni.requestPayment({
				...data,
				complete(err) {
					console.log(err);
					if( err.errMsg == 'requestPayment:fail cancel' ){
						uni.showModal({
							title:'提示',
							content:'您已取消支付',
							showCancel:false,
							success() {
								uni.redirectTo({
									url:'/pages/shop/order_detail?id='+t.form.order_id
								})
							}
						})
						return
					}
					if( err.errMsg == 'requestPayment:ok'){
						uni.showToast({
							title:'支付成功',
							success() {
								setTimeout(function(){
									uni.redirectTo({
										url:'/pages/shop/order_detail?id='+t.form.order_id
									})
								},1000)
							}
						})
						return
					}
					uni.showModal({
						title:'提示',
						content:'支付失败：'+JSON.stringify(err.errMsg),
						showCancel:false
					})
				}
			})
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

.method{
	&-li{
		width: 100%;
		height: 120rpx;
	}
	
	.pay-icon{
		font-size: 50rpx;
		margin-right: 24rpx;
		position: relative;
		top: 14rpx;
		color: #42b983;
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
