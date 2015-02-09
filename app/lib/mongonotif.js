var MongoNotif = {}

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
                console.log("Just wanted to inform you guys that memcache is failing. Take some action asap. The exception from the server says *%s*",data.exception)
                //channel.send("Just wanted to inform you guys that memcache is failing. Take some action asap. The exception from the server says *" + data.exception + "*")
            })
        });
    });
}

MongoNotif.listen = function(coll, callback) {
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
        stream = coll.find(conditions, options).sort({$natural: -1}).stream()
        stream.on('data', callback)
    })
}

module.exports = MongoNotif
