<template>
<view class="shop-comment">
	<view class="pk-card mt12" v-for="(item,index) in form" :key='index'>
		<view class="goods-item flex">
			<image :src="item.cover" class="cover" mode=""></image>
			<view class="goods-item-right">
				<view class="goods-name text-hidden">{{item.name}}</view>
				<view class="spec f13 gy mt6" v-if="item.sku">{{item.sku.name}}</view>
			</view>
		</view>
		<view class="score flex-c">
			<view class="score-title">描述相符</view>
			<uni-rate v-model="item.score" :size="28"/>
		</view>
		<view class="comment-content mt12">
			<textarea v-model="item.content" cols="30" rows="10" placeholder="从多个角度评价宝贝,可以帮助到更多的人哦"></textarea>
		</view>
		<view class="images-ul">
			<uni-file-picker 
				v-model="item.images" 
				fileMediatype="image" 
				mode="grid" 
				@success="success" 
				:image-styles="{
					'height': 100,	// 边框高度
					'width': 100,	// 边框宽度
				}"
			/>
		</view>
	</view>
	
	<button class="comment_btn" :loading="saving" @click="pulishComment">发布评论</button>
	<view style="width: 100%;height: 24px;"></view>
</view>
</template>

<script>
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	data(){
		return {
			order_id:'',
			info:null,
			form:[],
			saving:false,
		}
	},
	onLoad(opt) {
		this.order_id = opt.order_id
		this.getOrderDetail()
	},
	methods:{
		async getOrderDetail(){
			let t = this
			try{
				uni.showLoading({title:"玩命加载中..."})
				let res = await pkAppGoods.getOrderDetail(t.order_id)
				t.info = res.data
				t.info.goods_detail.forEach(item=>{
					t.form.push({
						cover:item.cover,
						name:item.name,
						goods_id:item.goods_id,
						sku:item.sku,
						score:5,
						content:'',
						images:[]
					})
				})
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		
		async pulishComment(){
			let t = this
			let form = JSON.parse(JSON.stringify(this.form))
			form.forEach(item=>{
				if( item.images.length > 0 ){
					let imgArr = []
					item.images.forEach(val=>{
						imgArr.push({name:val.name,extname:val.extname,url:val.url})
					})
					item.images = imgArr
				}
			})	
			try{
				t.saving = true
				uni.showToast({
					title:'正在发布...'
				})
				let res = await pkAppGoods.goodsComment(t.order_id,form)
				uni.hideLoading()
				t.saving = false
				uni.showToast({
					title:'发布成功',
					success() {
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			}catch(e){
				uni.hideLoading()
				t.saving = false
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
		success(e){
			console.log(e);
		}
	}
}
</script>

<style lang="scss" scoped>
.goods-item{
	width: 100%;
	.cover{
		width: 100rpx;
		height: 100rpx;
		margin-right: 24rpx;
	}
	
	
	&-right{
		width: 70%;
		flex: 1;
	}
}

.score{
	width: 100%;
	margin-top: 24rpx;
	
	.score-title{
		width: 190rpx;
	}
}
.comment-content{
	width: 100%;
	textarea{
		width: 100%;
		font-size: 28rpx;
		height: 200rpx;
	}
}
.comment_btn{
	background: $uni-color-primary;
	margin: 48rpx 3%;
	width: 94%;
	color: #fff;
	border-radius: 90rpx;
}
</style>