<template>
<view>
	<view class="address-form">
		<view class="form-item flex-sb">
			<view class="title f16 fw"> 姓名 </view>
			<input class="input" v-model="form.name" type="text" placeholder="请输入姓名">
		</view>
		<view class="form-item flex-sb">
			<view class="title f16 fw"> 手机号 </view>
			<input class="input" v-model="form.mobile" type="text" placeholder="请输入手机号">
		</view>
		<view class="form-item flex-sb">
			<view class="title f16 fw"> 所在地区 </view>
			<view class="input">
				<text v-if="form.provice">
					{{ form.provice}} {{ form.city}} {{ form.area}}
				</text>	
				<text v-else style="color: gray;">选择地址</text>
			</view>
			<text class="ri-map-pin-fill" @click.stop="toChoose"></text>
		</view>
		<view class="form-item flex-sb" style="align-items: flex-start;">
			<view class="title f16 fw"> 详细地址 </view>
			<textarea class="input" v-model="form.address" style="height: 200rpx;line-height: 48rpx;"></textarea>
		</view>
		<view class="form-item flex-sb">
			<view class="title f16 fw" style="width: 300rpx;"> 设置为默认地址</view>
			<switch :checked="form.is_default ==1" @change="changeDefault"/>
		</view>
		<button type="primary" 
			:loading="loading" 
			class="save-btn" 
			@click="saveAddressData"
		>保存</button>
	</view>
</view>
</template>

<script>
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	data(){
		return{
			id:'',
			form:{
				name:'',
				mobile:'',
				provice:'',
				city:'',
				area:'',
				address:'',
				is_default:0,
				latlng:''
			},
			loading:false,
		}
	},
	async onLoad(opt) {
		let t = this
		if( opt.id ) {
			t.id = opt.id 
			uni.showLoading({title:'加载中...'})
			try{
				let res = await pkAppUser.getAddressDetail({_id:opt.id})
				let _d = res.data
				t.form = {
					name:_d.name,
					mobile:_d.mobile,
					provice:_d.provice,
					city:_d.city,
					area:_d.area,
					address:_d.address,
					is_default:_d.is_default,
					latlng:_d.latlng
				}
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		}
	},
	methods:{
		toChoose(){
			let t = this
			uni.chooseLocation({
				success(res) {
					var add = res.address;
					var reg = /.+?(省|市|自治区|自治州|县|区)/g;
					let ads = add.match(reg).toString().split(",")
					ads.forEach((item,index)=>{
						if( index == 0 ) t.form.provice = item
						if( index == 1 ) t.form.city = item
						if( index == 2 ) t.form.area = item
					})
					t.form.address = res.name
					t.form.latlng = res.latitude+','+res.longitude
				}
			})
		},
		
		changeDefault(e){
			this.form.is_default = e.detail.value ? 1 :0
		},
		
		async saveAddressData(){
			let t = this
			t.loading = true
			try{
				let res = await pkAppUser.addOrEditAddress(t.form,t.id)
				uni.showToast({
					title:'保存成功',
					success() {
						t.loading = false
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

<style lang="scss">
page{
	background: #fff;
}
.address-form{
	width: 100%;
	padding: 32rpx;
	
	.form-item{
		width: 100%;
		min-height: 100rpx;
		align-items: center;
		margin-top: 24rpx;
		position: relative;
		
		.title{
			width: 200rpx;
		}
		
		.input{
			flex: 1;
			width: 60%;
			background: #f4f4f4;
			min-height: 90rpx;
			border-radius: 24rpx;
			padding-left: 24rpx;
			line-height: 90rpx;
		}
		
		.ri-map-pin-fill{
			position: absolute;
			right: 24rpx;
			font-size: 44rpx;
			color: #FF6633;
		}
	}
	
	.save-btn{
		width: 94%;
		margin-left: 3%;
		background: $uni-color-primary;
		height: 90rpx;
		border-radius: 90rpx;
		margin-top: 48rpx;
	}
}
</style>
