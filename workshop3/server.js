var express = require('express');

var connect = require('connect');
// Custom csrf library
// var csrf = require('./csrf');

var app = express.createServer();

// An array of users who are already registered and can log in.
var users = [
  { username: 'herp', password: 'derp' },
  { username: 'foo', password: 'bar' },
  { username: 'turd', password: 'burgler' }
]

var allowCrossDomain = function(req, res, next) {
  // Added other domains you want the server to give access to
  // WARNING - Be careful with what origins you give access to
  var allowedHost = [
    'http://localhost',
    'http://localhost:4567',
  ];
  // chrome-extension line is the origin header from POSTman chrome extension
  // console.log("Headers: ", req.headers, "\n")
  console.log("----------------------------")
  console.log("Origin: ", req.headers.origin)
  console.log("Session: ", req.session)
  
  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  } else {
    console.log("Failed the CORS origin test: ", req.session.username)
    res.send(401, {auth: false});
  }
}

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-secret-secretive-key-session' }));
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
    // app.use(csrf.check);
});

app.get('/users/current', function(req, res){
  console.log("GET users/current")

  // This checks the current users auth
  // It runs before Backbones router is started
  // we should return a csrf token for Backbone to use

  if(typeof req.session.username !== 'undefined'){
    console.log("Verified logged in: ", req.session.username)
    res.send({auth: true, id: req.session.id, username: req.session.username});
    // res.send({auth: true, id: req.session.id, username: req.session.username, _csrf: req.session._csrf});
  } else {
    res.send(401, {auth: false});
    // res.send(401, {auth: false, _csrf: req.session._csrf});
  }
});

app.post('/session', function(req, res){
  console.log("POST session")

  // Login
  // Here you would pull down your user credentials and match them up
  // to the request

  var foundUser = undefined
  for (var i=0;i<users.length;i++) {
    var u = users[i];
    if (u.username == req.body.username && u.password == req.body.password) {
      foundUser = u.username
    }      
  }

  if (foundUser !== undefined) {
    req.session.username = req.body.username;
    console.log("Login succeeded: ", req.session.username)
    res.send({auth: true, id: req.session.id, username: req.session.username});
  } else {
    console.log("Login failed: ", req.body.username)
    res.send(401, {status:401, message: {auth:false}});
  }

});

app.del('/session', function(req, res, next){
  console.log("DELETE session")
  console.log("Logout: ", req.session.username)

  // Logout by clearing the session
  req.session.regenerate(function(err){
    // Generate a new csrf token so the user can login again
    // This is pretty hacky, connect.csrf isn't built for rest
    // I will probably release a restful csrf module
    // csrf.generate(req, res, function () {
      res.send({auth: false, _csrf: req.session._csrf});
    // });
  });
});

console.log("Listening on port 8000...")
app.listen(8000);
