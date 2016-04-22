/**
 * http://usejsdoc.org/

 *
 */
var ejs= require("ejs");
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://localhost:27017/db_login";

exports.login = function(req, res){
	
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('usercollection');

		coll.find({username: "testuser1"}).toArray(function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.email;
				//console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200};
				var jsonString=JSON.stringify(user);
				var json_parsed=JSON.parse(jsonString);
				//ar json_responses.user=user;
				console.log("connected to db  "+user[0].username);
				/*
				ejs.renderFile('./views/login.ejs', {data: user},function(err, result){
					if(!err){
						res.end(result);
					}
					else{
						res.end("error occured");
						consol.log(err);
					}
				}); */
				res.render('login', {data: user});
				//res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
  
};