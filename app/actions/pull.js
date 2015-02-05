// Server Pull
// "Pull logos on <country>"

var lang = require("../brain/language"),
    Connection = require("../lib/ssh_connection")

module.exports = function pull(a) {
    var jarvis = this,
        country = a.subject,
        tokens = a.tokens,
        nouns = a.nouns

    // determine the repo
    var index = nouns.indexOf(country)

    if (index > -1) {
        nouns.splice(index, 1);
    }
    conn = new Connection()
    // perform a synchronous pull
    if(nouns.length > 1)
        jarvis.say("Synchronously pulling on all the repos.")
    for (var i = nouns.length - 1; i >= 0; i--) {
        var repo = nouns[i]
        jarvis.say("Pulling on " + repo)
        conn.pull_request(jarvis.channel, repo, country)
    }

    return
}
