// Who
// -------------------------------------------------- //

var lang = require("../brain/language")

module.exports = function who(a) {

    var jarvis = this,
        owner = a.owner,
        key = a.subject

    // Special instances
    // -------------------------------------------------- //
    switch(owner){

        case "jarvis":

            if (this.lexicon.jarvis[key])
                this.say("My " + key + " is " + this.lexicon.jarvis[key])
            else
                this.say(this.lexicon.jarvis.name + " is " + this.lexicon.jarvis.definition)

            return

        case "user":

            if (this.lexicon.user[key])
                this.say("You are my master, " + this.lexicon.user.name)
            else
                this.say("Hmm... I can't remember, " + this.lexicon.user.name)

            return

        default:
            if(this.lexicon.jarvis[key])
            {
                this.say(this.lexicon.jarvis[key])
                console.log("memory")
            }
            else {
                // Typical cases
                // -------------------------------------------------- //


                    var wolframClient = require("../lib/wolfram"),
                        query = a.tokens.join(" ")

                    wolframClient.query(query, jarvis)
            }
            return
    }



    return jarvis.actions.what.apply(jarvis, [a]);


};
