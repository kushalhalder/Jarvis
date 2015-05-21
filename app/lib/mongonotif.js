var notifsid = require("../controllers/notifsid.js"),
    MongoNotif = {}

MongoNotif.connect = function (db, collName, channel) {
    var self = this
    console.log("Attempting to connect to %s", collName)

    db.collection(collName, function (err, collection) {
        collection.isCapped(function (err, capped) {
            if (err) {
                console.log ("Error when detecting capped collection.  Aborting.  Capped collections are necessary for tailed cursors.")
            }
            if (!capped) {
                console.log (collection.collectionName + " is not a capped collection. Aborting.  Please use a capped collection for tailable cursors.")
            }
            console.log ("Success connecting to %s", collName)
            //self.readAndSend(channel, collection)
            self.listen(collection, function(data){
                //var response = "Just wanted to inform that *" +collName+ "* is failing. The exception from the server says *" + data._id + "*"
                var response = data._id
                //notifsid.updateColl(data._id, collName);
                console.log(response)
                channel.send(response)
            })
        });
    });
}

MongoNotif.listen = function(coll, callback) {
    console.log("Started listening to logs")
    //coll = db.collection(collName)
    conditions = {}
    latestCursor = coll.find(conditions).sort({$natural: -1}).limit(1)
    latestCursor.nextObject(function(err, latest) {
        if (latest) {
            conditions._id = {$gt: latest._id}
        }
        options = {
            tailable: true,
            await_data: true,
            numberOfRetries: -1
        }
        stream = coll.find(conditions, options).stream()
        stream.on('data', callback)
    })
}

module.exports = MongoNotif
