var mongoose = require('mongoose')

var ServerSchema = new mongoose.Schema({
	name: String,
	host: String,
	port: {
		type: Number,
		default: 22
	},
	username: {
		type: String,
		default: 'root'
	},
	privateKey: String
})

module.exports = mongoose.model('Server', ServerSchema)