// Server Pull
// "Pull logos on <country>"

var lang = require("../brain/language")

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

    if(nouns.length > 1)
    {
        console.log("Do you want me to pull on ")
        this.memory.tasks.push(a)
        this.memory.context = a.ownership
    }
    else
    {
        // pull on the repo
        console.log("Asked to pull at repo:%s on country:%s", nouns.join(" "), country)
    }
}
