<template>
<view class="money-record">
	<view class="record-item flex-c" v-for="(item,index) in list" :key="index">
		<view class="record-item-left">
			<view class="remark text-hidden f14">
				{{item.remark}}
			</view>
			<view class="time f12 gy mt6">
				<uni-dateformat :date="item.create_time" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
			</view>
		</view>
		<view class="price">
			<text class="fw f16" v-if="item.type ==1" style="color: #33CC66;">+{{item.count}}</text>
			<text class="fw f16" v-else style="color: #FF0066;">-{{item.count}}</text>
		</view>
	</view>
	
	<none-content v-if="!is_content"></none-content>
</view>
</template>

<script>
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	data(){
		return{
			page:1,
			list:[],
			is_content:true
		}
	},
	onLoad() {
		this.getMoneyLog(1)
	},
	onReachBottom() {
		this.getMoneyLog(this.page+1)
	},
	methods:{
		async getMoneyLog(page){
			let t = this
			try{
				uni.showLoading({title:'玩命加载中...'})
				let res = await pkAppUser.getMoneyLog(page,16)
				t.page = page
				t.list = t.list.concat(res.data)
				t.is_content = t.list.length >0
				uni.hideLoading()
			}catch(e){
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.record-item{
	width: 100%;
	background: #fff;
	padding: 24rpx;
	border-bottom: 1px solid #f4f4f4;
	&-left{
		width: 70%;
	}
	
	.remark{
		width: 100%;
	}
	.price{
		flex: 1;
		width: 30%;
		text-align: right;
	}
}
</style>