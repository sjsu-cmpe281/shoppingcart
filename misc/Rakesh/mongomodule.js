
 var mongod = require('mongodb');
 var mongoc = mongod.MongoClient;
 var conn_string = 'mongodb://localhost:27017/cmpe281';
 var query  = ' ';

 var findProd = function(db, callback) {
        var list = db.collection('catalog').find();
        list.each(function(err, results) {
            if(err) throw err;

            if(results == null) {
               callback();
            } else {
               console.dir(results);
            }

        });
 };


 var createProdList = function(db, callback) {
        var list = db.collection('catalog').insertOne(query,
                                                      function(err, result) {
   							console.log("[INFO] : Inserted a record into Product Catalog");
							callback();
					              });		
 };

 var updProdList = function(db, callback) {
        var list = db.collection('catalog').updateOne(query,
                                                      function(err, result) {
   							console.log("[INFO] : Updated a record in Product Catalog");
							callback();
					              });		
 };

 var delProd = function(db, callback) {
        var list = db.collection('catalog').remove(query,
                                                   function(err, result) {
   							console.log("[INFO] : Deleted a record from Product Catalog");
							callback();
					           });		
 };

 module.exports.queryHandler = function (queryString, methodType) {
     mongoc.connect(conn_string, function(err, db) {
	if (err) {
           console.log("[ERROR]: Could not connect to MongoDB server");
           console.log("[ERROR]: "+err);
        }				

        console.log("[INFO] : Successfully connected to MongoDB server");
        query = queryString;
        console.log("[INFO] : Query String = "+query);

        switch (methodType){
         case "GET" :     
           	     findProd(db, function() {
                     db.close();
                     });
                     break;
    
         case "POST":
                     createProdList(db, function(){
                     db.close();
                     });
                     break;
               
         case "PUT":
                     updProdList(db, function(){
                     db.close();
                     });
                     break;
               
         case "DELETE":
                     delProd(db, function(){
                     db.close();
                     });
                     break;
         default   :
                     console.log("ERROR: method type unknown");       
                     db.close();
        }             
     }); 
 }

 
