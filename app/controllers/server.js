var Server = require('../models/server')

exports.save = function(name, host, port, username, privateKey) {
	var server = new Server({
		name: name,
		host: host,
		port: port,
		username: username,
		privateKey: privateKey
	})

	server.save(function(err) {
		if(err) {
			console.log(err)
		}
	})
}

exports.find = function(name, callback) {
	var conditions = {'name': name}
	
	Server.findOne(conditions, function(err, server) {
		if(err)
			console.log(err)

		callback(server)
	})
}