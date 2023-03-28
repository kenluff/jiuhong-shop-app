<template>
<view style="padding: 12px;">
	<u-parse :html="content"></u-parse>
</view>
</template>

<script>
const pkAppCommon = uniCloud.importObject('pk-app-common')
import uParse from '@/components/u-parse/u-parse.vue'
export default{
	components:{
		uParse
	},
	data(){
		return{
			content:''
		}
	},
	async onLoad(opt) {
		let t = this
		//opt.type  1充值协议 2分销协议
		let key = []
		if( opt.type == 1 ) key = ['recharge_desc']
		if( opt.type == 2 ) key = ['dis_rule']
		let res = await pkAppCommon.getSet(key)
		if( res.data ){
			if( opt.type == 1){
				t.content = res.data.recharge_desc || ''
			}
			if( opt.type == 2){
				t.content = res.data.dis_rule || ''
			}
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
</style>