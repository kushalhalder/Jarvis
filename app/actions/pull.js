// Server Pull
// "Pull logos on <country>"

var lang = require("../brain/language")

module.exports = function pull(a) {
    var jarvis = this,
        subject = a.subject

    console.log("Asked to pull on %s", subject)
}
