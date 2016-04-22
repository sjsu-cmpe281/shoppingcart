/**
 * http://usejsdoc.org/

 *
 */
var ejs= require("ejs");
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://localhost:27017/db_bag";
var json_re={user:"kalyani"};
exports.womendata = function(req, res){
	
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bags');

		coll.find().toArray(function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.email;
				//console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200};
				
				var jsonString = JSON.stringify(user);
				var jsonParse = JSON.parse(jsonString);
				//json_responses.tweets = jsonParse;
				console.log(jsonParse);
				json_re.r=jsonParse;
				
	
			
				console.log("connected to db  ");
				/*
				ejs.renderFile('./views/login.ejs', {data: json_re},function(err, result){
					if(!err){
						res.end(result);
					}
					else{
						res.end("error occurred");
						console.log(err);
					}
				}); */
				res.render('womendata', {data1: json_re});
				//res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
  
};