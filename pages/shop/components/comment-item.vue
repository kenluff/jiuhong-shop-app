<template>
<view class="goods-comment">
	<view class="comment-item flex" v-if="commentData">
		<image :src="commentData.user.avatar ||'../../../static/img/default-head.png'" class="user-head" mode=""></image>
		<view class="comment-item-right">
			<view class="user">
				<view class="flex-sb">
					<text class="name f13">{{commentData.user.nickname}}</text>
					<view class="f12 gy">
						<uni-dateformat :date="commentData.create_time" format="yyyy/MM/dd"></uni-dateformat>
					</view>	
				</view>
				<view class="score"><uni-rate :readonly="true" :size="18" :value="commentData.score" /></view>
			</view>
			
			<view class="content mt12 f14">{{commentData.content}}</view>
			<view class="comment-images flex mt6" v-if="commentData.images">
				<image class="comment-images-li" 
					v-for="(val,ind) in commentData.images" 
					:key="ind" 
					:src="val.url" 
					mode="aspectFit"
					@click="previewImg(commentData.images,val.url)"
				></image>
				<view style="width: 31%;height: 1px;"></view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
export default{
	name:'comment-item',
	props:{
		commentData:{
			type:Object
		}
	},
	data(){
		return {
			
		}
	},
	methods:{
		previewImg(images,src){
			let urls = []
			images.forEach(item=>urls.push(item.url))
			uni.previewImage({
				urls:urls,
				current:src
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.comment-item{
	width: 100%;
	margin-top: 24rpx;
	border-bottom: 1px solid #f4f4f4;
	.user-head{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	.score{
		margin-top: 4rpx;
	}
	
	&-right{
		flex: 1;
		width: 70%;
	}
	.comment-images{
		width: 100%;
		justify-content: space-between;
		flex-wrap: wrap;
		&-li{
			width: 31%;
			height: 200rpx;
			border-radius: 12rpx;
			margin-bottom: 12rpx;
		}
	}
	
}
</style>