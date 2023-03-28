<template>
<view class="comment_list">
	<comment-item 
		v-for="(item,index) in list" 
		:key="index" 
		:commentData="item"
	></comment-item>
</view>
</template>

<script>
import commentItem from './components/comment-item.vue'
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	components:{
		commentItem
	},
	data(){
		return{
			list:[],
			goods_id:'',
			page:1,
		}
	},
	onLoad(opt) {
		this.goods_id = opt.goods_id
		this.getCommentList(1)
	},
	onReachBottom() {
		this.getCommentList(this.page+1)
	},
	methods:{
		async getCommentList(page){
			let t = this
			try{
				t.page = page
				let res = await pkAppGoods.getCommentByGoods(page,10,{goods_id:t.goods_id})
				if( page == 1 ){
					t.list = res.data.list
				}else{
					t.list = t.list.contact(res.data.list)
				}
			}catch(e){
				console.log(e);
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.comment_list{
	width: 100%;
	background: #fff;
	padding: 24rpx;
}
</style>