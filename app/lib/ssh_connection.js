var Ssh = require('ssh2');
var serverController = require('../controllers/server')

function Connection() {
    this.output = '';
}

Connection.prototype.connect = function(cmd, channel, server, comment) {
    var conn = new Ssh();
    conn.on('ready', function() {
        console.log('Connection :: ready');
        channel.send('Connection is ready.');
        conn.exec(cmd, function(err, stream) {
            if (err) throw err;
            stream.on('exit', function(code, signal) {
                console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('data', function(data) {
                if(comment)
                    channel.send(comment + "*" + data.toString() + "*")
                else
                    channel.send("Server says: " + "*" + data.toString() + "*")
                console.log('STDOUT: ' + data);
            }).on('close', function() {
                console.log('Stream :: close');
                conn.end();
                channel.send('Connection has been closed.');
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: server.host,
        port: server.port,
        username: server.username,
        privateKey: require('fs').readFileSync('./assets/'+server.privateKey)
    });
};

Connection.prototype.pull_request = function(channel, repo, serverName) {
    var conn = this
    serverController.find(serverName, function(server){
        console.log("serverdata: " + server.name)
        if(server) {
            if(repo == "cms")
                var send_request = conn.connect("cd /data/www/cd-cms && git pull", channel, server);
            else if(repo == "logos")
                var send_request = conn.connect("cd /data/www/cd2/web/sitespecific && git pull", channel, server);
        }
        else
            channel.send("This server does not exist.")
    })
}

Connection.prototype.branch_request = function(channel, repo, serverName) {
    var conn = this
    serverController.find(serverName, function(server) {
        var repoMap = conn.map_staging(repo)
        var send_request = conn.connect("cd /data/www/" + repoMap + " && git rev-parse --abbrev-ref HEAD", channel, server, "The branch is ")

    })

};

Connection.prototype.map_staging = function(repo) {
    switch(repo) {
        case "staging":
            return "coupondunia"
        case "staging2":
            return "coupondunia2"
        case "staging3":
            return "coupondunia3"
        default:
            return repo
    }
};

module.exports = Connection;
