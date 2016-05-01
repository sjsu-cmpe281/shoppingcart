/**
 * http://usejsdoc.org/
 */
exports.register = function(req, res){
  res.render('register', { title: 'Login/Register' });
};