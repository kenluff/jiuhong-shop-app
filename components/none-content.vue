<template>
<view class="none-content" :style="{top:top+'px'}">
	<image class="none-img" src="/static/img/no-data.png" mode="widthFix"></image>
	<view class="none-txt">暂时没有相关数据</view>
</view>
</template>

<script>
export default{
	name:'none-content',
	props:{
		top:{
			type:Number,
			default:0
		}
	},
	data(){
		return{
			
		}
	},
	onLoad() {
		
	},
	methods:{
		
	}
}
</script>

<style lang="scss" scoped>
.none-content{
	width: 100%;
	position: relative;
	text-align: center;
		
	.none-img{
		width: 200rpx;
	}
	.none-txt{
		margin-top: 12rpx;
		color: #999;
		font-size: 26rpx;
		letter-spacing: 4rpx;
	}
}
</style>