<template>
<view>
	<view class="apply-banner">
		<image class="cover" :src="config.dis_banner" mode=""></image>
	</view>
	<view v-if="scene == 0">
		<view class="apply-title f16 fw">申请成为分销商</view>
		<view class="apply-form">
			<view class="form-label">
				<view class="f13 gy"><text class="requeire">*</text>真实姓名：</view>
				<input v-model="form.username" class="form-input mt6" type="text" placeholder="请输入真实姓名">
			</view>
			<view class="form-label mb6">
				<view class="f13 gy"><text class="requeire">*</text>电话号码：</view>
				<input v-model="form.mobile" class="form-input mt6" type="text" placeholder="请输入真实姓名">
			</view>
			<label class="rule f13 flex-c" @click="form.rule = !form.rule">
				<radio :checked="form.rule" style="transform: scale(.8);"/>
				<text>我已阅读并同意</text>
				<text class="xieyi" @click.stop="toAgreement">《分销商协议》</text>
			</label>
			<button type="primary" class="submit-btn" :loading="form.loading" @click="submitApply">提交申请</button>
		</view>
	</view>
	
	<view class="apply-condition" v-if="scene == 1">
		<view class="cond-tips flex-c">
			<view class="error-icon"><text class="ri-close-line"></text></view>
			<text class="f13 gy">很遗憾，您暂未满足成为分销商的条件！</text>
		</view>
		<template v-if="config.dis_condition.type == 1">
			<view class="cond-content">
				累计消费金额达到
				<text class="cond-txt">{{config.dis_condition.cost_price}}元</text>
				可申请成为分销商
			</view>
			<view class="mt12">
				<qiun-data-charts type="arcbar" :opts="opts" :chartData="chartData" />
			</view>
		</template>
		<template v-if="config.dis_condition.type == 2">
			<view class="cond-content">
				累计消费次数达到
				<text class="cond-txt">{{config.dis_condition.cost_count}}次</text>
				可申请成为分销商
			</view>
			<view class="mt12">
				<qiun-data-charts type="arcbar" :opts="opts" :chartData="chartData" />
			</view>
		</template>
		<template v-if="config.dis_condition.type == 3">
			<view class="cond-content">购买任意商品可申请成为分销商</view>
		</template>
		<template v-if="config.dis_condition.type == 4">
			<view class="cond-content">购买指定商品可申请成为分销商</view>
		</template>
		<view class="to-btn mt16" @click="toShopping">去逛逛</view>
	</view>

	<view class="apply-check" v-if="scene == 2">
		<view class="check-success flex-c">
			<view class="check-icon"><text class="ri-check-line"></text></view>
			<text class="f13 gy">申请提交成功，请耐心等待审核</text>
		</view>
		<view class="to-btn mt16" @click="toShopping">去逛逛</view>
	</view>
	
	<view class="apply-check" v-if="scene == 3">
		<view class="check-success flex-c">
			<view class="check-icon" style="background: orangered;"><text class="ri-close-line"></text></view>
			<text class="f13 gy">不好意思，您的申请你被驳回！</text>
		</view>
		<view class="check-reason mt12 f13">驳回理由：{{disUser.reject_reason}}</view>
		
		<view class="to-btn mt16" @click="scene = 0">重新申请</view>
	</view>

</view>
</template>

<script>
const pkAppCommon = uniCloud.importObject('pk-app-common')
export default{
	data(){
		return{
			scene:-1,		//0可申请 1不可申请 2审核中 3驳回
			chartData: {},
			opts: {
				title: {
					name: "80%",
					fontSize: 20,
					color: "#2fc25b"
				},
				subtitle: {
					name: "已消费",
					fontSize: 16,
					color: "#666666"
				},
			},
			config:{
				dis_banner:'',
				dis_condition:{
					type:0,	//0 无条件 1消费金额 2消费次数 3任意商品 4指定商品
					goods:null,
					cost_count:'',
					cost_price:''
				}
			},
			form:{
				username:'',
				mobile:'',
				rule:false,
				loading:false,
			},
			disUser:null
		}
	},
	async onLoad() {
		let t = this
		await this.initData()
	},
	methods:{
		
		async initData(){
			let t = this
			let disUser = await t.$request('distribution','getDisUserInfo')
			
			let configRes = await pkAppCommon.getSet(['dis_banner','dis_condition'])
			if( configRes.data ){
				t.config.dis_banner = configRes.data.dis_banner
				if( configRes.data.dis_condition ){
					t.config.dis_condition = configRes.data.dis_condition
				}
			}
			
			if( disUser.data){
				t.disUser = disUser.data
				if( disUser.data.status == 0 ){
					t.scene = 2
				}
				if( disUser.data.status == 1 ){
					uni.redirectTo({
						url:'./center'
					})
				}
				if( disUser.data.status == 2 ){
					t.scene = 3
				}
				return
			}
			
			let userAccount = await t.$request('user','getUserAccountTotal')
			let { type,goods,cost_count,cost_price} = t.config.dis_condition
			
			if( type == 0 ){
				t.scene =0
			}
			
			if( type == 1 ){
				if( parseFloat(userAccount.data.costMoney ) >= parseFloat(cost_price)){
					t.scene = 0
				}else{
					t.scene = 1
					let percent = parseFloat(userAccount.data.costMoney ) / parseFloat(cost_price)
					
					let res = {
						series: [{name: "已消费",color: "#2fc25b",data: percent}]
					};
					t.opts.title.name = userAccount.data.costMoney +'元'
					t.chartData = JSON.parse(JSON.stringify(res));
				}
			}
			
			if( type == 2 ){
				if( userAccount.data.order_total >= parseInt(cost_count)){
					t.scene = 0
				}else{
					t.scene = 1
					let percent = parseFloat(userAccount.data.order_total ) / parseInt(cost_count)
					
					let res = {
						series: [{name: "已消费",color: "#2fc25b",data: percent}]
					};
					t.opts.title.name = userAccount.data.order_total +'次'
					t.chartData = JSON.parse(JSON.stringify(res));
				}
			}
		
			if( type == 3 ){
				t.scene = userAccount.data.order_total >0 ? 0 :1
			}
			
			if( type == 4 ){
				let res = await t.$request('distribution','getOrderBuyGoods',goods.goods_id)
				t.scene = res.data ? 0 :1
			}
		},
		
		toShopping(){
			let t = this
			if( t.config.dis_condition.type == 4 ){
				uni.navigateTo({
					url:'/pages/shop/goods_detail?goods_id='+t.config.dis_condition.goods.goods_id
				})
				return
			}
			uni.navigateTo({
				url:'/pages/shop/list'
			})
		},
		toAgreement(){
			uni.navigateTo({
				url:'/pages/common/agreement?type=2'
			})
		},
		
		async submitApply(){
			let t = this , { username,mobile } = t.form
			if( !t.$util.verifyFiled(username,'请输入姓名')) return
			if( !t.$util.verifyFiled(mobile,'请输入电话')) return
			let reg = /^1[0-9]{10}$/;
			let flag = reg.test(mobile);
			if( !flag ){
				uni.showToast({
					title: '手机号码格式错误',
					icon: 'error'
				});
				return
			}
			if( !t.$util.verifyFiled(t.form.rule,'请先阅读并同意分销协议')) return
			t.form.loading = true
			try{
				let param = {username,mobile}
				if( t.disUser ) param.id = t.disUser._id
				let res = await t.$request('distribution','applyDis',param)
				t.form.loading = false
				if( res.errCode == 0 && !res.code ){
					uni.showToast({
						title:'申请提交成功'
					})
					t.scene = 2
				}
			}catch(e){
				t.form.loading = false
			}
		}
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
.apply-banner{
	width: 100%;
	height: 400rpx;
	.cover{
		width: 100%;
		height: 100%;
	}
}
.apply-title{
	padding: 24rpx;
	
}
.apply-form{
	padding: 24rpx;
	.form-label{
		padding: 24rpx 0;
		border-bottom: 1px solid #f4f4f4;
	}
	.form-input{
		height: 80rpx;
		line-height: 80rpx;
	}
	.requeire{
		color: red;
		position: relative;
		top: 4rpx;
		margin-right: 4rpx;
	}
	.rule{
		width: 100%;
		.xieyi{
			color: #0066FF;
		}
	}
	.submit-btn{
		width: 100%;
		height: 90rpx;
		border-radius: 90rpx;
		background: $uni-color-primary;
		margin-top: 48rpx;
	}
}

.apply-condition{
	width: 100%;
	
	.cond-tips{
		width: 100%;
		justify-content: center;
		padding-top: 48rpx;
		
		.error-icon{
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background: #ff8c25;
			color: #fff;
			text-align: center;
			line-height: 48rpx;
			font-size: 44rpx;
			margin-right: 12rpx;
		}
	}
	.cond-content{
		width: 100%;
		text-align: center;
		margin-top: 48rpx;
		.cond-txt{
			color: #FF3333;
		}
	}
	
}

.apply-check{
	width: 100%;
	padding-top: 120rpx;
	
	.check-success{
		width: 100%;
		justify-content: center;
	}
	.check-icon{
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		background: #00CC66;
		color: #fff;
		text-align: center;
		line-height: 48rpx;
		font-size: 44rpx;
		margin-right: 12rpx;
	}
	.check-reason{
		padding: 0 24rpx;
		text-align:center;
	}
}

.to-btn{
	width: 50%;
	height: 80rpx;
	border-radius: 80rpx;
	text-align: center;
	line-height: 80rpx;
	color: $uni-color-primary;
	margin-left: 25%;
	border: 1px solid $uni-color-primary;
	margin-top: 48rpx;
}

</style>