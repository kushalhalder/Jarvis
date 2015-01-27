// What.js
// "What is your name?", 
// "What is the capital of Spain?"
// -------------------------------------------------- //

var lang       = require("../brain/language"),   
    request    = require("request"),   
    format     = require("../brain/formatter")


module.exports = function what (a) {

    if (a.owner === a.subject) a.subject = "definition";

    var jarvis   = this
    ,   owner     = a.owner
    ,   subject   = a.subject || "definition"

    ,   base      = (owner) ? jarvis.lexicon[owner] : jarvis.lexicon
    ,   term      = (subject && base) ? base[subject] : undefined
    ;
    
    // Just some more bullet proofing for the subject
    subject = (owner === subject) ? "definition" : subject;

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
    // 
    // For more information visit:
    // http://www.wolframalpha.com/termsofuse.html#attributionandlicensing
    // -------------------------------------------------- //

    var app_id = "PQ5RE9-79H3KEYL6V";

    var qs = require('querystring')
    ,   sax    = require("sax")
    ,   strict = true
    ,   parser = sax.parser(strict)
    ,   request = require("request")
    ,   data = qs.stringify({ input: a.tokens.join(" ") })
    ;

    jarvis.say("Hmm, I don't know off the top of my head. Let me ask around...");

    var Client = require('node-wolfram');
    var Wolfram = new Client(app_id);
    Wolfram.query(a.tokens.join(" "), function(err, result) {

        if(err)
            console.log(err);
        else
        {
            if(!result.queryresult.pod)
            {
                jarvis.say("Sorry! Couldn't find anything :sad:")
                return
            }

            // commence sending message
            jarvis.say("*Here is what I found...*")
            
            var message = "```"
            
            for(var a=0; a<result.queryresult.pod.length; a++)
            {
                var pod = result.queryresult.pod[a];
                message += pod.$.title + ": "
                for(var b=0; b<pod.subpod.length; b++)
                {
                    var subpod = pod.subpod[b];
                    for(var c=0; c<subpod.plaintext.length; c++)
                    {
                        var text = subpod.plaintext[c];
                        message += text
                    }
                }

                message += "\n"
            }

            jarvis.say(message + "```")
        }
    });

};
