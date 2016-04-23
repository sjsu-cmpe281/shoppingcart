

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');


//URL for the sessions collections in mongoDB
var dbURL = "mongodb://localhost:27017/db_bag";
var mongo = require("./routes/mongo");
var login = require("./routes/login");
var men = require("./routes/men");



var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//GET Requests
app.get('/', routes.index);
app.get('/men', function(req,res){
	res.render('men.ejs')
})

//app.get('/users', user.list);
//app.get('/homepage',login.redirectToHomepage);

//POST Requests
app.post('/allMen', men.allMen);
//app.post('/checklogin', login.checkLogin);
//app.post('/logout', login.logout);

//connect to the mongo collection session and then createServer
mongo.connect(dbURL, function(){
	console.log('Connected to mongo at: ' + dbURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Server listening on port ' + app.get('port'));
	});  
});