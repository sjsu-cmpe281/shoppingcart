/* AUTHOR : RAKESH DATTA     */
/* APRIL 2016                */
/* SAN JOSE STATE UNIVERSITY */


 var mongod = require('mongodb');
 var mongoc = mongod.MongoClient;
 var conn_string = 'mongodb://localhost:27017/cmpe281';
 var query_param  = '';
 var response = '';

 var fetchOrder = function(db, callback) {
        response = '';
        if (query_param.user == "admin") {   
           console.log("[INFO] : query param = user:"+query_param.user);
           var list = db.collection('catalog').find({"user":"admin"});
        } else {
           response = "Invalid query param: "+query_param.gender;
           callback("400",response);
	}
 
        list.each(function(err, results) {
                 if(err) throw err;

                 if(results == null) {
                    response="["+response+"]";
                    callback("0",response);
                 } else {
 			if (response === ''){
                          response=JSON.stringify(results);
                    	} else {
                          response+=","+JSON.stringify(results);
                        }
                 }
        });
 };


 var updateCart = function(db, callback) {
        	
 };

 var createCart = function(db, queryParam, callback) {
    
        console.log("[INFO] : New Cart = "+queryParam["user"]);
        console.log("[INFO] : Requested count     = "+queryParam["items"]);
        console.log("[INFO] : State = "+queryParam["state"]);
        
        
        if(query_param.user=="admin")
            try{
                db.shoppingcart.remove({ user : "admin" })
            }
            catch(e)
            {
                console.log("No Cart for admin")
            }
        if(query_param.state=="confirmed")
        {
            try{
                //var list = db.collection('catalog').find({"items":query_param.});
                for(var i in query_param.items) {
                    var val = query_param.items[i];
                    console.log(val.id)
                    var name = "item_code"
                    var query = {};
                    query[name] = val.id;
                    var list = db.catalog.find(query)
                    if(list.avail_count<val.quantity)
                        throw new Error("Requested quantity for " + val.id + "is not available");
                }
                for(var i in query_param.items) {
                var val = query_param.items[i];
                var list = db.collection('catalog').find({"items":val.id})    
                db.collection('catalog').updateOne({"item_code":val.id},
                           {$set: {"avail_count":list.avail_count-val.quantity}}
                          );
                }
                db.collection('shoppingcart').remove({ user : query_param.user })
                db.collection('orders').insertOne({
                user:query_param.user,
                items:query_param.items,
                state:query_param.state
            })
        } catch (e) {
                console.log(e)
                callback("500","Mongo Server Error");
            }
        }    
        else
        {
        try {
            db.collection('shoppingcart').insertOne({
                user:query_param.user,
                items:query_param.items,
                state:query_param.state
            });
      	    console.log("[INFO] : Created a cart record in Shopping Cart");
            callback("0","Record Updated Successfully");
            }catch (e) {
                callback("500","Mongo Server Error");
            }
        }			
 };

 var delProd = function(db, callback) {
        //var list = db.collection('catalog').remove(query,
        //                                           function(err, result) {
   	 //						console.log("[INFO] : Deleted a record from Product Catalog");
//							callback();
//					           });		
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
           	         fetchOrder(db, function(e, r) {
                     callback(e, r);   
                     db.close();
                     });
                     break;
    
         case "POST":
                     createCart(db, queryParam, function(e, r){
                     callback(e, r);   
                     db.close();
                     });
                     break;
               
         case "PUT":
                     updProdList(db, function(e, r){
                     callback(e, r);   
                     db.close();
                     });
                     break;
               
         case "DELETE":
                     delProd(db, function(e, r){
                     callback(e, r);   
                     db.close();
                     });
                     break;
         default   :
                     console.log("ERROR: method type unknown");       
                     db.close();
        }          
     }); 
 }

 
