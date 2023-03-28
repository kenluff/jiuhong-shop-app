<template>
<view class="article-list">
	<view class="nav-header">
		<u-tabs :list="nav" :current="nav_index" @change="changeNav"></u-tabs>
	</view>
	
	<view class="article-con">
		<view class="article-item flex"
			v-for="(item,index) in list" 
			:key="index"
			@click="toArticleDetail(item._id)"
		>
			<image :src="item.cover" class="cover" mode=""></image>
			<view class="article-item-right">
				<view class="title f16 text-hidden">{{item.title}}</view>
				<view class="text-hidden f12 gy mt6">{{item.sub_title}}</view>
				<view class="time flex-sb f12 gy">
					<uni-dateformat :date="item.update_time" format="yy/MM/dd hh:mm"></uni-dateformat>
					<text>{{item.view_count || 0}}人浏览</text>
				</view>
			</view>
		</view>
		
		<none-content v-if="!is_content" :top="150"></none-content>
	</view>
</view>
</template>

<script>
import uTabs from '@/components/u-tabs.vue'
const db = uniCloud.database()
export default{
	components:{
		uTabs
	},
	data(){
		return{
			nav:[],
			nav_index:0,
			list:[],
			page:1,
			is_content:true
		}
	},
	async onLoad() {
		uni.showLoading({
			title:'玩命加载中'
		})
		await this.getArticleType()
		await this.getArticleList(1)
		
		uni.hideLoading()
	},
	onReachBottom() {
		this.getArticleList(this.page+1)
	},
	methods:{
		async getArticleType(){
			let t = this
			try{
				let res = await db.collection('pk-article-type')
					.where({status:1})
					.orderBy('rank','asc')
					.get()
				t.nav = [{name:'全部',_id:0}].concat(res.result.data)
			}catch(e){
			}
		},
		
		async getArticleList(page){
			let t = this
			let _w = { status:1 }
			if( this.nav_index >0 ){
				_w = { type_id : this.nav[this.nav_index]._id}
			}
			
			uni.showLoading({
				title:'玩命加载中'
			})
			let res = await db.collection('pk-article')
				.skip((page-1)*10)
				.limit(10)
				.where(_w)
				.orderBy('update_time','desc')
				.get()
			t.page = page
			if( page == 1 ) {
				t.list = res.result.data
			}else{
				t.list = t.list.concat(res.result.data)
			}
			t.is_content = t.list.length >0 
			uni.hideLoading()
		},
		
		changeNav(e){
			this.nav_index = e
			this.getArticleList(1)
		},
		toArticleDetail(id){
			uni.navigateTo({
				url:'./detail?id='+id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.article-con{
	width: 100%;
	padding:24rpx;
	position: relative;
	top: 40px;
	.article-item{
		width: 100%;
		padding: 24rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
		
		&:last-child{
			margin-bottom: 0 !important;
		}
		
		.cover{
			width: 180rpx;
			height: 180rpx;
			margin-right: 12rpx;
			border-radius: 12rpx;
		}
		
		&-right{
			flex: 1;
			width: 60%;
			position: relative;
		}
		.time{
			position: absolute;
			width: 100%;
			bottom: 24rpx;
		}
	}
}
</style>