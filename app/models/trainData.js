var mongoose = require('mongoose')

var TrainDataSchema = new mongoose.Schema({
	string: String,
	stem: String,
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('TrainData', TrainDataSchema)