<template>
<view class="logistics" v-if="order">
	<view class="pk-card">
		<view class="company-item flex-c">
			<view class="f14 gy">快递公司：</view>
			<view>{{order.express_info.name}}</view>
		</view>
		<view class="company-item flex-c">
			<view class="f14 gy">快递单号：</view>
			<view>{{order.express_no}} </view>
			<text class="ri-file-copy-2-line ml12" @click="copyExpressNo"></text>
		</view>
		<view class="company-item flex-c">
			<view class="f14 gy">联系电话：</view>
			<view>{{order.express_info.phone}}</view>
			<text class="ri-phone-line ml12" @click="doCall"></text>
		</view>
	</view>
	<view class="pk-card mt12">
		<view class="u-time-axis">
			<u-time-line-item v-for="(item,index) in list" :key="index">
				<template v-slot:node>
					<view class="check-icon">
						<text class="ri-check-fill ri-1x gy"></text>
					</view>
				</template>
				<template v-slot:content>
					<view class="f14 ">{{ item.Remark }}</view>
					<view class="f14">{{ item.AcceptStation }}</view>
					<view class="f12 gy mt6">{{ item.AcceptTime }}</view>
				</template>
			</u-time-line-item>
		</view>
	</view>
	
</view>
</template>

<script>
import md5Hex from 'md5-hex'
import uTimeLineItem from '@/components/u-time-line-item.vue'
const pkAppCommon = uniCloud.importObject('pk-app-common')
const pkAppGoods = uniCloud.importObject('pk-app-goods')
export default{
	components:{
		uTimeLineItem
	},
	data(){
		return{
			order_id:'',
			order:null,
			list:[],
			scene:'shop',
		}
	},
	async onLoad(opt) {
		this.order_id = opt.order_id
		if( opt.scene ){
			this.scene = opt.scene
		}
		this.getOrderDetail()
	},
	methods:{
		async getOrderDetail(){
			let t = this
			try{
				uni.showLoading({title:"玩命加载中..."})
				if( t.scene == 'shop' ){
					let res = await pkAppGoods.getOrderDetail(t.order_id)
					t.order = res.data
				}
				if( t.scene == 'integral' ){
					let res = await t.$request('integral','getIntegralOrderDetail',t.order_id)
					t.order = res.data
				}
				
				uni.hideLoading()
				t.getLogistics()
			}catch(e){
				uni.hideLoading()
			}
		},
		async getLogistics(){
			let t = this
			let configKey = [
				'logistic_kdniao_appid',
				'logistic_kdniao_key'
			]
			let setData = await pkAppCommon.getSet(configKey)
			if( !setData.data.logistic_kdniao_appid || !setData.data.logistic_kdniao_key){
				ElMessage.error('请先配置物流信息')
				return
			}
			
			let requestData = {
				ShipperCode: t.order.express_info.code,
				LogisticCode:t.order.express_no,
			}
			let sign = md5Hex(JSON.stringify(requestData)+setData.data.logistic_kdniao_key)
			const reqParams = {
			    RequestType:101,
			    EBusinessID:setData.data.logistic_kdniao_appid,
			    DataSign:sign,
			    RequestData:JSON.stringify(requestData),
			    DataType:2
			}
			
			try{
				let res = await pkAppGoods.getLogistics(reqParams)
				if(res.data && res.data.length > 0 ){
					t.list = res.data
					console.log(t.list);
				}
			}catch(e){
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		},
		
		doCall(){
			uni.makePhoneCall({
				phoneNumber:this.order.express_info.phone
			})
		},
		copyExpressNo(){
			uni.setClipboardData({
				data:this.order.express_no,
				success() {
					uni.showToast({
						title:'复制成功'
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scope>
.logistics{
	padding: 24rpx 0;
}
.company-item{
	height: 60rpx;
	
	.ri-file-copy-2-line,.ri-phone-line{
		font-size: 44rpx;
		color: #0099FF;
	}
}
.u-time-axis {
	padding-left: 40rpx;
	position: relative;
	
	.check-icon{
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		line-height: 32rpx;
		text-align: center;
		background: #e7e7e7;
		color: #c4c4c4;
	}
}

.u-time-axis::before {
	content: " ";
	position: absolute;
	left: 0;
	top: 12rpx;
	width: 1px;
	bottom: 0;
	border-left: 1px solid #ddd;
	transform-origin: 0 0;
	transform: scaleX(0.5);
}

</style>