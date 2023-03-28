<template>
<view>
	<view class="address-item mt12" v-for="(val,ind) in list" :key="ind">
		<view class="address-item-top flex-sb" @click.stop="chooseAddress(val)">
			<view class="defult-icon" v-if="val.is_default == 1">
				<text class="ri-home-7-fill ri-lg"></text>
			</view>
			<view class="other-icon" v-else>
				{{val.first_name}}
			</view>
			<view class="info">
				<view>
					<text class="fw">{{ val.name }}</text>
					<text class="f14 ml6 gy">{{val.mobile}}</text>
				</view>
				<view class="mt6 f13">
					{{val.provice}} {{ val.city}} {{ val.area}} {{ val.address}}
				</view>
			</view>
			<text class="ri-edit-line ri-lg" @click.stop="toAddress(val._id)"></text>	
		</view>
		<view class="address-item-btm flex-sb">
			<label @click="setDefault(val._id,val.is_default)">
				<radio :checked="val.is_default == 1" 
					style="transform: scale(.8);"
				/><text>默认地址</text>
			</label>
			<text class="gy f13" @click="deleteAddress(val._id)">删除</text>	
		</view>
	</view>
	<fix-footer>
		<view class="add-btn" @click="toAddress(0)">
			<text class="ri-add-line ri-lg"></text> 添加收货地址
		</view>
	</fix-footer>
</view>
</template>

<script>
import fixFooter from '@/components/fix-footer.vue'
const pkAppUser = uniCloud.importObject('pk-app-user')
export default{
	components:{
		fixFooter
	},
	data(){
		return{
			list:[],
			page:1,
			scene:0,	//0查看 1选择地址
		}
	},
	onLoad(opt) {
		this.scene = opt.scene || 0
	},
	onShow() {
		this.getAddressList(1)
	},
	onReachBottom() {
		this.getAddressList(this.page+1)
	},
	methods:{
		async getAddressList(page){
			let t = this
			t.page = page
			try{
				uni.showLoading({
					title:'玩命加载中...'
				})
				let res = await pkAppUser.getAddress(page,16)
				if( page == 1 ){
					t.list = res.data
				}else{
					t.list = [...t.list,...res.data]
				}
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
			}
		},
		
		toAddress(id){
			let path = "./address_edit"
			if( id ) path+='?id='+id
			uni.navigateTo({
				url:path
			})
		},
		
		async setDefault(id,is_default){
			let t = this
			if( is_default == 1 ) return
			try{
				uni.showLoading({title:'设置中...'})
				let res = await pkAppUser.setAddressDefault(id)
				uni.showToast({
					title:'设置成功',
					success() {
						t.getAddressList(1)
						uni.hideLoading()
					}
				})
			}catch(e){
				uni.hideLoading()
				uni.showToast({
					title:e.errMsg,
					icon:'error'
				})
			}
		},
		deleteAddress(id){
			let t = this
			const deleteOpear = async function(){
				try{
					uni.showLoading({title:'正在删除...'})
					let res = await pkAppUser.deleteAddress(id)
					uni.hideLoading()
					uni.showToast({
						title:'删除成功',
						success() {
							t.getAddressList(1)
						}
					})
				}catch(e){
					uni.hideLoading()
					uni.showToast({
						title:e.errMsg,
						icon:'error'
					})
				}
			}
		
			uni.showModal({
				title:'提示',
				content:'确认删除地址信息吗?',
				success(tips) {
					if( tips.confirm){
						deleteOpear(id)
					}
				}
			})
		},
		
		chooseAddress(data){
			if( this.scene == 1 ){
				uni.setStorageSync('__selectAddress__',data)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.address-item{
	width: 94%;
	margin-left: 3%;
	padding: 24rpx;
	background: #fff;
	border-radius: 12rpx;
	box-shadow: 1px 1px 10px #efefef;
	&-top{
		width: 100%;
		border-bottom: 1rpx solid #f4f4f4;
		padding-bottom: 24rpx;
	}
	
	&-btm{
		margin-top: 24rpx;
	}
	
	.defult-icon{
		width: 72rpx;
		height: 72rpx;
		background: $uni-color-primary;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		border-radius: 50%;
	}
	.other-icon{
		width: 72rpx;
		height: 72rpx;
		background: rgba($color:$uni-color-primary, $alpha:.2);
		color: $uni-color-primary;
		text-align: center;
		line-height: 72rpx;
		border-radius: 50%;
		font-weight: bold;
	}
	.info{
		flex: 1;
		width: 50%;
		margin-left: 24rpx;
	}
}

.add-btn{
	width: 100%;
	height: 90rpx;
	background: $uni-color-primary;
	color: #fff;
	border-radius: 90rpx;
	font-size: 32rpx;
	text-align: center;
	line-height: 90rpx;
	
	.ri-add-line{
		position: relative;
		top: 4rpx;
	}
}


</style>
