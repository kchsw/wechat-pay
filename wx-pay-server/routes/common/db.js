const MongoClient = require('mongodb').MongoClient
const util = require("../../util/index")

const url = 'mongodb://localhost/wx-pay'

//查询数据
exports.query = (data, table) => {
	return new Promise((resolve, reject) => {
		connect((dbase, db) => {
			dbase.collection(table).find(data).toArray((err, res) => {
				if(err){
					throw err
				}else{
					db.close()
					resolve(util.handleSuc(res))
				}
			})
		})
	})
}
//插入数据
exports.insert = (data, table) => {
	return new Promise((resolve, reject) => {
		connect((dbase, db) => {
			dbase.collection(table).insertOne(data, (err, res) => {
				if(err){
					throw err
				}else{
					db.close()
					resolve(util.handleSuc(res))
				}
			})
		})
	})
}

function connect(callback){
	MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
		if(err) throw err
		let dbase = db.db('wx-pay')
		callback(dbase, db)
	})
}