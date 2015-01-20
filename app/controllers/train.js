var TrainData = require('../models/trainData')

exports.save = function(string, stem) {
	var trainData = new TrainData({
		string: string,
		stem: stem
	})

	trainData.save(function(err) {
		if(err) {
			console.log(err)
		}
	})
}