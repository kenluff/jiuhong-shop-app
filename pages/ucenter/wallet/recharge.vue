<template>
<view class="recharge">
	<view class="recharge-title f16 fw"> 请选择/输入充值金额 </view>
	<view class="recharge-send flex-sb">
		<template v-if="meal.length>0">
			<view class="send-li flex-c"
				v-for="(item,index) in meal" 
				:key="index"
				:class="current == index?'active':''"
				@click="current = index"
			>
				<text class="fw f16">{{item.name}}</text>
				<text class="fw f16 ml12">充值 {{item.price}} 元</text>
				<text class="send-tag">赠送{{item.send_price}}元</text>
			</view>
		</template>
		<view class="send-li" v-if="set.recharge_custom_price == '1'">
			<input class="send-li-input" 
				v-model="customPrice" 
				type="text" 
				placeholder="自定义充值金额"
			>
		</view>
		<label class="recharge-rule flex-c" @click="rule =!rule">
			<radio :checked="rule" style="transform: scale(.8);"/>
			<view class="gy">请先阅读并同意
				<text class="rule-txt" @click.stop="toAgreement">《充值协议》</text>
			</view>
		</label>
		<button class="rechage-btn" @click="sureRecharge">立即充值</button>
	</view>
</view>
</template>

<script>
const db = uniCloud.database()
const pkAppCommon = uniCloud.importObject('pk-app-common')
export default{
	data(){
		return{
			meal:[],
			current:0,
			customPrice:'',
			set:{
				recharge_open:0,
				recharge_custom_price:1,
				recharge_desc:''
			},
			rule:false,
		}
	},
	async onLoad() {
		let t = this
		let res = await pkAppCommon.getSet(Object.keys(t.set))
		if( res.data ){
			t.set.recharge_custom_price = res.data.recharge_custom_price || '1'
			t.set.recharge_desc = res.data.recharge_desc || ''
		}
		this.getRechargeMeal()
	},
	methods:{
		async getRechargeMeal(){
			let t = this
			try{
				let res = await db.collection('pk-recharge-meal')
					.orderBy('rank','asc')
					.where({put_away:1}).get()
				t.meal = res.result.data
			}catch(e){
				console.log(e);
			}
		},
		async sureRecharge(){
			let t = this , param = { price:0, meal_id:'',pay_method:'wxpay'}
			let price = 0 
			if( t.customPrice ){
				param.price = t.customPrice
			}else{
				param.price = t.meal[t.current].price
				param.meal_id = t.meal[t.current]._id
			}
			
			if( t.set.recharge_desc && !t.rule ){
				uni.showModal({
					title:'提示',
					content:'请先阅读并同意充值协议',
					showCancel:false
				})
				return
			}
			
			let res = await t.$request('order','createRecharOrder',param)
			t.wxPay(res)
		},
		wxPay(data){
			let t = this
			uni.requestPayment({
				...data,
				complete(err) {
					console.log(err);
					if( err.errMsg == 'requestPayment:fail cancel' ){
						uni.showModal({
							title:'提示',
							content:'您已取消支付',
							showCancel:false,
							success() {
								uni.navigateBack({
									delta:1
								})
							}
						})
						return
					}
					if( err.errMsg == 'requestPayment:ok'){
						uni.showToast({
							title:'支付成功',
							success() {
								setTimeout(function(){
									uni.navigateBack({
										delta:1
									})
								},1000)
							}
						})
						return
					}
					uni.showModal({
						title:'提示',
						content:'支付失败：'+JSON.stringify(err.errMsg),
						showCancel:false
					})
				}
			})
		},
		toAgreement(){
			uni.navigateTo({
				url:'/pages/common/agreement?type=1'
			})
		}
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
.recharge-title{
	padding: 24rpx;
}
.recharge-send{
	flex-wrap: wrap;
	width: 100%;
	padding: 24rpx;
	
	.send-li{
		width: 100%;
		height: 100rpx;
		border: 1px solid #e3e3e3;
		border-radius: 12rpx;
		padding: 12rpx 24rpx ;
		margin-bottom: 24rpx;
		
		.send-tag{
			margin-left: 24rpx;
			display: inline-block;
			padding: 4rpx 16rpx;
			background: $uni-color-primary;
			color: #fff;
			border-radius: 8rpx 0;
			font-size: 28rpx;
		}
		
		&-input{
			width: 100%;
			height: 100%;
		}
	}
	.active{
		border: 2px solid $uni-color-primary;
	}
}
.rechage-btn{
	width: 100%;
	background: $uni-color-primary;
	color: #fff;
	border-radius: 80rpx;
	margin-top: 48rpx;
}
.recharge-rule{
	.rule-txt{
		color: #0066FF;
	}
}
</style>