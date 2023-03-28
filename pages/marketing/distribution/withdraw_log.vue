<template>
<view class="withdraw-log">
	<view class="log-item" v-for="(item,index) in list" :key="index">
		<view class="flex-sb">
			<view class="f14">提现到
				<text v-if="item.method == 'wx'">微信</text>
				<text v-if="item.method == 'alipay'">支付宝</text>
				<text v-if="item.method == 'bank'">银行卡</text>
				<text v-if="item.method == 'balance'">账户余额</text>
			</view>
			<view class="status f14">
				<text v-if="item.status == 0">待审核</text>
				<text v-if="item.status == 1" class="success">已完成</text>
				<text v-if="item.status == 2">已拒绝</text>
			</view>
		</view>
		<view class="flex-sb mt6">
			<view class="f13 gy">
				<template v-if="item.account">
					<text v-if="item.method == 'wx'">微信号：{{item.account.account}}</text>
					<text v-if="item.method == 'alipay'">支付宝账号：{{item.account.account}}</text>
					<text v-if="item.method == 'bank'">银行卡卡号：{{item.account.account}}</text>
				</template>
			</view>
			<view class="price fw">{{item.count}}</view>
		</view>
		<view class="flex-sb mt6">
			<view class="f12 gy">
				<uni-dateformat :date="item.create_time"></uni-dateformat>
			</view>
			<view class="f12 gy">手续费：{{ item.service_price ||' 0.00'}}</view>
		</view>
		
		<view class="reason mt6 f13" v-if="item.status==2">{{item.reason}}</view>
	</view>
	
	<none-content v-if="!is_content" :top="150"></none-content>
	
</view>
</template>

<script>
export default{
	data(){
		return{
			list:[],
			page:1,
			limit:10,
			is_content:true,
		}
	},
	onLoad() {
		let t = this
		t.getMoneyLog(1,16)
	},
	onReachBottom() {
		this.getMoneyLog(this.page+1,16)
	},
	methods:{
		async getMoneyLog(page,limit){
			let t = this
			let res = await t.$request('distribution','getDisUserWithdrawLog',{page,limit})
			t.list = page == 1 ? res.data : t.list.concat(res.data)
			t.is_content = t.list.length > 0 
			t.page = page
		}
	}
}
</script>

<style lang="scss" scoped>
.log-item{
	width: 100%;
	padding: 24rpx;
	background: #fff;
	border-bottom: 1rpx solid #f4f4f4;
	
	.status{
		color: #FF3333;
	}
	.success{
		color: #33CC66;
	}
	.reason{
		color: #FF9933;
	}
}
</style>