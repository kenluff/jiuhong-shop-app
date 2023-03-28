<template>
<view class="team">
	<view class="order-header">
		<u-tabs :list="nav" :current="current" itemWidth="33.3%" @change="changeStatus"></u-tabs>
	</view>
	<view class="order-content">
		<view class="team-item pk-card" v-for="(item,index) in list" :key="index">
			<view class="user-info flex-c">
				<view class="tag" v-if="item.is_distribution == 1">分销商</view>
				<image v-if="item.avatar" :src="item.avatar" class="avatar" mode=""></image>
				<image v-else src="../../../static/img/default-head.png" class="avatar" mode=""></image>
				<view class="user-info-right">
					<view class="name fw f16">{{item.nickname}}</view>
					<view class="time f12 gy mt6" v-if="item.invite_time">加入时间:
						<uni-dateformat :date="item.invite_time" format="yyyy-MM-dd"></uni-dateformat>
					</view>
				</view>
			</view>
			<view class="total flex-sb">
				<view class="total-item">
					<view class="f15 fw">￥{{item.dis_total_price}}</view>
					<view class="f12 gy">消费金额</view>
				</view>
				<view class="total-item">
					<view class="f15 fw">{{item.dis_total_order}}</view>
					<view class="f12 gy">订单数量</view>
				</view>
				<view class="total-item">
					<view class="f15 fw">{{item.disInfo ? (item.disInfo.total_user ||0):0 }}</view>
					<view class="f12 gy">下线人数</view>
				</view>
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
			nav:[
				{name:'全部',status:0},
				{name:'一级',status:1},
				{name:'二级',status:2},
			],
			current:0,
			list:[],
			page:1,
			is_content:true
		}
	},
	async onLoad() {
		let t = this
		t.getTeamList(1)
	},
	onReachBottom() {
		this.getTeamList(this.page+1)
	},
	methods:{
		async getTeamList(page){
			let t = this
			let res = await t.$request('distribution','getDisTeam',{
				page:page,limit:10,
				extra:{status:t.current}
			})
			t.list = page == 1 ? res.data : t.list.concat(res.data)
			t.is_content = t.list.length > 0
			t.page = page
		},
		changeStatus(e){
			this.current = e
			this.getTeamList(1)
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
	
	.team-item{
		margin-bottom: 24rpx;
		.user-info{
			width: 100%;
			margin-bottom: 24rpx;
			position: relative;
			.avatar{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}
			
		}
		.tag{
			position: absolute;
			right: -12px;
			top: -12px;
			background: #FF3333;
			font-size: 12px;
			color: #fff;
			padding: 4rpx 12rpx;
			border-radius: 0 12rpx;
		}
		
		.total{
			width: 100%;
			
			&-item{
				width: 33.3%;
				text-align: center;
			}
		}
	}
}
</style>