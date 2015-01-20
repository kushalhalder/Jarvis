var Message = require('../models/message')

exports.save = function(message, channelID, userID, s) {
	var message = new Message({
		message: message,
		channelID: channelID,
		userID: userID,
		sentimentScore: s
	})

	message.save(function(err) {
		if(err) {
			console.log(err)
		}
	})
}