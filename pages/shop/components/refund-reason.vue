<template>
<view class="refund-reason">
	<uni-popup ref="reasonPopup" type="bottom">
		<view class="rr-content">
			<view class="title fw f16"> 请选择申请退款原因 </view>
			<view class="reason-ul">
				<view class="reason-li" 
					v-for="(item,index) in reason" 
					:key="index"
				>
					<label class="flex-sb"	@click="value = item">
						<text>{{ item }}</text>
						<radio :value="item" :checked="value == item ?true:false" />
					</label>
				</view>
			</view>
			<button class="rr-btn" @click="selectReason">完成</button>
		</view>
	</uni-popup>
</view>
</template>

<script>
export default{
	name:'refund-reason',
	data(){
		return{
			reason:[
				'不喜欢/不想要',
				'未按约定的时间发货',
				'排错了，重新拍',
				'七天无理由退货',
			],
			value:''
		}
	},
	mounted() {
		// this.$refs.reasonPopup.open()
	},
	methods:{
		selectReason(){
			if( !this.value ){
				uni.showToast({
					title:'请选择退款原因'
				})
				return
			} 
			this.$emit('success',this.value)
			this.$refs.reasonPopup.close()
		},
		showReason(){
			this.$refs.reasonPopup.open()
		}
	}
	
}
</script>

<style lang="scss" scoped>
.rr-content{
	width: 100%;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	height: 800rpx;
	padding: 24rpx;
	.title{
		text-align: center;
	}
	.reason-ul{
		width: 100%;
		height: 550rpx;
		overflow: hidden;
		overflow-y: auto;
		
		.reason-li{
			width: 100%;
			height: 100rpx;
			line-height: 80rpx;
			border-bottom: 1px solid #f4f4f4;
			font-size: 26rpx;
			color: #444444;
		}
	}
	.rr-btn{
		background: $uni-color-primary;
		color: #fff;
		margin-top: 24rpx;
		border-radius: 100rpx;
	}
}
</style>