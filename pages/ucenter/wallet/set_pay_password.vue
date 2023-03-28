<template>
<view>
	<view class="set-form">
		<view class="form-item flex">
			<view class="form-item-label fw">支付密码</view>
			<input class="form-item-input" 
				v-model="form.password" 
				type="password" 
				placeholder="请输入支付密码"
			>
		</view>
		
		<view class="form-item flex">
			<view class="form-item-label fw">确认密码</view>
			<input class="form-item-input" 
				v-model="form.re_password" 
				type="password" placeholder="请输入支付密码"
			>
		</view>
		<button type="primary" 
			class="form-item-save" 
			:loading="loading" 
			@click="savePayPassword"
		>保存</button>
	</view>
</view>
</template>

<script>
import md5 from 'js-md5';
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	data(){
		return{
			form:{
				password:'',
				re_password:''
			},
			loading:false,
		}
	},
	onLoad() {
		
	},
	methods:{
		async savePayPassword(){
			let t = this
			if( t.form.password == '' ) {
				uni.showToast({
					title:'请输入支付密码',
					icon:'error'
				})
				return
			}
			if( t.form.password.length !=6 ) {
				uni.showToast({
					title:'请输入6位数的支付密码',
					icon:'error'
				})
				return
			}
			if( t.form.re_password == '' ) {
				uni.showToast({
					title:'请输入支付密码',
					icon:'error'
				})
				return
			}
			if( t.form.re_password !=t.form.password ) {
				uni.showToast({
					title:'两次密码输入不一致',
					icon:'error'
				})
				return
			}
			
			
			try{
				t.loading = true
				let param = {
					password:md5(t.form.password),
					re_password:md5(t.form.re_password),
				}
				let res = await pkAppUser.setPayPassword(param)
				t.loading = false
				uni.showToast({
					title:'密码修改成功',
					success() {
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			}catch(e){
				t.loading = false
				uni.showToast({
					title:e.errMsg,
					icon:'error'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.set-form{
	width: 100%;
	padding-top: 24px;
	
	.form-item{
		width: 100%;
		height: 120rpx;
		background: #fff;
		padding: 0 24rpx;
		align-items: center;
		border-bottom: 1rpx solid #f4f4f4;
		
		&-label{
			width: 180rpx;
		}
		
		&-input{
			flex: 1;
		}
	}
	.form-item-save{
		width: 90%;
		margin-top:80rpx;
		border-radius: 100rpx;
		background: $uni-color-primary;
	}
}
</style>