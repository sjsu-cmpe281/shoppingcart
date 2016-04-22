/**
 * http://usejsdoc.org/
 */
//exports.women = function(req, res){
//  res.render('women', { title: 'Guess Bags' });
//};

var Client = require('node-rest-client').Client;
var http = require('http') ;
var count = "";
var endpoint = "http://ec2-52-38-120-224.us-west-2.compute.amazonaws.com:8080/GrailsGumballMachineVer2-2.2/gumballs/1" ;  //grails gumball machine ver2 

exports.women = function(req, res){

    var client = new Client();
            client.get( endpoint, function(data, response_raw){
            	if(response_raw) {
              //  console.log(data[0].id) ;
               // console.log(data[0].countGumballs) ;
               // console.log(data[0].modelNumber) ;
               // console.log(data[0].serialNumber) ;
              //  count = data[0].countGumballs
              //  console.log( "count = " + count ) ;
               // res.end( "count = " + count + "\n");
            	json_responses = {"statusCode" : 200};
            	var jsonString = JSON.stringify(response_raw);
				var jsonParse = JSON.parse(jsonString);
				//json_responses.tweets = jsonParse;
				console.log(jsonParse);
				json_re.r=jsonParse;
                res.render('women', { data: json_re });
            	} else {
    				console.log("returned false");
    				json_responses = {"statusCode" : 401};
    				res.send(json_responses);
    			}
            	 });
}
