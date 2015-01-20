var mongoose = require('mongoose')

var MessageSchema = new mongoose.Schema({
	message: String,
	channelID: String,
	userID: String,
	time: {
		type: Date,
		default: Date.now
	},
	sentimentScore: Number
})

module.exports = mongoose.model('Message', MessageSchema)