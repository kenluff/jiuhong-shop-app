/**
 * creator zyl
 * createTime 2022/05/26 10:32
 */
const db = uniCloud.database()
const dbcmd = db.command
const db_total = db.collection('pk-total')

module.exports = {
	/**
	 * 统计设置
	 * @param {String} key
	 * @param {Number} value
	 */
	setTotal:async function(key,value){
		let date = new Date()
		let totay_time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
		let res = await db_total.where({time:totay_time}).get()
		if( res.data.length == 0 ){
			let addData = {
				time:totay_time,
				order:0,
				pay_order:0,
				trade:0,
				cretae_time:new Date(totay_time).getTime()
			}
			addData[key] = parseInt(value)
			await db_total.add(addData)
		}else{
			let updateData = {}
			if(key =='order') updateData.order = res.data[0].order+parseInt(value)
			if(key =='pay_order') updateData.pay_order = res.data[0].pay_order+parseInt(value)
			if(key =='trade') updateData.trade = res.data[0].trade+parseInt(value)
			await db_total.doc(res.data[0]._id).update(updateData)
		}
	}
}
