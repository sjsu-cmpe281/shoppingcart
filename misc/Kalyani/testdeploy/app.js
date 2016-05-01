
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , women = require('./routes/women')
 // , womendata = require('./routes/womendata')
 // , logindata = require('./routes/logindata')
 // , signup = require('./routes/signup')
  , post1 = require('./routes/post1')
 // , cart = require('./routes/cart')
  , register = require('./routes/register')
  , checkout = require('./routes/checkout');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/women',women.women);
//app.get('/womendata',womendata.womendata);
//app.get('/logindata',logindata.logindata);
//app.get('/signup',signup.signup);
app.get('/post1',post1.post1);
//app.get('/cart',cart.cart);
app.get('/register',register.register);
app.get('/checkout',checkout.checkout);
//app.post('/saveDetails',signup.saveDetails);
app.post('/saveDetail',post1.saveDetail);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
