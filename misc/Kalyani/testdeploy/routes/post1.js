/**
 * http://usejsdoc.org/
 */

var Client = require('node-rest-client').Client;
var http = require('http') ;
var count = "";
var endpoint = "http://ec2-52-37-110-49.us-west-2.compute.amazonaws.com:8080/GrailsGumballMachineVer2-2.2/gumballs/1" ;

exports.post1 = function(req, res){
	  res.render('post1', { title: 'POST1' });
	};

exports.saveDetail = function(req, res){

	var args = {
			data: {"id" : req.body.id,
			"countGumballs" : req.body.countGumballs,
			"modelNumber" : req.body.modelNumber,
			"serialNumber" : req.body.serialNumber},
			headers: { "Content-Type": "application/json" }
		};
	
    var client = new Client();
            client.put( endpoint,args, function(data, response_raw){
            	if(response_raw) {
                     console.log(args);
                     console.log(data);
                    res.redirect('/post1');
            	} else {
    				console.log("returned false");
    				  res.redirect('/post1');
            	}
            	 });
}
