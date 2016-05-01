/**
 * http://usejsdoc.org/
 */
//exports.women = function(req, res){
//  res.render('women', { title: 'Guess Bags' });
//};

var Client = require('node-rest-client').Client;
var http = require('http') ;
var count = "";
var endpoint = "http://ec2-52-37-110-49.us-west-2.compute.amazonaws.com:8080/GrailsGumballMachineVer2-2.2/gumballs" ;


exports.women = function(req, res){

    var client = new Client();
  //  var datf = "error";
            client.get( endpoint, function(data, response_raw){
            	if(response_raw) {
  
            		//console.log(response_raw);
            		console.log(data[0].countGumballs) ;
                    console.log(data[0].modelNumber) ;
                    console.log(data[0].serialNumber) ;
                    count = data[0].countGumballs
                    console.log( "count = " + count ) ;
                    //res.end( "count = " + count + "\n");
                    
                    res.render('women', { data: data });
            	} 
            	
            	else {
    				console.log("returned false");
  //  				res.render('/womenerr');
            	}
            	 });
}


