/* CMPE 281: Team Project */

var http = require("http");
var port = "8090";

var mongomodule = require("./mongomodule.js");

var server = http.createServer(function(request, response) {
      var err = '0';
      var msgbody = [];

      request.on('error', function(err) {
         console.error(err);
      }).on('data', function(chunk) {
         msgbody.push(chunk);
      }).on('end', function() {
         msgbody = Buffer.concat(msgbody).toString();
      });

      if (request.url === "/catalog") {
          switch (request.method) {
            case "GET"    :
	    case "POST"   :
	    case "PUT"    :
	    case "DELETE" :
                            console.log("[INFO] : received mongo "+request.method+" request");
          		    mongomodule.queryHandler(msgbody, 
					             request.method,
						     function(respStr){
                                                        console.log("[INFO] : "+respStr);
                                                        sendHttpResp(response, respStr, err);
						     });
			    break;
          
            default       :
                            console.log("[ERROR]: received unknown method type");
                            err = '405';
          		    break;
	  }

      } else if (request.url === "/shopcart") {
          switch (request.method) {
            case "GET"    :
                            console.log("[INFO] : received riak GET request");
          		    break;
          
	    case "POST"   :
                            console.log("[INFO] : received riak POST request");
          		    break;

	    case "PUT"    :
                            console.log("[INFO] : received riak PUT request");
          		    break;

	    case "DELETE" :
                            console.log("[INFO] : received riak DELETE request");
          		    break;

            default       :
                            console.log("[ERROR]: received unknown method type");
			    err = '405';
          		    break;
	  }
      } else {
         console.log("[ERROR]: Unknown Url");
         err = '400';
      }
});

function sendHttpResp(response, respStr, err){
  //console.log("RAKESH:"+respStr+" END");
  switch (err) {
   case "0"   : response.writeHead(200, {"Content-Type": "application/json"});
                //var resp = "{'key' : 'value'}";
                response.write(respStr);
                response.end();
                break;

   case "400" : response.writeHead(400, {"Content-Type": "application/json"});
                var resp = "{'error' : 'url is incorrect'}";
                response.write(respStr);
                response.end();
                break;

   case "405" : response.writeHead(405, {"Content-Type": "application/json"});
                var resp = "{'error' : 'REST method type not allowed'}";
                response.write(respStr);
                response.end();
                break;

   default    : response.writeHead(503, {"Content-Type": "application/json"});
                var resp = "{'error' : 'Server is unavailable'}";
                response.write(respStr);
                response.end();
                break;
 }

};

server.listen(port);
console.log("My Server Started in port "+port);
