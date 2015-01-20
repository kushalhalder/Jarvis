var mongoose = require('mongoose')

var ChannelSchema = new mongoose.Schema({
	channelID: String,
	name: {
		type: String,
		required: true
	},
	messageCount: {
		type: Number,
		default: 1
	},
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Channel', ChannelSchema)