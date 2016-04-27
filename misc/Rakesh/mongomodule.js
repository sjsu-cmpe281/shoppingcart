//Author: Rakesh Datta

 var mongod = require('mongodb');
 var mongoc = mongod.MongoClient;
 var conn_string = 'mongodb://localhost:27017/cmpe281';
 var query_param  = '';
 var response = '';

 var findProd = function(db, callback) {
        if (query_param == "men") {   
           console.log("[INFO] : query param = gender:"+query_param);
           var list = db.collection('catalog').find({"gender":"men"});
        } else if (query_param == "women") {
           console.log("[INFO] : query param = gender:"+query_param);
           var list = db.collection('catalog').find({"gender":"women"});
        } else {
           response = "Invalid query param: "+query_param;
           callback("400",response);
	}
 
        list.each(function(err, results) {
                 if(err) throw err;

                 if(results == null) {
                    callback("0",response);
                 } else {
                    response+=JSON.stringify(results)+",";
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

 module.exports.queryHandler = function (queryParam, methodType, callback) {
     mongoc.connect(conn_string, function(err, db) {
	if (err) {
           console.log("[ERROR]: Could not connect to MongoDB server");
           console.log("[ERROR]: "+err);
        }				

        console.log("[INFO] : Successfully connected to MongoDB server");
        query_param = queryParam;
        response = '';
        console.log("[INFO] : query received");

        switch (methodType){
         case "GET" :     
           	     findProd(db, function(e, r) {
        		console.log("[INFO] : e ="+e);
                     callback(e, r);   
                     db.close();
                     });
                     break;
    
         case "POST":
                     createProdList(db, function(){
                     callback(r);   
                     db.close();
                     });
                     break;
               
         case "PUT":
                     updProdList(db, function(){
                     callback(r);   
                     db.close();
                     });
                     break;
               
         case "DELETE":
                     delProd(db, function(){
                     callback(r);   
                     db.close();
                     });
                     break;
         default   :
                     console.log("ERROR: method type unknown");       
                     db.close();
        }          
     }); 
 }

 
