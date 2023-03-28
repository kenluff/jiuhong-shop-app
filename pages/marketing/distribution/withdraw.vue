<template>
<view class="withdraw">
	<view class="money">
		<view class="money-title">待提现金额</view>
		<view class="price fw mt12">￥{{disUser ?disUser.money : 0}}</view>
		<view class="f12 gy mt12" @click="toLog">提现明细</view>
	</view>
	<view class="withdraw-form pk-card mt12">
		<view class="f14">提现金额</view>
		<view class="form-input flex-c">
			<text class="unit">￥</text>
			<input class="input" type="text" v-model="form.count">
		</view>
		<view class="tips mt6 gy f13">
			<text v-if="config.dis_withdraw_low">最低提现金额 {{config.dis_withdraw_low}}元</text>
			<text v-if="config.dis_withdraw_service_price">提现手续费{{config.dis_withdraw_service_price}}%</text>
		</view>
	</view>
	<view class="method mt12">
		<label class="method-item" 
			:class="method =='balance'?'active':''" 
			@click="method = 'balance'"
			v-if="config.dis_withdraw_method.includes('balance')"
		>
			<view class="flex-c">
				<radio value="" :checked="method =='balance'"/>
				<text class="ri-wallet-3-line method-icon" style="color: #FF3366;"></text>
				<text>提现到余额</text>
			</view>
		</label>
		<label class="method-item" 
			:class="method =='wx'?'active':''" 
			@click="method = 'wx'"
			v-if="config.dis_withdraw_method.includes('wx')"
		>
			<view class="flex-c">
				<radio :checked="method =='wx'"/>
				<text class="ri-wechat-pay-fill method-icon" style="color: #00CC66;"></text>
				<text>提现到微信</text>
			</view>
			<view class="method-form flex-c">
				<view class="title">姓名</view>
				<input type="text" v-model="form.wx_account.name" placeholder="请输入姓名">
			</view>
			<view class="method-form flex-c">
				<view class="title">微信号</view>
				<input type="text" v-model="form.wx_account.account" placeholder="请输入微信号">
			</view>
		</label>
		<label class="method-item" 
			:class="method =='alipay'?'active':''" 
			@click="method = 'alipay'"
			v-if="config.dis_withdraw_method.includes('alipay')"
		>
			<view class="flex-c">
				<radio :checked="method =='alipay'"/>
				<text class="ri-alipay-fill method-icon" style="color: #0066FF;"></text>
				<text>提现到支付宝</text>
			</view>
			<view class="method-form flex-c">
				<view class="title">姓名</view>
				<input type="text"  v-model="form.alipay_account.name" placeholder="请输入姓名">
			</view>
			<view class="method-form flex-c">
				<view class="title">支付宝账号</view>
				<input type="text"  v-model="form.alipay_account.account" placeholder="请输入支付宝账号">
			</view>
		</label>
		<label class="method-item" 
			:class="method =='bank'?'active':''" 
			@click="method = 'bank'"
			v-if="config.dis_withdraw_method.includes('bank')"
		>
			<view class="flex-c">
				<radio :checked="method =='bank'"/>
				<text class="ri-bank-card-fill method-icon" style="color: #FF3333;"></text>
				<text>提现到银行卡</text>
			</view>
			<view class="method-form flex-c">
				<view class="title">开户人</view>
				<input type="text" v-model="form.bank_account.name" placeholder="请输入开户人姓名">
			</view>
			<view class="method-form flex-c">
				<view class="title">开户行</view>
				<input type="text"  v-model="form.bank_account.bank_name" placeholder="请输入开户银行">
			</view>
			<view class="method-form flex-c">
				<view class="title">银行账号</view>
				<input type="text" v-model="form.bank_account.account" placeholder="请输入银行账号">
			</view>
		</label>
		
		<button type="primary" :loading="submiting" class="widthdraw-btn" @click="sumitWithdraw">提现</button>
	</view>
</view>
</template>

<script>
const pkAppCommon = uniCloud.importObject('pk-app-common')
export default{
	data(){
		return{
			method:'',
			config:{
				dis_withdraw_method:['balance'],
				dis_withdraw_service_price:0,
				dis_withdraw_low:0
			},
			disUser:null,
			form:{
				count:"",
				wx_account:{
					name:'',
					account:''
				},
				alipay_account:{
					name:'',
					account:""
				},
				bank_account:{
					name:'',
					bank_name:'',
					account:''
				}
			},
			submiting:false,
		}
	},
	async onLoad() {
		let t = this
		try{
			let setRes = await pkAppCommon.getSet([
				'dis_withdraw_method',
				'dis_withdraw_service_price',
				'dis_withdraw_low'
			])
			if( setRes.data ){
				let _d = setRes.data
				if( _d.dis_withdraw_method ) {
					t.config.dis_withdraw_method = _d.dis_withdraw_method
				}
				if( _d.dis_withdraw_service_price ) {
					t.config.dis_withdraw_service_price = _d.dis_withdraw_service_price
				}
				if( _d.dis_withdraw_low ) {
					t.config.dis_withdraw_low = _d.dis_withdraw_low
				}
				
				if( t.config.dis_withdraw_method.length > 0 ){
					t.method = t.config.dis_withdraw_method[0]
				}
			}
			
		}catch(e){
			
		}
		
		let disUser = await t.$request('distribution','getDisUser')
		t.disUser = disUser.data
	},
	methods:{
		toLog(){
			uni.navigateTo({
				url:'./withdraw_log'
			})
		},
		
		async sumitWithdraw(){
			let t = this
			let { count ,wx_account,alipay_account ,bank_account } = t.form
			if( !count || parseFloat(count)<=0 ){
				uni.showToast({
					title:'提现金额必须大于0',
					icon:'error'
				})
				return
			}
			if( parseFloat(count) > parseFloat(t.disUser.money) ){
				uni.showToast({
					title:'余额不足',
					icon:'error'
				})
				return
			}
			
			if( parseFloat(count) < parseFloat(t.config.dis_withdraw_low)){
				uni.showModal({
					title:'提示',
					content:`最低提现金额不能少于${t.config.dis_withdraw_low}元`,
					showCancel:false
				})
				return
			}
			
			if( t.method =='wx' ){
				if( !t.$util.verifyFiled(wx_account.name,'请输入姓名')) return
				if( !t.$util.verifyFiled(wx_account.account,'请输入微信号')) return
			}
			
			if( t.method == 'alipay'){
				if( !t.$util.verifyFiled(alipay_account.name,'请输入名字')) return
				if( !t.$util.verifyFiled(alipay_account.account,'请输入支付宝账户')) return
			}
			
			if( t.method == 'bank'){
				if( !t.$util.verifyFiled(bank_account.name,'请输入开户人')) return
				if( !t.$util.verifyFiled(bank_account.bank_name,'请输入开户行名称')) return
				if( !t.$util.verifyFiled(bank_account.account,'请输入银行卡号')) return
			}
			t.submiting = true
			let res = await t.$request('distribution','disUserWidthdraw',{method:t.method,...t.form})
			t.submiting = false
			if( res.errCode == 0 && !res.code ){
				uni.showToast({
					title:'提现提交成功',
					success() {
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.money{
	width: 100%;
	text-align: center;
	padding-top: 48rpx;
	
	.price{
		font-size: 48rpx;
	}
}
.withdraw-form{
	.form-input{
		margin-top: 48rpx;
		height: 100rpx;
		border-bottom: 1rpx solid #f4f4f4;
		
		.unit{
			font-size: 48rpx;
		}
		.input{
			margin-left: 24rpx;
			font-size: 40rpx;
		}
	}
}

.method{
	width: 94%;
	margin-left: 3%;
	
	&-item{
		width: 100%;
		background: #fff;
		margin-top: 24rpx;
		border-radius: 12rpx;
		padding: 0 24rpx;
		display: block;
		max-height: 100rpx;
		overflow: hidden;
		transition: max-height linear .2s;
		.flex-c{
			width: 100%;
			height: 100rpx;
		}
		
		.method-icon{
			font-size: 48rpx;
			margin: 0 24rpx;
		}
	}
	
	.active{
		border: 2px solid $uni-color-primary;
		max-height: 400rpx;
	}
	
	.method-form{
		width: 100%;
		height: 90rpx;
		.title{
			width: 170rpx;
			font-size: 26rpx;
		}
	}
}

.widthdraw-btn{
	width: 98%;
	margin-left: 1%;
	background: $uni-color-primary;
	border-radius: 12rpx;
	margin-top: 48rpx;
}

</style>