var http = require('http');
var request = require('request')


exports.ping = function (callback1) {
var options = {
  "host": "127.0.0.1",
  "path": "/ping",
  "port": "8098",
  "method": "GET",
  //"headers": { 
  //  "Content-Type" : "application/json",
  //}
}
callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    if(str!="OK")
    	throw err;
    callback1();
  });
}
http.request(options, callback).end()


}


exports.test = function()
{
	return "Sarat"
}


exports.post = function(cartobj,user,callback1){

var options = {
  "host": "127.0.0.1",
  "path": "/buckets/shoppingcart/keys/" + user,
  "port": "8098",
  "method": "PUT",
  "headers": { 
    "Content-Type" : "application/json",
  }
}
console.log(options)

callback = function(response) {
  var str = ''
  response.on('data', function(chunk){
    str += chunk
  })

  response.on('end', function(){
    if(str!="200OK")
    	throw err;
    callback1();
  })
}

var body = JSON.stringify({
  itemids: cartobj.itemsids,
  cartid: cartobj.cartid,
  quantity: cartobj.quantity
  user: user
});
http.request(options, callback).end(body);
}