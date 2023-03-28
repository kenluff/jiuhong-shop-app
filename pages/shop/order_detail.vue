<template>
<view v-if="info">
	<view class="order-header">
		<view class="order-status fw"> 
			<text v-if="info.order_status ==0" style="color: #FF0033;">待支付</text>
			<text v-if="info.order_status ==1" style="color: #3366FF;">待发货</text>	
			<text v-if="info.order_status ==2" style="color: #3366FF;">待确认</text>	
			<text v-if="info.order_status ==3" style="color: #00CC66;">交易成功</text>	
			<text v-if="info.order_status ==4" style="color: #FF9900;">已取消</text>	
			<text v-if="info.order_status ==5" style="color: #FF0033;">申请退款中</text>	
			<text v-if="info.order_status ==6" style="color: #FF0033;">已退款</text>		
		</view>
		<view class="order-status-txt mt6 mb6 f14">
			<text v-if="info.order_status ==0" style="color: #FF0033;">等待买家付款</text>
			<text v-if="info.order_status ==1" style="color: #3366FF;">等待卖家发货</text>	
			<text v-if="info.order_status ==2" style="color: #3366FF;">订单已发货</text>	
			<text v-if="info.order_status ==3" style="color: #00CC66;">交易成功，期待下次光临~</text>	
			<text v-if="info.order_status ==4" style="color: #FF9900;">订单已取消，期待下次光临~</text>	
			<text v-if="info.order_status ==5" style="color: #FF0033;">申请退款已提交，请等待审核</text>	
			<text v-if="info.order_status ==6" style="color: #FF0033;">订单已退款，期待下次光临~</text>
		</view>
		<view class="order-add flex">
			<view class="address-icon">
				<text class="ri-truck-line"></text>
			</view>
			<view class="add-info">
				<view>{{info.address.name}}/{{ info.address.mobile }}</view>	
				<view class="f13 mt6">
					{{ info.address.province }}
					{{ info.address.city }}
					{{ info.address.area }}
					{{ info.address.address }}
				</view>
			</view>	
		</view>
	</view>
	<view class="order-goods order-card mt12">
		<view class="f16 fw">商品信息</view>
		<view class="goods-item flex" v-for="(val,ind) in info.goods_detail" :key="ind">
			<image :src="val.cover" class="cover" mode=""></image>
			<view class="goods-item-right">
				<view class="f13">
					{{ val.name }}
				</view>	
				<view class="f13 gy mt12" v-if="val.sku"> {{ val.sku.name }} </view>
				<view class="flex-sb mt12">
					<text class="price">￥{{ val.price}}</text>
					<text>× {{val.count}}</text>
				</view>	
			</view>
		</view>
		<view class="order-li flex-sb mt6" v-if="info.manager_discount > 0 ">
			<text class="f13 gy">商家优惠</text>
			<text class="f13 fw">-{{info.manager_discount}}元</text>
		</view>
		<view class="order-li flex-sb mt6" v-if="info.coupon_info ">
			<text class="f13 gy">优惠券</text>
			<text class="f13 price">-{{info.coupon_info.coupon_price}}元</text>
		</view>
		<view class="order-li flex-sb mt6">
			<text class="f13 gy">运费</text>
			<text class="f13 fw">免运费</text>
		</view>
		<view class="order-li flex-sb mt6">
			<text class="f13 gy"></text>
			<view>
				<text class="f13 fw">合计：</text>
				<text class="price">￥{{info.total_price}}</text>	
			</view>
			
		</view>
	</view>

	<view class="order-card order-info mt12">
		<view class="fw"> 订单信息 </view>
		<view class="order-info-li flex-c">
			<view class="title f13"> 订单编号： </view>
			<view class="value f13 fw">{{ info.order_number }}</view>	
		</view>
		<view class="order-info-li flex-c">
			<view class="title f13"> 创建时间： </view>
			<view class="value f13 fw">
				<uni-dateformat :date="info.create_time"></uni-dateformat>
			</view>	
		</view>
		<view class="order-info-li flex-c" v-if="info.pay_method">
			<view class="title f13"> 支付方式： </view>
			<view class="value f13 fw">
				<text v-if="info.pay_method == 'balance_pay'">余额支付</text>
				<text v-if="info.pay_method == 'wxpay_mp-weixin'">微信小程序支付</text>
				<text v-if="info.pay_method == 'wxpay_app-plus'">微信APP支付</text>
				<text v-if="info.pay_method == 'wxpay_h5'">微信H5支付</text>
				<text v-if="info.pay_method == 'alipay_mp-alipay'">支付宝小程序支付</text>
				<text v-if="info.pay_method == 'alipay_app-plus'">支付宝APP支付</text>
				<text v-if="info.pay_method == 'alipay_h5'">支付宝H5支付</text>
			</view>	
		</view>
		<view class="order-info-li flex-c" v-if="info.pay_time">
			<view class="title f13"> 支付时间： </view>
			<view class="value f13 fw">
				<uni-dateformat :date="info.pay_time"></uni-dateformat>
			</view>	
		</view>
		
		<template v-if="info.is_refund >0">
			<view class="order-info-li flex-c">
				<view class="title f13"> 申请退款时间： </view>
				<view class="value f13 fw">
					<uni-dateformat :date="info.apply_refund_time"></uni-dateformat>
				</view>	
			</view>
			<view class="order-info-li flex-c" v-if="info.is_refund == 3">
				<view class="title f13"> 退款时间： </view>
				<view class="value f13 fw">
					<uni-dateformat :date="info.refund_time"></uni-dateformat>
				</view>	
			</view>
		</template>
	</view>
	
	<fix-footer>
		<view class="opt-btn">
			<view class="opt-btn-cancel" v-if="[2,3].includes(info.order_status)"
				@click="toLogistics"
			>
				<text class="ri-truck-line"></text> 查看物流 
			</view>
			<view class="opt-btn-cancel" 
				v-if="info.order_status ==1 " 
				@click="showRefundReason"
			>
				<text class="ri-arrow-left-circle-fill"></text> 申请退款 
			</view>
			<view class="opt-btn-cancel" v-if="info.order_status ==5 " 
				@click="operaOrder('cancel_refund','确认取消订单退款申请吗？')"
			>
				<text class="ri-close-circle-line"></text> 取消退款申请 
			</view>
			<view class="opt-btn-cancel" v-if="info.order_status ==2 "
				@click="operaOrder('confirm','确认已经收到货了吗？')"
			>
				<text class="ri-check-line"></text> 确认收货 
			</view>
			
			<view class="opt-btn-cancel" v-if="info.order_status == 3 && info.is_comment !=1" @click="toComment">
				<text class="ri-message-3-line"></text> 评价
			</view>
			<view class="opt-btn-cancel" v-if="[4,6].includes(info.order_status)"
				@click="operaOrder('delete','确认删除该订单吗？')"
			>
				<text class="ri-delete-bin-2-line"></text> 删除订单
			</view>
		</view>
	</fix-footer>
	
	<refund-reason ref="refund" @success="applyRefund"></refund-reason>
</view>
</template>

<script>
import fixFooter from '@/components/fix-footer.vue'
import refundReason from './components/refund-reason.vue'
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	components:{
		fixFooter,
		refundReason
	},
	data(){
		return{
			order_id:"",
			info:null
		}
	},
	onLoad(opt) {
		let t = this
		uni.setNavigationBarColor({
			backgroundColor:'#e4ecf4',
			frontColor:"#000000"
		})
		if( opt.id ){
			t.order_id = opt.id
			t.getOrderDetail()
		}
	},
	methods:{
		async getOrderDetail(){
			let t = this
			try{
				uni.showLoading({title:"玩命加载中..."})
				let res = await pkAppGoods.getOrderDetail(t.order_id)
				t.info = res.data
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		operaOrder(type, title){
			let t = this
			const operaFunc = async function(){
				try{
					
					if( type == 'cancel'){
						uni.showToast({title:'正在取消...'})
						let res = await pkAppGoods.cancelOrder(t.info._id)
					}
					if( type == 'delete'){
						uni.showToast({title:'正在删除...'})
						let res = await pkAppGoods.deleteOrder(t.info._id)
					}
					
					if( type == 'cancel_refund'){
						uni.showToast({title:'正在取消...'})
						let res = await pkAppGoods.cancelRefundOrder(t.info._id)
					}
					if( type == 'confirm'){
						uni.showToast({title:'正在确认...'})
						let res = await pkAppGoods.confirmOrder(t.info._id)
					}
					
					uni.hideLoading()
					uni.showToast({
						title:"操作成功",
						success() {
							setTimeout(function(){
								t.getOrderDetail()
							},1000)
						}
					})
				}catch(e){
					uni.showModal({
						title:'提示',
						content:e.errMsg,
						showCancel:false
					})
				}
			}
			uni.showModal({
				title:'提示',
				content:title,
				success(tips) {
					if( tips.confirm ){
						operaFunc()
					}
				}
			})
		},
		
		showRefundReason(){
			this.$refs.refund.showReason()
		},
		async applyRefund(data){
			let t = this
			try{
				uni.showToast({
					title:'退款申请提交中...'
				})
				let res = await pkAppGoods.applyRefundOrder(t.info._id,data)
				uni.hideLoading()
				uni.showToast({
					title:"操作成功",
					success() {
						setTimeout(function(){
							t.getOrderDetail()
						},1000)
					}
				})
			}catch(e){
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
		
		toComment(){
			uni.navigateTo({
				url:'./comment?order_id='+this.info._id
			})
		},
		toLogistics(){
			uni.navigateTo({
				url:'/pages/common/logistics?order_id='+this.info._id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-header{
	width: 100%;
	background: #e4ecf4;
	padding: 24rpx;
	
	.order-status{
		font-size: 36rpx;
		color: #FF0066;
		letter-spacing: 4rpx;
	}
	.order-status-txt{
		color: #375a7c;
	}
	
	.order-add{
		width: 100%;
		background: #fff;
		border-radius: 12rpx;
		padding: 24rpx;
	}
	.address-icon{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background: linear-gradient(45deg,#FF0066,#FF9999);
		text-align: center;
		line-height: 50rpx;
		color: #fff;
	}
	
	.add-info{
		width: 70%;
		flex: 1;
		margin-left: 24rpx;
	}
}

.order-card{
	width: 94%;
	margin-left: 3%;
	border-radius: 12rpx;
	background: #fff;
	padding: 24rpx;
	box-shadow: 1px 1px 10px #eee;
}

.order-goods{
	.store{
		width: 100%;
		align-items: center;
		.logo{
			width: 56rpx;
			height: 56rpx;
			margin-right:24rpx;
		}
	}
	
	.goods-item{
		width: 100%;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #f4f4f4;
		.cover{
			width: 160rpx;
			height: 160rpx;
			border-radius: 12rpx;
		}
		
		&-right{
			flex: 1;
			margin-left: 24rpx;
		}
	}
	.price{
		color: #FF0066;
	}
	.order-li{
		height:48rpx;
	}
}

.order-info{
	&-li{
		height: 72rpx;
	}
	.title{
		width: 200rpx;
	}
}
.opt-btn{
	display: flex;
	justify-content: flex-end;
	width: 100%;
	.opt-btn-parmary{
		padding: 14rpx 32rpx;
		background: $uni-color-primary;
		color: #fff;
		border-radius: 80rpx;
		margin-left: 24rpx;
	}
	
	&-cancel{
		padding: 14rpx 32rpx;
		border-radius: 80rpx;
		margin-left: 24rpx;
		border: 1px solid #000;
	}
}

</style>