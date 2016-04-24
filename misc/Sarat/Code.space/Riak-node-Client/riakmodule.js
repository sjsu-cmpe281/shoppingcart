var Riak = require('riak-js');
var nodes = ['127.0.0.1:8098'];
var db = require('riak-js').getClient(nodes)

var client = new Riak.Client(nodes, function (err, c) {
    // NB: at this point the client is fully initialized, and
    // 'client' and 'c' are the same object
db.save('flights', 'KLM-5034', flight, { returnbody: true, dw: 'quorum', method: 'POST' })
//POST
db.get('flights', 'KLM-5034', { headers: { Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==' } })
//GET

db.count('airlines')
//count

db.remove('airlines', 'KLM')
//remove

db.mapreduce.add('flights').map('Riak.mapValuesJson').run()
//mapreduce

db.saveBucket('airlines', {n_val: 8, allow_mult: true})
//updatebucket



//Sample data for get and read
});