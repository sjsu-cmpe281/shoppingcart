/* CMPE 281: Team Project */

var http = require("http");

var server = http.createServer(function(request, response) {
 if (request.method === "GET") {
      if (request.url === "/mongo") {
         console.log("[INFO] : mongo GET request");
      } else if (request.url === "/riak") {
         console.log("[INFO} : riak GET request");
      } else {
         console.log("[ERROR]: Unknown GET request");
      }
 } else if (request.method === "POST") {
      if (request.url === "/mongo") {
         console.log("[INFO] : mongo POST request");
      } else if (request.url === "/riak") {
         console.log("[INFO} : riak POST request");
      } else {
         console.log("[ERROR]: Unknown POST request");
      }
 }

 response.writeHead(200, {"Content-Type": "application/json"});
  
 var respStr = "{'key' : 'value'}";

 response.write(respStr);
 response.end();
 });

server.listen(8081);
console.log("Server Started");
