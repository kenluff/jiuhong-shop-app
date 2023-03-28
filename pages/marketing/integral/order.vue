<template>
<view class="integral-order">
	<view class="order-header">
		<u-tabs :list="nav" 
			:current="current" 
			itemWidth="25%" 
			@change="changeOrder"
		></u-tabs>
	</view>
	
	<view class="order-content">
		<view class="order-item pk-card" v-for="(item,index) in list" :key="index">
			<view class="title flex-sb">
				<view class="f13 gy"><text>订单号：</text>{{item.order_number}}</view>
				<view class="f14">
					<text v-if="item.order_status==1" style="color: #0066FF;">待发货</text>
					<text v-if="item.order_status==2" style="color: #9966FF;">待确认</text>
					<text v-if="item.order_status==3" style="color: #33CC66;">已完成</text>
				</view>
				
			</view>
			<view class="goods-item flex mt12">
				<image :src="item.goods_info.cover" class="cover" mode=""></image>
				 <view class="goods-item-right ml12">
				 	<view class="f16 text-hidden">{{item.goods_info.name}}</view>
					<view class=" flex-sb mt12">
						<text class="price">{{item.goods_info.score}}积分</text>
						<text>× {{item.count}}</text>
					</view>
				 </view>
			</view>
			<view class="order-li mt12 flex-sb">
				<text class="f13 gy">兑换时间：</text>
				<text class="f13">
					<uni-dateformat :date="item.create_time"></uni-dateformat>
				</text>
			</view>
			<view class="order-li mt12">
				<text class="f13 gy">小计：</text>
				<text class="price">{{item.total_score}}积分</text>
			</view>
			<view class="order-btm flex mt12" 
				v-if="item.order_status >1 && item.goods_info.type!=2"
			>
				<view class="btn-li" @click="toLogistics(item._id)">查看物流</view>
				<view class="btn-li ml12" 
					v-if="item.order_status==2" 
					@click="confirmOrder(item._id)"
				>确认收货</view>
			</view>
		</view>
		
		<none-content v-if="!is_content" :top="150"></none-content>
	</view>
	
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
const db = uniCloud.database()
export default{
	components:{
		uTabs
	},
	data(){
		return{
			nav:[
				{name:'全部',status:0},
				{name:'待发货',status:1},
				{name:'待确认',status:2},
				{name:'已完成',status:3}
			],
			current:0,
			list:[],
			page:1,
			is_content:true
		}
	},
	onLoad() {
		this.getIntegralOrder(1)
	},
	methods:{
		changeOrder(e){
			this.current = e
			this.getIntegralOrder(1)
		},
		async getIntegralOrder(page){
			let t = this
			try{
				let userInfo = uni.getStorageSync('userInfo')
				let _where = { uid:userInfo._id}
				if( t.current >0 ){
					_where.order_status = t.nav[t.current].status
				}
				uni.showLoading({title:'玩命加载中'})
				let res = await db.collection('pk-integral-order')
					.orderBy('create_time','desc')
					.where(_where)
					.skip((page-1)*12).limit(12)
					.get()
				
				t.list = page == 1 ? res.result.data : t.list.concat(res.result.data)
				t.page = 1
				t.is_content = t.list.length != 0
				uni.hideLoading()
			}catch(e){
			}
		},
		
		toLogistics(id){
			uni.navigateTo({
				url:'/pages/common/logistics?scene=integral&order_id='+id
			})
		},
		async confirmOrder(id){
			let t = this
			const operaFunc = async function(){
				try{
					uni.showToast({title:'正在确认...'})
					let res = await t.$request('integral','integralOrderConfirm',id)
					if( res.errCode == 0 && !res.code ){
						uni.showToast({
							title:"收货成功",
							success() {
								setTimeout(function(){
									t.getIntegralOrder(1)
								},1000)
							}
						})
					}
					uni.hideLoading()
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
				content:'确认该订单已经收到货了吗？',
				success(tips) {
					if( tips.confirm ){
						operaFunc()
					}
				}
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
		margin-bottom: 24rpx;
	}
	.goods-item{
		width: 100%;
		.cover{
			width: 160rpx;
			height: 160rpx;
			border-radius: 12rpx;
		}
		
		&-right{
			width: 50%;
			flex: 1;
			
		}
	}
	.order-li{
		text-align: right;
	}
	.price{
		color: #FF3333;
	}
	.order-btm{
		justify-content: flex-end;
		
		.btn-li{
			padding: 16rpx 48rpx;
			border:1px solid #dadada;
			color: #666;
			border-radius: 64rpx;
		}
	}
}
</style>