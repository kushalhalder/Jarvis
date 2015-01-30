var Jarvis = {}

// short term memory
Jarvis.memory = {
	tasks: [],
	context: "jarvis"
}

// long term memory
Jarvis.lexicon = require("../brain/lexicon")

// linguistics module
Jarvis.language = require("../brain/language")

// actions that Jarvis can do
Jarvis.actions = require("../actions")

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
    // what the nodebot can actually do
    var action = lang.closest(a.action, Object.keys(this.actions))

    // Unless we are repeating the action, store it for later recollection
    if (action !== "repeat") {
        this.memory.tasks.push(data)
        this.memory.context = a.ownership
    }

    return this.actions[action].apply(this, [a])
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

module.exports = Jarvis
