// What.js
// "What is your name?",
// "What is the capital of Spain?"
// -------------------------------------------------- //

var lang       = require("../brain/language"),
    request    = require("request"),
    format     = require("../brain/formatter")


module.exports = function what (a) {

    if (a.owner === a.subject) a.subject = "definition";

    var jarvis   = this,
        owner     = a.owner,
        subject   = a.subject || "definition",
        base      = (owner) ? jarvis.lexicon[owner] : jarvis.lexicon,
        term      = (subject && base) ? base[subject] : undefined

    // Just some more bullet proofing for the subject
    subject = (owner === subject) ? "definition" : subject

    // If the term is a function, call it to determin the value
    if (typeof term === "function") term = term().toString();

    // Do we have a definition for this subject?
    // -------------------------------------------------- //

    if (term) {

        switch (subject) {
            case "definition":
                jarvis.say(lang.capitalize(owner) + " is " + term);
                break;
            default:
                jarvis.say(lang.possessify(lang.capitalize(owner)) + " " + subject + " is " + term.toString());
            }
        return
    }

    // No, search WolframAlpha
    var wolframClient = require("../lib/wolfram"),
        query = a.tokens.join(" ")

    //wolframClient.query(query, jarvis)
};
