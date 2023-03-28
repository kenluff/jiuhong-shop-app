<template>
<view class="article-detail" v-if="info">
	<view class="article-title f16 fw">{{info.title}}</view>
	<view class="flex-sb mt12 gy f12">
		<uni-dateformat :date="info.update_time" format="yy/MM/dd hh:mm"></uni-dateformat>
		<text>{{info.view_count || 0}}人浏览</text>
	</view>
	
	<view class="mt12">
		<u-parse :html="info.content"></u-parse>
	</view>
</view>
</template>

<script>
const pkAppCommon = uniCloud.importObject('pk-app-common')
export default{
	
	data(){
		return{
			info:null
		}
	},
	async onLoad(opt) {
		let t = this , db = uniCloud.database()
		let res = await db.collection('pk-article').where({_id:opt.id}).get()
		console.log(res);
		t.info = res.result.data[0]
		
		try{
			let res = await pkAppCommon.readArticle(opt.id)
		}catch(e){
			
		}
	},
	methods:{
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
.article-detail{
	padding: 24rpx;
	width: 100%;
}
</style>