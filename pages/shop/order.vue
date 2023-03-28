<template>
<view>
	<view class="order-header">
		<u-tabs :list="nav" :current="current" itemWidth="20%" @change="changeOrder"></u-tabs>
	</view>
	
	<view class="order-content">
		<view class="order-item" v-for="(item,index) in list" :key="index">
			<view class="item-head mb12 flex-sb" @click="toOrderDetail(item)">
				<view class="f13 gy mt6">订单编号：{{item.order_number}}</view>
				<view class="status">
					<text v-if="item.order_status ==0" style="color: #FF0033;">待支付</text>
					<text v-if="item.order_status ==1" style="color: #3366FF;">待发货</text>	
					<text v-if="item.order_status ==2" style="color: #3366FF;">待确认</text>	
					<text v-if="item.order_status ==3" style="color: #00CC66;">交易成功</text>	
					<text v-if="item.order_status ==4" style="color: #FF9900;">已取消</text>	
					<text v-if="item.order_status ==5" style="color: #FF0033;">申请退款中</text>	
					<text v-if="item.order_status ==6" style="color: #FF0033;">已退款</text>
				</view>
			</view>
			
			<view class="goods-item flex" v-for="(val,ind) in item.goods_detail" :key="ind"  @click="toOrderDetail(item)">
				<image :src="val.cover" class="cover" mode=""></image>
				<view class="goods-item-right">
					<view class="f13">
						{{val.name}}
					</view>	
					<view class="flex-sb mt6">
						<text class="price">￥{{val.price}}</text>
						<text>× {{val.count}}</text>
					</view>	
				</view>
			</view>
			<view class="order-item-total mt6">
				<text class="f13 gy">共{{item.goods_detail.length}}件商品，合计：</text>
				<text class="price">￥{{item.total_price}}</text>
			</view>
			<view class="order-item-btn flex mt12">
				<template v-if="[4,5,6].includes(item.order_status)">
					<view class="btn-cancel" @click="operaOrder(item._id,'delete','确认删除该订单吗')">
						删除订单 
					</view>
				</template>
				<template v-if="item.order_status==0">
					<view class="btn-cancel" @click="operaOrder(item._id,'cancel','确认取消该订单吗')">
						取消订单 
					</view>
					<view class="btn-primary" @click="payNow(item)"> 立即支付 </view>
				</template>
				<template v-if="item.order_status==1">
					<view class="btn-cancel" @click="showRefundReason(item._id)"> 申请退款 </view>
				</template>
				<template v-if="item.order_status==2">
					<view class="btn-primary" @click="operaOrder(item._id,'confirm','确认该订单已收到货了吗')"> 确认收货 </view>
				</template>
				<view class="btn-cancel" v-if="[2,3].includes(item.order_status)" @click="toLogistics(item._id)"> 查看物流 </view>
				<view class="btn-primary" 
					v-if="item.order_status == 3 && !item.is_comment"
					@click="toComment(item._id)"
				> 评价 
				</view>
			</view>
		</view>
	</view>
	<none-content v-if="!is_content" :top="150"></none-content>
	<pay-method custom="popup" ref="pay" :money="payForm.total_price" @success="getPwd"></pay-method>
	<refund-reason ref="refund" @success="applyRefund"></refund-reason>
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
import payMethod from '@/components/pay-method.vue'
import refundReason from './components/refund-reason.vue'
import md5 from 'js-md5'
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	components:{
		uTabs,
		payMethod,
		refundReason
	},
	data(){
		return{
			nav:[
				{name:'全部',status:-1},
				{name:'待支付',status:0},
				{name:'待发货',status:1},
				{name:'待确认',status:2},
				{name:'已完成',status:3}
			],
			current:0,
			list:[],
			limit:12,
			is_content:true,
			payForm:{
				total_price:0,
				order_id:""
			}
		}
	},
	onLoad() {
		this.getOrderList(1,this.limit)
	},
	onReachBottom() {
		this.getOrderList(this.page+1,this.limit)
	},
	methods:{
		async getOrderList(page,limit){
			let t = this
			try{
				uni.showLoading({
					title:'玩命加载中...'
				})
				let res = await pkAppGoods.getOrderList(page,limit,{status:t.nav[t.current].status})
				if( page == 1 ){
					t.list = res.data
				}else{
					t.list = t.list.concat(res.data) 
				}
				t.page = page
				t.is_content = t.list.length !=0
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		
		changeOrder(e){
			let t = this
			t.current = e
			t.getOrderList(1,t.limit)
		},
		
		toOrderDetail(data){
			uni.navigateTo({
				url:'./order_detail?id='+data._id
			})
		},
		
		async payNow(data){
			let t = this
			try{
				t.payForm.total_price = data.total_price
				t.payForm.order_id = data._id
				uni.showLoading({title:'玩命加载中'})
				let res = await pkAppGoods.checkOrderIsPay(data._id)
				t.$refs.pay.showMethodPopop(true)
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
				uni.showModal({
					title:"提示",
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
				let pay_method = t.$refs.pay.getMethod()
				if( pay_method == 'balance_pay' ){
					let res = await pkAppGoods.balancePay({
						password:md5(e),
						order_id:t.payForm.order_id,
						pay_method:pay_method
					})
					uni.hideLoading()
					uni.showToast({
						title:'支付成功',
						success() {
							setTimeout(function(){
								uni.navigateTo({
									url:'/pages/shop/order_detail?order_id='+t.payForm.order_id
								})
							},1000)
						}
					})
				}
			}catch(e){
				uni.hideLoading()
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
		
		operaOrder(order_id,type, title){
			let t = this
			const operaFunc = async function(){
				try{
					
					if( type == 'cancel'){
						uni.showToast({title:'正在取消...'})
						let res = await pkAppGoods.cancelOrder(order_id)
					}
					if( type == 'delete'){
						uni.showToast({title:'正在删除...'})
						let res = await pkAppGoods.deleteOrder(order_id)
					}
					
					if( type == 'confirm' ){
						uni.showToast({title:'正在确认...'})
						let res = await pkAppGoods.confirmOrder(order_id)
					}
					
					uni.hideLoading()
					uni.showToast({
						title:"操作成功",
						success() {
							setTimeout(function(){
								t.getOrderList(1,t.limit)
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
		
		showRefundReason(order_id){
			this.payForm.order_id =order_id
			this.$refs.refund.showReason()
		},
		async applyRefund(data){
			let t = this
			try{
				uni.showToast({
					title:'退款申请提交中...'
				})
				let res = await pkAppGoods.applyRefundOrder(t.payForm.order_id,data)
				uni.hideLoading()
				uni.showToast({
					title:"操作成功",
					success() {
						setTimeout(function(){
							t.getOrderList(1,t.limit)
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
		
		toComment(order_id){
			uni.navigateTo({
				url:'./comment?order_id='+order_id
			})
		},
		toLogistics(id){
			uni.navigateTo({
				url:'/pages/common/logistics?order_id='+id
			})
		}
		
	}
}
</script>

<style lang="scss" scoped>
.order-header{
	width: 100%;
	position: fixed;
	z-index: 9;
	/* #ifdef H5 */
	top: 43px;
	/* #endif */
	/* #ifndef H5 */
	top: 0;
	/* #endif */
}
.order-content{
	width: 100%;
	position: relative;
	top: 54px;
	
	.order-item{
		width: 94%;
		margin-left: 3%;
		background: #fff;
		border-radius: 12rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 1px 1px 10px #f2f2f2;
		
		&-total{
			height: 60rpx;
			text-align: right;
			line-height: 60rpx;
		}
		.price{
			color: #FF0066;
		}
		
		&-btn{
			justify-content: flex-end;
			
			.btn-primary{
				padding: 12rpx 28rpx;
				border-radius: 64rpx;
				background: $uni-color-primary;
				color: #fff;
				margin-left:24rpx;
				font-size: 26rpx;
			}
			.btn-cancel{
				padding: 12rpx 28rpx;
				border-radius: 64rpx;
				border: 1px solid #424242;
				margin-left:24rpx;
				font-size: 26rpx;
			}
			
		}
	}
	.item-head{
		width: 100%;
		
		.logo{
			width: 80rpx;
			height: 80rpx;
			margin-right: 24rpx;
			border-radius: 4rpx;
		}
		.name{
			width: 420rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 28rpx;
		}
		.status{
			position: relative;
			top: 8rpx;
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
}
</style>