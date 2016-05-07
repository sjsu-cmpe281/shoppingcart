/* AUTHOR : RAKESH DATTA     */
/* APRIL 2016                */
/* SAN JOSE STATE UNIVERSITY */

var http = require("http");
var url  = require("url");
var port = "8090";

var mongomodule = require("./mongomodule.js");
var mongoshp = require("./mongoshp.js");

var server = http.createServer(function(request, response) {
      var err = '0';
      var msgbody = [];

      /*request.on('error', function(err) {
         console.error(err);
      }).on('data', function(chunk) {
         console.log("chunk="+chunk);
         msgbody.push(chunk);
      }).on('end', function() {
         msgbody = Buffer.concat(msgbody).toString();
      });*/

      var urlMembers    = url.parse(request.url, true);
      var query_params = urlMembers.query;
      //var query_params = urlMembers.query.gender;
      var pathname     = urlMembers.pathname;
      //console.log("gender: "+query_params.gender);
      console.log("pathname: "+pathname);
      //console.log("item_code: "+query_params.id);
      //console.log("available_count: "+query_params.count);

      if (pathname === "/catalog") {
          switch (request.method) {
            case "GET"    :
	          case "POST"   :
	          case "PUT"    :
	          case "DELETE" :
                            console.log("[INFO] : received mongo "+request.method+" request");
                            console.log("[INFO] : received body"+msgbody);
          		    		mongomodule.queryHandler(query_params, 
					             request.method,
						     function(error, respStr){
                                                        if (error == "0") {
                                                            console.log("[INFO] : "+respStr);
                                                            sendHttpResp(response, respStr, error);
                                                        } else {
                                                            console.log("[ERROR]: err msg= "+respStr+", err code= "+error);
                                                            sendHttpResp(response, respStr, error);
							};
						     });
			     break;
          
            default       :
                            console.log("[ERROR]: received unknown method type");
                            err = '405';
          		    break;
	       }

      } else if (pathname === "/shopcart") {
          switch (request.method) {
          case "GET"    :   console.log("[INFO] : received mongoshp GET "+request.method+" request");
                            console.log("[INFO] : received mongoshp body GET "+msgbody);
                            mongoshp.queryHandler(query_params,request.method,function(error, respStr){
                                                        if (error == "0") {
                                                            console.log("[INFO] : "+respStr);
                                                            sendHttpResp(response, respStr, error);
                                                        } else {
                                                            console.log("[ERROR]: err msg= "+respStr+", err code= "+error);
                                                            sendHttpResp(response, respStr, error);
                                                        };
                            });
                            break;
	    	  case "POST"   :  request.on('error', function(err) {
                           console.error(err);
                           }).on('data', function(chunk) {
                           console.log("chunk="+chunk);
                           msgbody.push(chunk);
                           
                           
                           }).on('end', function() {
                           msgbody = Buffer.concat(msgbody).toString();
                           //var jsonpar = JSON.parse(msgbody)
                           var sarat = JSON.parse(msgbody);
                           console.log("[INFO] : received mongoshp POST "+request.method+" request");
                           console.log("[INFO] : received mongoshp body POST "+msgbody);
                           var testconsole = console.log(sarat)
                           console.log(testconsole)
                           mongoshp.queryHandler(sarat,request.method,function(error, respStr){
                                                        if (error == "0") {
                                                            console.log("[INFO] : "+respStr);
                                                            sendHttpResp(response, respStr, error);
                                                        } else {
                                                            console.log("[ERROR]: err msg= "+respStr+", err code= "+error);
                                                            sendHttpResp(response, respStr, error);
                           };
                           });
                           
                           }); 
                           break;
                          
	    	  case "PUT"    :  request.on('error', function(err) {
                           console.error(err);
                           }).on('data', function(chunk) {
                           console.log("chunk="+chunk);
                           msgbody.push(chunk);
                           
                           
                           }).on('end', function() {
                           msgbody = Buffer.concat(msgbody).toString();

                           console.log("[INFO] : received mongoshp PUT "+request.method+" request");
                           console.log("[INFO] : received mongoshp body PUT "+msgbody);
                           mongoshp.queryHandler(msgbody,request.method,function(error, respStr){
                                                        if (error == "0") {
                                                            console.log("[INFO] : "+respStr);
                                                            sendHttpResp(response, respStr, error);
                                                        } else {
                                                            console.log("[ERROR]: err msg= "+respStr+", err code= "+error);
                                                            sendHttpResp(response, respStr, error);
                           };
                           });
                           
                           });
                           break;
	    	  case "DELETE" :  break;

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
  console.log("[INFO] response" +response)
  console.log("[INFO] respStr" +respStr)
  console.log("[INFO] err " +err)
  switch (err) {
   case "0"   : response.writeHead(200, {"Content-Type": "application/json"});
                //var resp = "{'key' : 'value'}";
                response.write(respStr);
                response.end();
                break;

   case "400" : response.writeHead(400, {"Content-Type": "application/json"});
                //var resp = "{'error' : 'url is incorrect'}";
                response.write("'error':'"+respStr+"'");
                response.end();
                break;

   case "405" : response.writeHead(405, {"Content-Type": "application/json"});
                //var resp = "{'error' : 'REST method type not allowed'}";
                response.write(respStr);
                response.end();
                break;

   default    : response.writeHead(503, {"Content-Type": "application/json"});
                //var resp = "{'error' : 'Server is unavailable'}";
                response.write(respStr);
                response.end();
                break;
 }

};

server.listen(port);
console.log("My Server Started in port "+port);
