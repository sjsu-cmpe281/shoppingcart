/**
 * http://usejsdoc.org/

 *
 */

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://localhost:27017/db_login";


exports.signup = function(req, res){
  res.render('signup', { title: 'Signup/Login' });
};



exports.saveDetails = function(req, res){
	
	
	var details = {
			fname : req.body.fname,
			lname : req.body.lname,
			email : req.body.email,
			password : req.body.password,
		};
	
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userlogin');

		coll.insert(details,(function(err, user){
			if (user) {
				
				
			
				console.log("Details saved successfully  ");
				
				res.redirect('/signup');
				//res.send(json_responses);

			} else {
				console.log("returned false");
				res.redirect('/signup');
			}
		}));
	});
  
	};
