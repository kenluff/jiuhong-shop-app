<template>
<view>
	<view class="pay-method" v-if="custom == 'card'">
		<label class="method-li flex-sb" @click="changeMethod('wxpay')">
			<view>
				<text class="ri-wechat-pay-fill pay-icon" style="color: #18b30a;"></text>	
				<text>微信支付</text>
			</view>
			<radio value="wxpay" :checked="method == 'wxpay'"/>
		</label>
		<!-- <label class="method-li flex-sb" @click="changeMethod('alipay')">
			<view>
				<text class="ri-alipay-fill pay-icon" style="color: #0066FF;"></text>	
				<text>支付宝支付</text>
			</view>
			<radio value="alipay" :checked="method == 'alipay'"/>
		</label> -->
		<label class="method-li flex-sb" @click="changeMethod('balance_pay')">
			<view>
				<text class="ri-wallet-3-fill pay-icon" style="color: #FF0066;"></text>	
				<text>余额支付（{{bank ? bank.money : '0.00'}}）</text>
			</view>
			<radio value="balance_pay" :disabled="balance_pay_disable" :checked="method == 'balance_pay'"/>
		</label>
	</view>
	<view v-if="custom == 'popup'">
		<uni-popup ref="methodPopup" type="bottom">
			<view class="pay-method method-popup">
				<view class="fw f16">
					请选择支付方式
				</view>
				<label class="method-li flex-sb" @click="changeMethod('wxpay')">
					<view>
						<text class="ri-wechat-pay-fill pay-icon" style="color: #18b30a;"></text>	
						<text>微信支付</text>
					</view>
					<radio value="wxpay" :checked="method == 'wxpay'"/>
				</label>
				<!-- <label class="method-li flex-sb" @click="changeMethod('alipay')">
					<view>
						<text class="ri-alipay-fill pay-icon" style="color: #0066FF;"></text>	
						<text>支付宝支付</text>
					</view>
					<radio value="alipay" :checked="method == 'alipay'"/>
				</label> -->
				<label class="method-li flex-sb" @click="changeMethod('balance_pay')">
					<view>
						<text class="ri-wallet-3-fill pay-icon" style="color: #FF0066;"></text>	
						<text>余额支付（{{bank ? bank.money : '0.00'}}）</text>
					</view>
					<radio value="balance_pay" :disabled="balance_pay_disable" :checked="method == 'balance_pay'"/>
				</label>
				
				<button class="method-popup-btn" @click="showPasswordPopup()">确定</button>
				
			</view>
		</uni-popup>
	</view>
	
	<uni-popup ref="payPopup" type="center">
		<view class="pay-form">
			<text class="ri-close-fill" @click="closePasswordPopop"></text>
			<view class="pay-form-title"> 请输入支付密码 </view>
			<view class="pay-money">
				<text class="unit">￥</text>
				<text class="money fw">{{money}}</text>
			</view>
			<view class="method-txt flex-sb mt12 f13">
				<text>支付方式</text>
				<text>余额支付</text>	
			</view>
			<u-message-input
				mode="bottomLine" 
				:dot-fill="true" 
				:focus="false" 
				:maxlength="6" 
				:font-size="50" 
				:width="60"
				@finish="getPwd">
			</u-message-input>
			<view class="pay-forget mt12 f13" @click="toSetPassword"> 忘记密码？ </view>
		</view>
	</uni-popup>
	
</view>
</template>

<script>
const pkAppUser = uniCloud.importObject('pk-app-user')
import uMessageInput from '@/components/u-message-input.vue'
export default{
	name:'pay-method',
	components:{
		uMessageInput
	},
	props:{
		money:{
			type:[String,Number],
			default:''
		},
		custom:{
			type:String,
			default:'card'
		}
	},
	data(){
		return{
			//wxpay			微信支付
			//alipay		支付宝支付
			//balance_pay	余额支付
			method:'wxpay',
			bank:null,
			balance_pay_disable:false,  //余额支付是否可用
		}
	},
	mounted() {
		let t = this
		t.getBankData()
	},
	
	methods:{
		async getBankData(){
			let t = this
			try{
				let res = await pkAppUser.getUserMoney()
				t.bank = res.data
				if( !parseFloat(t.bank.money) ){
					t.balance_pay_disable = true
				}else{
					if( parseFloat(t.bank.money) < parseFloat(t.money) ){
						t.balance_pay_disable = true
					}
				}
			}catch(e){
			}
		},
		
		checkIsSetPassword(){
			let t = this
			if( t.bank && !t.bank.is_password && t.method == 'balance_pay'){
				uni.showModal({
					title:'提示',
					content:'您还未设置支付密码，立即前去设置~',
					cancelText:'暂不设置',
					success(tips) {
						if( tips.confirm){
							uni.navigateTo({
								url:'/pages/ucenter/wallet/set_pay_password'
							})
						}
					}
				})
				return 
			}
		},
		
		changeMethod(method){
			let t = this
			if( method == 'balance_pay' && t.balance_pay_disable){
				return false
			}
			this.method = method
		},
		
		getMethod(){
			this.checkIsSetPassword()
			return this.method
		},
		
		getPwd(e){
			this.$emit('success',e)
		},
		showPasswordPopup(){
			this.$refs.payPopup.open()
		},
		closePasswordPopop(){
			this.$refs.payPopup.close()
		},
		toSetPassword(){
			uni.navigateTo({
				url:'/pages/ucenter/wallet/set_pay_password'
			})
		},
		showMethodPopop(type){
			type ? this.$refs.methodPopup.open() :this.$refs.methodPopup.close()
		}
	}
}
</script>

<style lang="scss" scoped>
.pay-method{
	width: 100%;
	
	.method-li{
		height: 80rpx;
	}
	.pay-icon{
		font-size: 56rpx;
		margin-right: 24rpx;
		position: relative;
		top:16rpx;
	}
}

.pay-form{
	width: 660rpx;
	height: 500rpx;
	background: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	position: relative;
	.ri-close-fill{
		font-size: 44rpx;
		position: absolute;
		right: 24rpx;
		top: 24rpx;
	}
	&-title{
		width: 100%;
		font-size: 32rpx;
		text-align: center;
		margin-top: 24rpx;
	}
	
	.method-txt{
		width: 80%;
		margin: 24rpx 10%;
	}
	
	.pay-money{
		width: 100%;
		text-align: center;
		margin-top: 24rpx;
		border-bottom: 1rpx solid #f4f4f4;
		padding: 24rpx;
		.money{
			font-size: 56rpx;
		}
	}
	
	.pay-forget{
		width: 100%;
		text-align: center;
		color: #0066FF;
	}
}

.method-popup{
	width: 100%;
	height: 560rpx;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	padding: 24rpx;
	
	&-btn{
		background: $uni-color-primary;
		color: #fff;
		margin-top: 24rpx;
	}
}
</style>