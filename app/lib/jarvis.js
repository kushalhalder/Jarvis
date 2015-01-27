var Jarvis = {}

Jarvis.memory = {
	tasks: [],
	context: "Jarvis"
}

// long term memory
Jarvis.lexicon = require("../brain/lexicon")

// linguistics module
Jarvis.language = require("../brain/language")

// actions that Jarvis can do
Jarvis.actions = require("../actions")

// adds the decision making module
Jarvis.analyze = function(data) {
	var lang = require("../brain/language")

	// let's filter the ownership
    switch(a.owner) {
        
        // Reverse user possession
    case "speaker":
        a.owner = "user";
        break;
        
        // Reverse nodebot possession
    case "listener":
        a.owner = "nodebot";
        break;
        
        // Tweak other non-specific possession cases to the last
        // recorded context
    case "it": case "its": case "they": case "their":
    case "he": case "she": case "his": case "hers":
        a.owner = this.memory.context;
        break;
    }

    // If there is no action, but the owner is the user or the robot, it
    // is a relabeling
    
    if (!a.action || (!a.owner && a.subject === "")) {
        this.say("I'm not sure what you are asking me to do, please clarify");
        return this.request();
    }
    
    // Now, let's also figure out the best action to take based upon
    // what the nodebot can actually do
    var action = lang.closest(a.action, Object.keys(this.actions));
    
    // Unless we are repeating the action, store it for later recollection
    if (action !== "repeat") {
        this.memory.tasks.push(data);
        this.memory.context = a.ownership;
    } 
    
    return this.actions[action].apply(this, [a]); 
}

Jarvis.say = function(message) {
	console.log("Jarvis says: %s", message)
}

module.exports = Jarvis