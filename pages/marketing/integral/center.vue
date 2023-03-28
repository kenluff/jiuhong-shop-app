<template>
<view>
	<view class="center-header">
		<view class="user-info flex-c">
			<image v-if="userInfo" :src="userInfo.avatar" class="avatar" mode=""></image>
			<image v-else src="../../../static/img/default-head.png" class="avatar" mode=""></image>
			<view class="ml12" @click="toLogin">
				<view class="name f16 fw">{{userInfo ? userInfo.nickname:'未登录'}}</view>
				<view class="desc f12 mt6">明日签到可得{{nextScore}}积分</view>
			</view>
		</view>
		<view class="score flex-c" @click="toScoreDetail">
			<text class="ri-coins-line mr6"></text>
			{{userInfo ?userInfo.score:0}}积分
		</view>
	</view>
	<view class="sign ">
		<view class="fw f16">已连续签到{{signTotal}}天</view>
		<view class="sign-view mt12 flex-sb" >
			<view class="sign-item" 
				:class="item.sign ?'active':''" 
				v-for="(item,index) in signWeek" 
				:key="index"
			>
				<view class="score">+{{item.score}}</view>
				<view class="f12 mt12">第{{item.day}}天</view>
			</view>
		</view>
		
		<view class="sign-footer flex-sb mt12">
			<view class="gy f14" @click="showSignRule(true)">
				签到规则 <text class="ri-question-line"></text> 
			</view>
			<button class="sign-btn" @click="signNow" v-if="!sign">立即签到</button>
			<button class="sign-btn" style="background: #ccc;" v-else>今日已签到</button>
		</view>
	</view>	
	
	<view class="goods-info">
		<view class="title flex-sb">
			<text class="fw f16">热门兑换</text>
			<view class="f12 gy flex-c" @click="toIntegralList">
				查看更多 <text class="ri-arrow-right-s-line f18"></text> 
			</view>
		</view>
		
		<view class="goods-con flex-sb mt12">
			<view class="goods-item" 
				v-for="(item,index) in goodsList" 
				:key="index" 
				@click="toIntegralGoodsDetail(item._id)"
			>
				<image :src="item.cover" class="cover" mode=""></image>
				<view class="name text-hidden">
					{{item.name}}
				</view>
				<view class="desc f12 gy text-hidden mt6">{{item.simple_desc}}</view>
				<view class="price mt6">
					<text class="score">{{item.score}}积分</text>
					<text class="old-price f12 gy">￥{{item.old_price}}</text>
				</view>
			</view>
		</view>
	</view>
	
	<uni-popup ref="popup" type="bottom" radius="24rpx 24rpx 0 0">
		<view class="sign-rule">
			<text class="ri-close-fill" @click="showSignRule(false)"></text>
			<view class="f16 fw">签到规则说明</view>
			<view class="sign-rule-content mt12">
				<u-parse :html="integral_sign_desc"></u-parse>
			</view>
		</view>
	</uni-popup>
	
</view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue'
export default{
	components:{
		uParse
	},
	data(){
		return{
			userInfo:null,
			signWeek:[],
			signTotal:0,
			sign:false,
			goodsList:[],
			integral_sign_desc:'',
			nextScore:0,	//明日签到可获得积分
		}
	},
	onShow() {
		this.getUserInfo()
		this.getIntegralGoods()
		// this.$refs.popup.open()
	},
	
	methods:{
		async getUserInfo(){
			let t = this
			let res = await t.$request('user','getPkUserDetail')
			
			if( res.data ){
				t.userInfo = res.data
				let signRes = await t.$request('integral','getUserSign')
				t.signTotal = signRes.data.signTotal
				t.signWeek = signRes.data.signData
				t.sign = signRes.data.sign
				t.integral_sign_desc = signRes.data.integral_sign_desc || ''
				t.nextScore = signRes.data.nextScore
			}
		},
		
		async getIntegralGoods(){
			let t = this
			let res = await t.$request('integral','getIntegralGoods',{page:1,limit:6,search:{hot:1}})
			t.goodsList = res.data
		},
		
		async signNow(){
			let t = this
			let res = await t.$request('integral','userSign')
			uni.showToast({
				title:'签到成功'
			})
			t.getUserInfo()
		},
		
		toIntegralGoodsDetail(id){
			uni.navigateTo({
				url:'./detail?id='+id
			})
		},
		
		toIntegralList(){
			uni.navigateTo({
				url:'./list'
			})
		},
		toScoreDetail(){
			uni.navigateTo({
				url:'/pages/ucenter/wallet/score_record'
			})
		},
		toLogin(){
			if( !this.userInfo ){
				this.$util.checkLogon(true)
			}
		},
		showSignRule(show){
			show ? this.$refs.popup.open() :this.$refs.popup.close()
			
		}
	}
}
</script>

<style lang="scss" scoped>
.center-header{
	width: 100%;
	height: 300rpx;
	background: $uni-color-primary;
	padding: 24rpx;
	
	.user-info{
		color: #fff;
		margin-top: 48rpx;
		.avatar{
			width:128rpx;
			height: 128rpx;
			border-radius: 50%;
		}
	}
	.score{
		padding: 12rpx 24rpx;
		border-radius: 64rpx 0 0 64rpx;
		background: rgba(#fff, .2);
		display: inline-block;
		position: absolute;
		right: 0;
		top: 112rpx;
		color: #fff;
	}
}

.sign{
	width: 94%;
	margin-left: 3%;
	background: #fff;
	border-radius: 24rpx;
	position: relative;
	top: -80rpx;
	padding: 24rpx;
	
	.sign-view{
		width: 100%;
		flex-wrap: wrap;
	}
	.sign-item{
		width: 23%;
		height: 180rpx;
		text-align: center;
		background: #f0f4ff;
		padding-top: 12rpx;
		display: inline-block;
		text-align: center;
		margin-top:12rpx;
		border-radius: 12rpx;
		color: #999;
		
		&:last-child{
			width: 49%;
		}
		.score{
			width: 100rpx;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50%;
			background: #fff;
			display: inline-block;
		}
	}
	
	.active{
		background: linear-gradient(220.55deg, #FFD439 0%, #FF7A00 100%);
		color: #fff;
		font-weight: bold;
		
		.score{
			color: #FF7A00;
		}
	}
	
	&-footer{
		width: 100%;
		align-items: center;
		
		.sign-btn{
			margin: 0;
			background: $uni-color-primary;
			color: #fff;
			border-radius: 90rpx;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 48rpx;
			border: none;
		}
	}
	.ri-question-line{
		position: relative;
		top: 4rpx;
	}
}

.goods-info{
	padding: 0 24rpx;
	position: relative;
	top: -48rpx;
	.title{
		align-items: center;
	}
	.goods-con{
		width: 100%;
		flex-wrap: wrap;
	}
	.goods-item{
		width: 48%;
		background: #fff;
		border-radius: 24rpx;
		height: 520rpx;
		margin-bottom: 24rpx;
		
		.cover{
			width: 100%;
			height: 350rpx;
			border-radius: 24rpx 24rpx 0 0;
		}
		.desc,.name,.price{
			padding: 0 12rpx;
		}
		.old-price{
			text-decoration: line-through;
		}
		.score{
			color: $uni-color-primary;
		}
	}
}

.sign-rule{
	width: 100%;
	height: 1000rpx;
	background: #fff;
	padding: 24rpx;
	border-radius: 24rpx 24rpx 0 0;
	position: relative;
	
	&-content{
		width: 100%;
		height: 880rpx;
		overflow: hidden;
		overflow-y: auto;
	}
	.ri-close-fill{
		position: absolute;
		right: 24rpx;
		top: 24rpx;
		font-size: 44rpx;
	}
}

</style>