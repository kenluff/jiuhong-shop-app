<template>
<view class="pk-share">
	<!-- #ifdef H5 || APP-PLUS-->
	<text class="ri-share-line" :style="{fontSize:fontSize+'px'}" @click="toShare"></text>
	<!-- #endif -->
	
	<!-- #ifdef MP-WEIXIN -->
		<button open-type="share" class="share-btn">
			<text class="ri-share-line" :style="{fontSize:fontSize+'px'}"></text>
		</button>
	<!-- #endif -->
</view>
</template>

<script>
export default{
	name:'pk-share',
	props:{
		path:{
			type:String,
		},
		fontSize:{
			type:Number,
			default:20
		}
	},
	data(){
		return{
			
		}
	},
	mounted() {
	
	},
	methods:{
		async toShare(){
			let t = this
			let disUser = await t.$request('distribution','getDisUser')
			let path = '/pages/shop/goods_detail?goods_id=6264ece4c016f40001d2e1d7'
			// #ifdef H5
				path = window.location.host+path
			// #endif
			if( disUser.data && disUser.data.share_code){
				path+='&share_code='+disUser.data.share_code
			}
			uni.setClipboardData({
				data:path,
				success() {
					uni.showToast({
						title:'已复制'
					})
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.pk-share{
	display: inline-block;
}
.share-btn{
	padding: 0;
	margin: 0;
	background: #fff;
	border: none;
	
	&::after{
		border: none;
	}
}
</style>