var traindata = require("../models/trainData")
var Connection = require('./ssh_connection')

function Response(classifier) {
	this.classifier = classifier
	this.conn = new Connection()
}

Response.prototype.trainAll = function() {
	// query to get all the Training data from the DB
	var resp = this
	traindata.find(function(err, sample) {
		if(err)
			console.log(err)
		else if(sample.length) {
			// for loop for training 
			//console.log(sample)
			for (var i in sample) {
				console.log("Training %s for %s", sample[i].string, sample[i].stem)
				resp.train(sample[i].string, sample[i].stem)
			}
			//this.classifier.train()
			//console.log(resp.classifier.classify("what time is it"))
		}
	})
}

Response.prototype.train = function(string, stem) {
	this.classifier.addDocument(string, stem)
	this.classifier.train()
};

Response.prototype.output = function(string) {
	console.log(this.classifier.classify(string))
};

Response.prototype.classify = function(string) {
	return this.classifier.classify(string)
};

Response.prototype.reply = function(slack, channel, user, text) {
	var reply = this.classify(text)
	console.log(reply)

	switch(reply) {
		case "time":
			channel.send(""+Date.now())
			break
		case "cmspull":
			this.conn.pull_request(channel, "cms", "coupondunia")
			response = "You have asked me to do a pull on cms"
			channel.send(response)
			console.log("Jarvis has been asked to pull on %s", "cms")
			break
		case "logospull":
			this.conn.pull_request(channel, "logos", "coupondunia")
			response = "You have asked me to do a pull on logos"
			channel.send(response)
			console.log("Jarvis has been asked to pull on %s", "logos")
			break
		case "stagingbranch":
			var m = text.match(/(staging(\d)|staging)/)

			if(m)
				if(m[1]) {
					var number = m[1].trim()
					if(number == '')
						number = 1
					this.conn.branch_request(channel, m[1], "staging")
					
				}

			break
	}
};

module.exports = Response