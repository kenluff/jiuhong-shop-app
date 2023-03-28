<template>
<view class="custom-item" v-if="customData">
	<view class="pk-swiper" v-if="scene == 'pk-slide'" :style="{height:customData.height+'px'}">
		<swiper class="pk-swiper-con" @change="changeSlideCurrent">
			<swiper-item v-for="(item,index) in customData.list" :key="index" @click="toDetail(item.path)">
				<image class="swiper-cover" :src="item.img" mode=""></image>
			</swiper-item>
		</swiper>
		<view class="swiper-dot">
			<view class="swiper-dot-li" 
				:class="[customData.dot_type,slide.current == index ?'active':'']"
				v-for="(item,index) in customData.list" :key="index"
			></view>
		</view>
	</view>
	
	<view class="pk-gird flex" v-if="scene == 'pk-gird'" :style="{background:customData.bg}">
		<view class="gird-item" :style="girdItem" 
			v-for="(item,index) in customData.list" 
			:key="index"
			@click="toDetail(item.path)"
		>
			<image class="gird-icon" :src="item.img" mode="" :style="{borderRadius:customData.radius+'px'}"></image>
			<view class="text-hidden" :style="{
				fontSize:customData.fontSize+'px',
				fontColor:customData.fontColor
			}">
				{{item.name}}
			</view>
		</view>
	</view>
	
	<view class="pk-title flex-sb" v-if="scene=='pk-title'" :style="titleBoxStyle">
		<view class="title-left" :style="{justifyContent:customData.textAlign}">
			<image class="title-icon" :src="customData.icon" mode=""></image>
			<text class="ml6" :style="{color:customData.fontColor,fontSize:customData.fontSize+'px'}">
				{{customData.name}}
			</text>
		</view>
		<view class="title-more f12 gy flex-c" v-if="customData.moreBtn">
			<text>更多</text>
			<text class="ri-arrow-right-s-line"></text>
		</view>
	</view>	
	
	<view class="pk-blank" v-if="scene=='pk-blank'"
		:style="{height:customData.height+'px',background:customData.bg}"
	></view>
	
	<view class="pk-magic" v-if="scene == 'pk-magic'" :style="{
			background:customData.bg,
			height:customData.height+'px',
			padding:customData.padding+'px',
		}">
		<view class="magic-row magic-row1" 
			v-if="customData.row == 1" 
			@click="toDetail(customData.list[0].path)"
		>
			<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
		</view>
		
		<view class="magic-row magic-row2 flex-sb" v-if="customData.row == 2">
			<view class="magic-row2-item" v-for="(item,index) in customData.list" :key="index" @click="toDetail(item.path)">
				<image class="magic-img" :style="magicImg" :src="item.img" mode=""></image>
			</view>
		</view>
		
		<view class="magic-row magic-row3 flex-sb" v-if="customData.row == 3">
			<view class="magic-row3-item" v-for="(item,index) in customData.list" :key="index" @click="toDetail(item.path)">
				<image class="magic-img" :style="magicImg" :src="item.img" mode=""></image>
			</view>
		</view>
		<view class="magic-row magic-row4 flex-sb" v-if="customData.row == 4">
			<view class="magic-row4-item" v-for="(item,index) in customData.list" :key="index" @click="toDetail(item.path)">
				<image class="magic-img" :style="magicImg" :src="item.img" mode=""></image>
			</view>
		</view>
		
		<view class="magic-row magic-row5 flex-sb" v-if="customData.row == 5">
			<view class="magic-row5-item" v-for="(item,index) in customData.list" :key="index" @click="toDetail(iitem.path)">
				<image class="magic-img" :style="magicImg" :src="item.img" mode=""></image>
			</view>
		</view>
		
		<view class="magic-row magic-row6 flex-sb" v-if="customData.row == 6">
			<view class="magic-row6-item" @click="toDetail(customData.list[0].path)">
				<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
			</view>
			<view class="magic-row6-right">
				<view class="magic-row6-right-item" @click="toDetail(customData.list[1].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[1].img" mode=""></image>
				</view>
				<view class="magic-row6-right-item" @click="toDetail(customData.list[2].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[2].img" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="magic-row magic-row6 flex-sb" v-if="customData.row ==7">
			<view class="magic-row6-right">
				<view class="magic-row6-right-item" @click="toDetail(customData.list[0].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
				</view>
				<view class="magic-row6-right-item" @click="toDetail(customData.list[1].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[1].img" mode=""></image>
				</view>
			</view>
			<view class="magic-row6-item" @click="toDetail(customData.list[3].path)">
				<image class="magic-img" :style="magicImg" :src="customData.list[2].img" mode=""></image>
			</view>
		</view>
		
		<view class="magic-row magic-row8" v-if="customData.row ==8">
			<view class="magic-row8-top" @click="toDetail(customData.list[0].path)">
				<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
			</view>
			<view class="magic-row8-btm flex-sb">
				<view class="magic-row8-btm-item" @click="toDetail(customData.list[1].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[1].img" mode=""></image>
				</view>
				<view class="magic-row8-btm-item" @click="toDetail(customData.list[2].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[2].img" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="magic-row magic-row9" v-if="customData.row ==9">
			<view class="magic-row9-btm flex-sb">
				<view class="magic-row9-btm-item" @click="toDetail(customData.list[0].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
				</view>
				<view class="magic-row9-btm-item" @click="toDetail(customData.list[1].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[1].img" mode=""></image>
				</view>
			</view>
			<view class="magic-row9-top" @click="toDetail(customData.list[2].path)">
				<image class="magic-img" :style="magicImg" :src="customData.list[2].img" mode=""></image>
			</view>
		</view>
		
		<view class="magic-row magic-row10 flex-sb" v-if="customData.row == 10">
			<view class="magic-row10-item" @click="toDetail(customData.list[0].path)">
				<image class="magic-img" :style="magicImg" :src="customData.list[0].img" mode=""></image>
			</view>
			<view class="magic-row10-right">
				<view class="magic-row10-right-top" @click="toDetail(customData.list[1].path)">
					<image class="magic-img" :style="magicImg" :src="customData.list[1].img" mode=""></image>
				</view>
				<view class="magic-row10-right-btm flex-sb">
					<view class="magic-row10-right-btm-item" @click="toDetail(customData.list[2].path)">
						<image class="magic-img" :style="magicImg" :src="customData.list[2].img" mode=""></image>
					</view>
					<view class="magic-row10-right-btm-item" @click="toDetail(customData.list[3].path)">
						<image class="magic-img" :style="magicImg" :src="customData.list[3].img" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
	</view>
	
	<view class="pk-line" v-if="scene == 'pk-line'" :style="lineStyle"></view>
	
	<view class="pk-article" v-if="scene == 'pk-article'" :style="articleStyle">
		<view class="article-item flex" 
			v-for="(item,index) in customData.list" 
			:key="index"
			:style="{borderRadius:customData.radius+'px',marginBottom:customData.spacing+'px'}"
			@click="toArticle(item._id)"
		>
			<image :src="item.cover" class="cover" mode=""></image>
			<view class="article-item-right">
				<view class="title f16 text-hidden">{{item.title}}</view>
				<view class="text-hidden f12 gy mt6">{{item.sub_title}}</view>
				<view class="time flex-sb f12 gy">
					<uni-dateformat :date="item.update_time" format="yy/MM/dd hh:mm"></uni-dateformat>
					<text>{{item.view_count || 0}}人浏览</text>
				</view>
			</view>
		</view>
	</view>
	
	<view class="pk-video" v-if="scene == 'pk-video'">
		<video class="video-con" id="myVideo" :src="customData.url" :poster="customData.icon" controls></video>
	</view>
	
	<view class="pk-goods" v-if="scene == 'pk-goods'" :style="goodsStyle">
		<view class="goods-row1" v-if="customData.row == 1">
			<view class="goods-row1-item flex" 
				v-for="(item,index) in customData.list" 
				:key="index"
				@click="toGoodsDetail(item._id)"
			>
				<image class="cover" :src="item.cover" mode=""></image>
				<view class="goods-row1-item-right">
					<view class="text-hidden f16">{{item.name}}</view>
					<view class="text-hidden f12 gy mt6">{{item.simple_desc}}</view>
					<view class="flex-sb item-btn">
						<text class="price">￥{{item.price}}</text>
						<view class="pay-btn f14" :style="{background:customData.iconColor}">
							立即购买
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="goods-row2 flex-sb" v-if="customData.row == 2">
			<view class="goods-row2-item" 
				v-for="(item,index) in customData.list" 
				:key="index"
				@click="toGoodsDetail(item._id)"
			>
				<image class="cover" :src="item.cover" mode=""></image>
				<view class="text-hidden name f14">{{item.name}}</view>
				<view class="goods-btm flex-sb">
					<text class="price">￥{{item.price}}</text>
					<view class="cart-btn" :style="{background:customData.iconColor}">
						<text class="ri-shopping-cart-2-fill"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="goods-row3 flex-sb" v-if="customData.row == 3">
			<view class="goods-row3-item" 
				v-for="(item,index) in customData.list" 
				:key="index"
				@click="toGoodsDetail(item._id)"
			>
				<image class="cover" :src="item.cover" mode=""></image>
				<view class="text-hidden name f12">{{item.name}}</view>
				<view class="goods-btm flex-sb">
					<text class="price">￥{{item.price}}</text>
					<view class="cart-btn" :style="{background:customData.iconColor}">
						<text class="ri-shopping-cart-2-fill"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
	
	<view class="pk-coupon" v-if="scene=='pk-coupon'" :style="couponStyle">
		<view class="coupon-row1" v-if="customData.row == 1">
			<view class="coupon-row1-item flex-sb" v-for="(item,index) in customData.list" :key="index">
				<view class="item-left">
					<view class="price" :style="{color:customData.color}">
						<text class="f12">￥</text>
						<text class="price-txt">{{item.coupon_price}}</text>
					</view>
					<view class="f12 gy">满{{item.low_price}}元可用</view>
				</view>
				<view class="item-center">
					<view class="f16 text-hidden">{{item.name}}</view>
					<view class="time f12 gy mt6">
						<uni-dateformat :date="item.start_time" format="yy/MM/dd hh:mm"></uni-dateformat>~
						<uni-dateformat :date="item.end_time" format="yy/MM/dd hh:mm"></uni-dateformat>
					</view>
				</view>
				<view class="item-right" style="background:#ccc" v-if="item.isGet == 1">
					<view class="geted">已</view>
					<view class="geted">领</view>
					<view class="geted">取</view>
				</view>
				<view class="item-right" :style="{
					background:customData.color
				}" v-else @click="getCoupon(item._id,index)">
					<view class="get">取</view>
					<view class="get">领</view>
				</view>
				
				<view class="cycle">
					<view class="cycle-li" :style="{background:customData.bg}" v-for="val in 7" :key="val"></view>
				</view>
			</view>
		</view>
	
		<view class="coupon-row2 flex-sb" v-if="customData.row == 2">
			<view class="coupon-row2-item" 
				v-for="(item,index) in customData.list" 
				:key="index"
				:style="{background:item.isGet == 1 ?'#ccc':''}"
			>
				<view class="price">
					<text class="f12">￥</text>
					<text class="price-txt">{{item.coupon_price}}</text>
				</view>
				<view class="name mt6 text-hidden f14">{{item.name}}</view>
				<view class="f14 mt6">满{{item.low_price}}元可用</view>
				<view class="get-btn" v-if="item.isGet == 1" style="color: #ccc;">已领取</view>
				<view class="get-btn" v-else>领取</view>
				
				<view class="cycle cycle-left">
					<view class="cycle-li" :style="{background:customData.bg}" v-for="val in 10" :key="val"></view>
				</view>
				<view class="cycle cycle-right">
					<view class="cycle-li" :style="{background:customData.bg}" v-for="val in 10" :key="val"></view>
				</view>
			</view>
		</view>
	</view>
	
</view>
</template>
<script>
const pkAppCoupon = uniCloud.importObject('pk-app-coupon')
export default{
	name:'custom-item',
	props:{
		scene:{
			type:String
		},
		customData:{
			type:Object
		}
	},
	data(){
		return{
			slide:{
				current:0,
			}
		}
	},
	computed:{
		girdItem(){
			let style = ''
			if( !this.customData ) return ''
			if( this.customData.row  == 2 ) style = 'width:50%;'
			if( this.customData.row  == 3 ) style = 'width:33.3%;'
			if( this.customData.row  == 4 ) style = 'width:25%;'
			if( this.customData.row  == 5 ) style = 'width:20%;'
			return style
		},
		titleBoxStyle(){
			if( !this.customData ) return ''
			return `background:${this.customData.bg};padding:${this.customData.tbPadding}px ${this.customData.lrPadding}px;`
		},
		magicImg(){
			return `border-radius:${this.customData.radius}px;`
		},
		lineStyle(){
			if( !this.customData) return
			return `background:${this.customData.bg};
				border-top:${this.customData.height}px ${this.customData.lineType} ${this.customData.color}`
		},
		articleStyle(){
			if( !this.customData) return
			return `background:${this.customData.bg};padding:${this.customData.padding}px`
		},
		goodsStyle(){
			if( !this.customData) return
			return `background:${this.customData.bg};padding:${this.customData.padding}px`
		},
		couponStyle(){
			if( !this.customData) return
			return `background:${this.customData.bg};padding:${this.customData.padding}px`
		}
	},
	methods:{
		changeSlideCurrent(e){
			this.slide.current = e.detail.current
		},
		
		toDetail(path){
			uni.navigateTo({
				url:path
			})
		},
		toGoodsDetail(id){
			uni.navigateTo({
				url:'/pages/shop/goods_detail?goods_id='+id
			})
		},
		toArticle(id){
			uni.navigateTo({
				url:'/pages/common/article/detail?id='+id
			})
		},
		async getCoupon(id,index){
			let t = this
			try{
				uni.showLoading({title:'领取中...'})
				let res = await pkAppCoupon.receiveCoupon(id)
				uni.hideLoading()
				uni.showToast({
					title:'领取成功',
					success() {
						setTimeout(function(){
							t.customData.list[index].isGet = 1
						},1000)
					}
				})
			}catch(e){
				uni.hideLoading()
				uni.showModal({
					title:'提示',
					content:e.errMsg,
					showCancel:false
				})
			}
		}
		
	}
}
</script>

<style lang="scss" scoped>
.pk-swiper{
	width: 100%;
	height: 200px;
	position: relative;
	
	&-con{
		width: 100%;
		height: 100%;
	}
	.swiper-cover{
		width: 100%;
		height: 100%;
	}
	
	.swiper-dot{
		width: 100%;
		position: absolute;
		height: 8px;
		bottom: 8px;
		display: flex;
		justify-content: center;
		&-li{
			width: 8px;
			height: 8px;
			background: #fff;
			margin: 0 5px;
		}
		.active{
			background: #000;
		}
		.cycle{
			border-radius: 50%;
		}
		.square{
			transform: rotate(45deg);
		}
	}
}

.pk-gird{
	width: 100%;
	padding: 24rpx;
	flex-wrap: wrap;
	
	.gird-item{
		width: 25%;
		height: 180rpx;
		text-align: center;
	}
	.gird-icon{
		width: 100rpx;
		height: 100rpx;
	}
}

.pk-title{
	width: 100%;
	background: #fff;
	
	.title-left{
		width: 90%;
		flex: 1;
		display: flex;
		align-items: center;
		.title-icon{
			width: 20px;
			height: 20px;
		}
	}
	.ri-arrow-right-s-line{
		font-size: 16px;
	}
}

.pk-blank{
	width: 100%;
}

.pk-magic{
	width: 100%;
	
	.magic-row{
		width: 100%;
		height: 100%;
	}
	.magic-img{
		width: 100%;
		height: 100%;
	}
	
	.magic-row2{
		&-item{
			width: 49%;
			height:100%;
		}
	}
	.magic-row3{
		&-item{
			width: 32%;
			height:100%;
		}
	}
	.magic-row4{
		&-item{
			width: 24%;
			height:100%;
		}
	}
	.magic-row5{
		flex-wrap: wrap;
		&-item{
			width: 49%;
			height:49%;
			margin-bottom: 12rpx;
		}
	}
	
	.magic-row6{
		&-item{
			width: 49%;
			height: 100%;
		}
		&-right{
			width: 49%;
			height: 100%;
			&-item{
				width: 100%;
				height: 48%;
				&:first-child{
					margin-bottom: 4%;
				}
			}
		}
	}
	
	.magic-row8{
		&-top{
			width: 100%;
			height: 48%;
			margin-bottom: 2%;
		}
		
		&-btm{
			width: 100%;
			height: 50%;
			
			&-item{
				width: 49%;
				height: 100%;
			}
		}
	}
	.magic-row9{
		&-top{
			width: 100%;
			height: 48%;
		}
		
		&-btm{
			width: 100%;
			height: 50%;
			margin-bottom: 2%;
			
			&-item{
				width: 49%;
				height: 100%;
			}
		}
	}
	
	.magic-row10{
		&-item{
			width: 49%;
			height: 100%;
		}
		
		&-right{
			width: 50%;
			height: 100%;
			&-top{
				width: 100%;
				height: 48%;
				margin-bottom: 2%;
			}
			
			&-btm{
				width: 100%;
				height: 50%;
				
				&-item{
					width: 49%;
					height: 100%;
				}
			}
		}
	}
}

.pk-line{
	width: 100%;
}

.pk-article{
	width: 100%;
	padding: 24rpx;
	
	.article-item{
		width: 100%;
		padding: 24rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
		
		&:last-child{
			margin-bottom: 0 !important;
		}
		
		.cover{
			width: 180rpx;
			height: 180rpx;
			margin-right: 12rpx;
			border-radius: 12rpx;
		}
		
		&-right{
			flex: 1;
			width: 60%;
			position: relative;
		}
		.time{
			position: absolute;
			width: 100%;
			bottom: 24rpx;
		}
	}
}

.pk-video{
	width: 100%;
	height: 450rpx;
	.video-con{
		width: 100%;
		height: 100%;
	}
}

.pk-goods{
	width: 100%;
	padding: 24rpx;
	.price{
		color: #FF3333;
	}
	.goods-row1{
		width: 100%;
		
		&-item{
			width: 100%;
			padding: 24rpx;
			border-radius: 24rpx;
			background: #fff;
			margin-bottom: 24rpx;
			
			&:last-child{
				margin-bottom: 0;
			}
			
			.cover{
				width: 180rpx;
				height: 180rpx;
				margin-right: 24rpx;
				border-radius: 12rpx;
			}
			&-right{
				width: 60%;
				flex: 1;
				position: relative;
			}
			.item-btn{
				position: absolute;
				width: 100%;
				bottom: 0;
				.pay-btn{
					padding: 10rpx 24rpx;
					background: #FF3333;
					color: #fff;
					border-radius: 64rpx;
				}
			}
		}
	}
	
	.goods-row2{
		width: 100%;
		flex-wrap: wrap;
		&-item{
			width: 49%;
			height: 480rpx;
			background: #fff;
			border-radius: 16rpx;
			margin-bottom: 16rpx;
			
			.cover{
				width: 100%;
				height:360rpx;
				border-radius: 16rpx 16rpx 0 0;
			}
			.name{
				padding: 0 6rpx;
			}
			.goods-btm{
				padding: 0 12rpx 0 0;
				margin-top: 12rpx;
			}
			.cart-btn{
				width: 48rpx;
				height: 48rpx;
				text-align: center;
				background: #FF3333;
				color: #fff;
				border-radius: 50%;
				line-height: 48rpx;
			}
		}
	}
	
	.goods-row3{
		width: 100%;
		flex-wrap: wrap;
		
		&::after{
			content: "";
			width: 32%;
		}
		
		&-item{
			width: 32%;
			height: 360rpx;
			background: #fff;
			border-radius: 16rpx;
			margin-bottom: 16rpx;
			
			.cover{
				width: 100%;
				height:234rpx;
				border-radius: 16rpx 16rpx 0 0;
			}
			.name{
				padding: 0 6rpx;
			}
			.goods-btm{
				padding: 0 12rpx 0 0;
				margin-top: 12rpx;
			}
			.cart-btn{
				width: 48rpx;
				height: 48rpx;
				text-align: center;
				background: #FF3333;
				color: #fff;
				border-radius: 50%;
				line-height: 48rpx;
			}
		}
	}

}

.pk-coupon{
	width: 100%;
	padding: 24rpx;
	.coupon-row1{
		width: 100%;
		
		&-item{
			width: 100%;
			background: #fff;
			border-radius: 12rpx;
			align-items: center;
			height: 160rpx;
			margin-bottom: 24rpx;
			position: relative;
			&:last-child{
				margin-bottom: 0;
			}
			.item-left{
				width: 100px;
				text-align: center;
				border-right: 1px dashed #ccc;
				.price{
					color: #FF3333;
				}
				.price-txt{
					font-size: 20px;
				}
			}
			.item-center{
				flex: 1;
				width: 60%;
			}
			.item-right{
				width: 40px;
				height: 100%;
				display: table;
				text-align: center;
				padding: 10px 0px;
				background: #FF3333;
				color: #fff;
				border-radius: 0 12rpx 12rpx 0;
				.get{
					display: table-footer-group;
					vertical-align: middle;
				}
				.geted{
					vertical-align: middle;
				}
			}
			.cycle{
				width: 20rpx;
				height: 100%;
				position: absolute;
				right: 35px;
				top: -10rpx;
				
				&-li{
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					background: #f4f4f4;
					margin-bottom: 6rpx;
				}
			}
		}
	}

	.coupon-row2{
		width: 100%;
		flex-wrap: wrap;
		
		&-item{
			width: 48%;
			height: 300rpx;
			background: #FF3333;
			padding: 24rpx 0;
			text-align: center;
			color: #fff;
			position: relative;
			margin-bottom: 24rpx;
			
			&:nth-last-child(1){
				margin-bottom: 0;
			}
			&:nth-last-child(2){
				margin-bottom: 0;
			}
		}
		.price-txt{
			font-size: 20px;
		}
		.get-btn{
			position: absolute;
			width: 60%;
			margin-left: 20%;
			height: 64rpx;
			line-height: 64rpx;
			background: #fff;
			border-radius: 64rpx;
			text-align: center;
			bottom: 24rpx;
			color: #FF3333;
		}
		.cycle{
			width: 20rpx;
			height: 100%;
			top: 0;
			position: absolute;
			&-li{
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				margin-bottom: 12rpx;
			}
		}
		.cycle-left{
			left: -10rpx;
		}
		.cycle-right{
			right: -10rpx;
		}
	}
}



</style>