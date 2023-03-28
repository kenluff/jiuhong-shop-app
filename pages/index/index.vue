<template>
<view class="index" v-if="info">
	<template v-for="(item,index) in info.value" :key="index">
		<custom-item v-if="item.type == 'pk-slide'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-gird'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-title'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-blank'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-magic'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-line'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-article'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-video'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-goods'" :scene="item.type" :customData="item"></custom-item>
		<custom-item v-if="item.type == 'pk-coupon'" :scene="item.type" :customData="item"></custom-item>
	</template>
	
</view>
</template>

<script>
import customItem from '@/components/pk-custom/custom-item.vue'
const pkCommon = uniCloud.importObject('pk-app-common')
export default{
	components:{
		customItem
	},
	data(){
		return{
			info:null,
		}
	},
	async onLoad(){
		this.getHomePage()
	},
	methods:{
		async getHomePage(){
			let t = this
			try{
				let res = await pkCommon.getHomePage()
				t.info = res.data
				console.log(t.info);
			}catch(e){
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		}
	}
}
</script>

<style>
</style>