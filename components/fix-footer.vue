<template>
<view>
	<view class="footer-block" :style="{height:$util.iPhoneX()?'200rpx':'140rpx'}"></view>
	<view class="fixed-footer" :class="$util.iPhoneX()?'fixed-footer-iphone':''">
		<view class="fixed-footer-con">
			<slot></slot>
		</view>
	</view>
</view>
</template>
<script>
export default{
	data(){
		return{
			
		}
	},
	mounted() {
		
	},
	methods:{
		
	}
}
</script>

<style lang="scss" scoped>
.footer-block{
	width: 100%;
	height: 120rpx;
}
.fixed-footer{
	width: 100%;
	height: 120rpx;
	background: #fff;
	z-index: 9;
	bottom: 0;
	position: fixed;
	
	&-con{
		height: 120rpx;
		width: 100%;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
	}
}
.fixed-footer-iphone{
	height: 180rpx;
}
</style>
