var config = require("../../assets/config")
var WolframClient = {}

WolframClient.app_id = config.wolfram_app_id

WolframClient.query = function(query, jarvis) {
    jarvis.say("Hmm, I don't know off the top of my head. Let me ask around...")

    var client = require("node-wolfram")
    var wolfram = new client(this.app_id)
    wolfram.query(query, function(err, result) {

        if(err)
            console.log(err)
        else
        {
            if(!result.queryresult.pod)
            {
                jarvis.say("Sorry! Couldn't find anything :sad:")
                return
            }

            // commence sending messages like a human
            jarvis.say("*Here is what I found...*")

            var message = "```"

            for (var i = 0; i < result.queryresult.pod.length; i++) {
                var pod = result.queryresult.pod[i]
                message += pod.$.title + ": "
                for (var j = 0; j < pod.subpod.length; j++) {
                    var subpod = pod.subpod[j]
                    for (var k = 0; k < subpod.plaintext.length; k++) {
                        var text = subpod.plaintext[k]
                        message += text
                    }
                }
                message += "\n"
            }

            jarvis.say(message + "```")
        }
    })
}

module.exports = WolframClient
