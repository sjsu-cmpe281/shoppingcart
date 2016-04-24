
 var mongod = require('mongodb');
 var mongoc = mongod.MongoClient;
 var conn_string = 'mongodb://localhost:27017/cmpe281';

 var findProducts = function(db, callback) {
        var list = db.collection('products').find(queryString);
        list.each(function(err, results) {
            if(err) throw err;

            if(results == null) {
               callback();
            } else {
               console.dir(results);
            }

        });
 };


 module.exports = function queryHandler (queryString) {
     mongoc.connect(conn_string, function(err, db) {
	if (err) {
           console.log("[ERROR]: Could not connect to MongoDB server");
           console.log("[ERROR]: "+err);
        }				

        console.log("[INFO] : Successfully connected to MongoDB server");
        findProducts(db, function() {
           db.close();
        });             
     }); 
 }

 
