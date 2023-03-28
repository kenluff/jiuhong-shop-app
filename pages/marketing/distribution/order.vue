<template>
<view class="dis-order">
	<view class="order-header">
		<u-tabs :list="nav" :current="current" itemWidth="33.3%" @change="changeOrder"></u-tabs>
	</view>
	
	<view class="order-content">
		<view class="order-item pk-card mb12" v-for="(item,index) in info.list" :key="index">
			<view class="f14">买家：{{item.userInfo.nickname}}</view>
			<view class="order-info flex-sb">
				<view class="f13 gy">订单号:{{item.order_number}}</view>
				<view class="status f14" v-if="item.dis_grant == 1" style="color: #00CC66;">
					已结算
				</view>
				<view class="status f14" v-if="item.dis_grant == 0" style="color: #FF6633;"> 
					未结算 
				</view>
			</view>
			<view class="flex-sb mt12 f14">
				<view>订单金额：￥{{item.total_price}}</view>
				<view>订单佣金：<text class="price">￥{{item.disPirce}}</text></view>
			</view>
		</view>
	</view>
	
	<none-content v-if="!is_content" :top="150"></none-content>
	
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
export default{
	components:{
		uTabs
	},
	data(){
		return{
			info:{
				page:1,
				limit:10,
				list:[],
			},
			current:0,
			is_content:true,
			nav:[
				{name:'全部',status:-1},
				{name:'待结算',status:0},
				{name:'已结算',status:1},
			],
		}
	},
	onLoad() {
		this.getDisOrder(1,10)
	},
	onReachBottom() {
		this.getDisOrder(this.info.page+1,this.info.limit)
	},
	methods:{
		async getDisOrder(page,limit){
			let t = this
			let res = await t.$request('distribution','getDisOrderByUser',{
				page,limit,status:t.nav[t.current].status
			})
			
			t.info.list = page==1 ?res.data :t.info.list.concat(res.data)
			t.info.page = page
			t.is_content= t.info.list.length> 0
		},
		
		changeOrder(e){
			this.current = e
			this.getDisOrder(1,10)
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
}
.order-item{
	.order-info{
		height: 90rpx;
		border-bottom: 1rpx solid #f4f4f4;
	}
	.price{
		color: #FF3333;
	}
}
</style>