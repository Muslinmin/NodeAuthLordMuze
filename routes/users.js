var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
const { check, validationResult } = require('express-validator');

var User = require('../models/user');
var passport = require('passport');
var LocalSrategy = require('passport-local').Strategy;

//middleware function declaration
function errorRepackage(errorObject){
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors)=>{
    errorPackage.push(errors.msg);
  });
  return {errors: errorPackage};
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',  {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in!');
    res.redirect('/');
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalSrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err){
      throw err;
    }
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err){
        return done(err);
      }
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false, {message: 'Invalid Password'});
      }
    })
  });
}));



router.post('/register', upload.single('profileimage'),[check('name').isLength({ min: 1 }).withMessage("Name Required"),
check('email').isEmail().withMessage("Email required"),
 check('username').isLength({min: 1}).withMessage("Username Required"),
check('password').isLength({min: 1}).withMessage("Password Required")
],function(req, res, next) {



  if(req.file){
    console.log('Uploading File....');
    var profileimage = req.file.filename;
  }else{
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }



  //Check Errors
  const errors = validationResult(req);
  if(!(req.body.password2.match(req.body.password))){
    console.log("Error Password don't match");
  }else if (!errors.isEmpty()) {
    return res.render('register', errorRepackage(errors));
  }else{
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      profileimage: req.body.profileimage
    });
    User.createUser(newUser, function(err, user){
      if(err){
        throw err;
        console.log(user);
      }
      req.flash('success', 'You are now registered and can login!');
      res.location('/');
      res.redirect('/');
    });
  }


});


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/users/login');
});

module.exports = router;
