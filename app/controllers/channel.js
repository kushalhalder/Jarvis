var Channel = require('../models/channel')

exports.createChannel = function(ID, name) {
	var channel = new Channel({
		channelID: ID,
		name: name
	})

	channel.save(function(err) {
		if(err) {
			console.log(err)
		}
		/*else
			console.log("#" + name + " has been created")*/
	})
}

exports.updateChannel = function(ID, name) {
	var conditions = {'channelID': ID},
		update = {$inc: {'messageCount' : 1}}

	Channel.find(conditions, function(err, channel){
		if(err)
			console.log(err)
		else if(channel.length) {
			Channel.update(conditions, update, function(err, numAffected){
				if(err) {
					console.log(err)
				}
				else
					console.log("#" + ID + "'s count has been updated")
			})
		}
		else{
			//console.log("create")
			var channel = new Channel({
				channelID: ID,
				name: name
			})

			channel.save(function(err) {
				if(err) {
					console.log(err)
				}
				else
					console.log("#" + name + " has been created")
			})
		}
	})


	
}

exports.findByName = function(name) {
	var conditions = {'name' : name}

	Channel.find(conditions, function(err, channel){
		console.log(channel)
		if(err)
			console.log(err)
		else if(channel) {
			console.log(true)
			return true
		}
		else{
			console.log(false)
			return false
		}
	})
}