

database = require('mongodb').Db,
mongo  = require('mongodb').MongoClient,

MyServer = require('mongodb').Server,
ReplSet = require('mongodb').ReplSetServers,

OID = require('mongodb').ObjectID,
Bin = require('mongodb').Binary,

Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON,
assert = require('assert');

var mongoc = new MongoClient(new Server("localhost", 27017), {native_parser: true});

mongoc.open(function(err, mongo) {

var firstdb = mongoc.db("demo test 1");


firstdb.collection('mongo test').update({a:1}, {b:1}, {upsert:true}, function(err, result) {

   var seconddb = mongoclient.db("demo test 2");
   seconddb.collection('mongo test').update({a:1}, {b:1}, {upsert:true}, function(err, result) {

        mongoc.close();
   });
   });
});
