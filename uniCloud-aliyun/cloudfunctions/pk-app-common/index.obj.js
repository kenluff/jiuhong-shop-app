/**
 * creator zyl
 * createTime 2022/05/17 17:00
 */
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const $ = db.command.aggregate
const db_page = db.collection('pk-page')
module.exports = {
	/**
	 * 获取首页配置数据
	 */
	getHomePage:async function(){
		// const payload = await uniID.checkToken(this._event.uniIdToken)
		const token = this.getUniIdToken()
		const payload = await uniID.checkToken(token)
		let res = await db_page.where({is_default:1,type:'home'}).get()
		if( res.data.length == 0 ) return {errCode:'error',errMsg:'请先配置页面'}
		let _d = res.data[0].value
		
		for (var i = 0; i < _d.length; i++) {
			if( _d[i].type == 'pk-article' ){
				if( _d[i].dataFrom == 1 ){
					let res = await db.collection('pk-article')
						.orderBy('update_time','desc')
						.limit(_d[i].limit)
						.get()
					_d[i].list = res.data
				}else{
					let ids = []
					_d[i].list.forEach(item=>ids.push(item._id))
					let res = await db.collection('pk-article').where({_id:dbCmd.in(ids)}).get()
					_d[i].list = res.data
				}
			}
			
			if( _d[i].type == 'pk-goods' ){
				if( _d[i].dataFrom == 1 ){
					let res = await db.collection('pk-goods')
						.orderBy('rank','asc')
						.limit(_d[i].limit)
						.get()
					_d[i].list = res.data
				}else{
					let ids = []
					_d[i].list.forEach(item=>ids.push(item._id))
					let res = await db.collection('pk-goods').where({_id:dbCmd.in(ids)}).get()
					_d[i].list = res.data
				}
			}
			
			if( _d[i].type == 'pk-coupon' ){
				let _w = {}
				if( _d[i].dataFrom != 1 ){
					let ids = []
					_d[i].list.forEach(item=>ids.push(item._id))
					_w._id = dbCmd.in(ids)
				}
				let list = []
				if( payload.uid ){
					let res = await db.collection('pk-goods-coupon').aggregate().lookup({
						from:'pk-user-coupon',
						let: {
							coupon_id: '$_id',
							user_id:payload.uid
						},
						pipeline: $.pipeline()
						.match(dbCmd.expr($.and([
							$.eq(['$coupon_id', '$$coupon_id']),
							$.eq(['$uid','$$user_id'])
						]))).done(),
						as: 'isGet',
					}).match(_w).sort({create_time:-1}).limit(_d[i].limit).end()
					res.data.forEach(item=>{
						let isGet = item.isGet.length >0 ? 1:0
						list.push({...item,isGet})
					})
				}else{
					let res = await db.collection('pk-goods-coupon').where(_w).get()
					list = res.data
				}
				
				_d[i].list = list
			}
		}
		return { errCode:0,errMsg:'success',data:{...res.data[0],value:_d}}
	},
	
	/**
	 * 文章浏览量
	 * @param {Object} id
	 */
	readArticle:async function(id){
		let articleData = await db.collection('pk-article').doc(id).get()
		let update = null
		if( articleData.data[0].view_count ){
			update = { view_count:dbCmd.inc(1)}
		}else{
			update = { view_count:1}
		}
		let res = await db.collection('pk-article').doc(id).update(update)
		return { errCode:0,errMsg:'success'}
	},
	
	/**
	 * 获取配置列表
	 * @param {Object} keys
	 */
	getSet:async function(keys){
		let res = await db.collection('pk-set').where({key:dbCmd.in(keys)}).get()
		let list = {}
		res.data.forEach(item=>{
			list[item.key] = item.value
		})
		
		return { errCode:0,errMsg:'success',data:list}
	}
}
