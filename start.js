// This is a simple example of how to use the slack-client module. It creates a
// bot that responds to all messages in all channels it is in with a reversed
// string of the text received.
//
// To run, copy your token below, then:
//  npm install
//  cd examples
//  node simple.js

var Slack = require("slack-client"),
    Readline  = require('readline'),
    jarvis = require("./app/lib/jarvis"),
    config = require("./assets/config"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    port = 3700

//var StanfordSimpleNLP = require('node-stanford-simple-nlp');

var token = config.token,
    autoReconnect = true,
    autoMark = true;

var slack = jarvis.slack = new Slack(token, autoReconnect, autoMark);
//var slack = null
var rl = Readline.createInterface(process.stdin, process.stdout);

mongoose.connect('mongodb://localhost:27017/slack')

slack.on('open', function() {

    var channels = [],
        groups = [],
        ims = [],
        unreads = slack.getUnreadCount(),
        key;

    for (key in slack.channels) {
        if (slack.channels[key].is_member) {
            channels.push('#' + slack.channels[key].name);
        }
    }

    for (key in slack.groups) {
        if (slack.groups[key].is_open && !slack.groups[key].is_archived) {
            groups.push(slack.groups[key].name);
        }
    }

    console.log('Welcome to Slack. You are @%s of %s', slack.self.name, slack.team.name)
    console.log('You are in: %s', channels.join(', '))
    console.log('As well as: %s', groups.join(', '))
    console.log('You have %s unread ' + (unreads === 1 ? 'message' : 'messages'), unreads)
    //jarvis.watchDB(slack, config.memcache_test, "log", "monitor")

    var monitor = slack.getChannelGroupOrDMByName("monitor")
    jarvis.watchFile(monitor, "/data/code_base/pharmaeasy/backend/runtime/logs/app.log")
    jarvis.watchFile(monitor, "/data/code_base/pharmaeasy/api/runtime/logs/app.log")
});

slack.on('message', function(message) {
    var type = message.type,
        channel = slack.getChannelGroupOrDMByID(message.channel),
        user = slack.getUserByID(message.user),
        time = message.ts,
        text = message.text

    console.log('Received: %s %s %s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user ? "@"+user.name : '', time, text);
    if(type === "message")
    {
        if(text)
        {
            var bc = bakchodi(message)
            if(bc[0])
                channel.send(bc[1])

            if(jarvis.called(text))
            {
                jarvis.message = message
                jarvis.channel = channel
                jarvis.getMessage(text, function(text) {
                    jarvis.analyze(text)
                })
            }
        }
    }
})

slack.on('error', function(error) {
    console.error('Error: %s', error);
});

rl.on('line', function(line) {
    var channel, cmd, name, rest, text;
    cmd = line.split(' ', 1);
    rest = line.replace(cmd[0], '').trim();

    switch (cmd[0]) {
        case "/msg":
            if (rest) {
                name = rest.split(' ', 1);
                text = rest.replace(name, '').trim();
                channel = slack.getChannelGroupOrDMByName(name[0]);
                if (!channel) {
                    console.log("Could not find channel '%s'", name[0]);
                }
                else if (!text) {
                    console.log("Need something to send!");
                }
                else {
                    console.log("Sending '%s' to '%s'", text, name[0]);
                    channel.send(text);
                }
            } else {
                console.log("Sorry, what? Try /help");
            }
            break;
        case "/quit":
            rl.close();
            return;
        case "/join":
            if (rest) {
                console.log("Connecting to #%s ", rest)
                channel = slack.getChannelGroupOrDMByName(rest);
                if(channel)
                    slack.joinChannel(rest);
                else
                    console.log("This channel does not exist.")
            }
            else {
                console.log("Need a channel name to join");
            }
            break;
        case "/leave":
            if (rest) {
                channel = slack.getChannelGroupOrDMByName(rest);
                if (!channel) {
                    console.log("Could not find channel '%s'", rest);
                }
                else {
                    channel.leave();
                }
            }
            else {
                console.log("Need a channel name to leave");
            }
            break;
        case "/check":
            if(rest) {
                jarvis.analyze(rest)
            }
            break;
        case "/server":
            console.log(serverController.find(rest))
            break;
        case "/help":
            console.log('Commands:');
            console.log('/msg channel text');
            console.log('/join channel');
            console.log('/leave channel');
            console.log('/quit');
            break;
        case "/actions":
            console.log(Object.keys(jarvis.actions))
            break;
        default:
            console.log("Sorry, what? Try /help");
    }
    rl.setPrompt('> ', 2);
    return rl.prompt();
});

function bakchodi(message)
{
    re = /(didi)/i
    m = message.text.match(re)

    if(m)
        return [true, "<@U039UMNAG>, <@" + message.user + "> is calling you!"]

    re = /(bogo)/i
    m = message.text.match(re)

    if(m)
        return [true, "<@U039T43PK>, <@" + message.user + "> is calling you!"]

    return [false]
}
function recognizeMessage(message)
{
    re = /(.*?)(\@U039RTUTQ)(.*)/;
    m = message.match(re);

    if(m)
        if(m[2])
            if(m[2] == "@U039RTUTQ")
                return ["mentionJarvis"];

    var re = /\<\@\b(.*)\>/;
    var m = message.match(re);

    if(m)
        if(m[1])
            return ["mention", m[1]];

    re = /(.*?)(has joined the channel)(.*)/;
    m = message.match(re)

    if(m)
        if(m[2])
            if(m[2] == "has joined the channel")
                return null;

    re = /(.*?)(who is this\?|who are you\?)(.*)/
    m = message.match(re)

    if(m)
        if(m[2])
            if(m[2] == "who is this?" || m[2] == "who are you?")
                return ["whoami"];

    re = /(.*?)(git pull on)(.*?)/
    m = message.match(re)

    if(m)
        if(m[2])
            if(m[2] == "git pull on")
                return ["pullRequest"];

    re = /^(which branch is (staging(\d)|staging) on\?)/
    m = message.match(re)

    if(m)
        if(m[2])
            if(m[2] == "staging") {
                if(m[3])
                    return ["stagingBranchRequest", m[3]]
                else
                    return ["stagingBrnachRequest"]
            }
}

/*app.get("/", function(req, res){
    res.send("It works!");
});

app.listen(port);
console.log("Listening on port " + port);*/

jarvis.wakeup()
