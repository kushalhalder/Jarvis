var Jarvis = {}

// short term memory
Jarvis.memory = {
	tasks: [],
	context: "jarvis",
    answers: []
}

// slack object
Jarvis.slack = null
// long term memory
Jarvis.lexicon = require("../brain/lexicon")

// linguistics module
Jarvis.language = require("../brain/language")

// actions that Jarvis can do
Jarvis.actions = require("../actions")

// start jarvis
Jarvis.wakeup = function() {
    this.slack.login()
}

// check when jarvis has been called
Jarvis.called = function(message) {
    re = /(.*?)(ok jarvis)(.*)/;
    m = message.match(re);

    if(m)
        if(m[2])
            if(m[2] == "ok jarvis")
                return true;
    return false;
}

// adds the decision making module
Jarvis.analyze = function(data) {
    // check the memory for repeats

	var lang = require("../brain/language")

    var a = lang.classify(data)
    // let's filter the ownership
    switch(a.owner) {

        // Reverse user possession
        case "speaker":
            a.owner = "user"
            break

        // Reverse nodebot possession
        case "listener":
            a.owner = "jarvis"
            break

        // Tweak other non-specific possession cases to the last
        // recorded context
        case "it": case "its": case "they": case "their":
        case "he": case "she": case "his": case "hers":
        break;
        /*default:
            a.owner = ""
            break*/
    }
    console.log(a)

    // If there is no action, but the owner is the user or the robot, it
    // is a relabeling

    if (!a.action || (!a.owner && a.subject === "")) {
        this.say("I'm not sure what you are asking me to do, please clarify")
        return
    }

    // Now, let's also figure out the best action to take based upon
    // what jarvis can actually do
    var action = lang.closest(a.action, Object.keys(this.actions))

    // Unless we are repeating the action, store it for later recollection
    if (action !== "repeat") {
        this.memory.tasks.push(data)
        this.memory.context = a.owner
    }

    return this.actions[action].apply(this, [a])
}

Jarvis.repeat = function() {

}

Jarvis.ask = function(question, callback) {
    var jarvis = this
    jarvis.say(question)
    // wait for the reply
    jarvis.slack.on("message", function(message) {
        callback(message.text)
    })
    return
}

Jarvis.say = function(message) {
    if(this.channel)
        this.channel.send("" + message)
	console.log("Jarvis said: %s", message)
}

Jarvis.getMessage = function(text, callback) {
    var refinedText = text.replace("ok jarvis,", '').replace("ok jarvis", '').trim()
    callback(refinedText)
}

Jarvis.reply = function(message) {
    var type = message.type,
        channel = this.slack.getChannelGroupOrDMByID(message.channel),
        user = this.slack.getUserByID(message.user),
        time = message.ts,
        text = message.text,
        jarvis = this

    console.log('Received: %s %s %s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user ? "@"+user.name : '', time, text);
    if(type === "message")
    {
        if(text)
        {


            /*if(channel.is_channel) {
                channelController.updateChannel(message.channel, channel.name)
                messageController.save(text, message.channel, message.user, s)
            }*/
            if (text.trim() == "didi") {
                channel.send("<@U039UMNAG>, <@" + message.user + "> is calling you!")
            }
            if(jarvis.called(text))
            {
                jarvis.message = message
                jarvis.channel = channel
                jarvis.getMessage(text, function(text) {
                    jarvis.analyze(text)
                })
            }
            /*else
                respond(slack, channel, user, text)*/
        }
    }
}

Jarvis.watchDB = function(slack, mongoUrl, collName, channelName) {
    var mongoPubSub = require("./mongonotif"),
        mongo = require("mongodb"),
        otherChannel = slack.getChannelGroupOrDMByName(channelName)

    mongo.MongoClient.connect(mongoUrl, function(err, db) {
        mongoPubSub.connect(db, collName, otherChannel)
    })

}

module.exports = Jarvis
