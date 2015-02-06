// The Analysis Module
// -------------------------------------------------- //

var util  = require("util")

module.exports = function add_interaction_module(context) {

    var jarvis = Jarvis;

    // Handle Prompts
    // -------------------------------------------------- //

    jarvis.say = function(message) {
        console.log("Jarvis says: %s", message)
    };
};