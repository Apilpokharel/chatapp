
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
const User = require('../schema/UserSchema');



exports.signupPage = (req, res, next)=>{
let user = new User();
 res.render('register',{body: user, flash: null});
};


exports.signupPost = async (req, res, next)=>{
  try{
  
    console.log('next clicked');
 let user = new User(req.body); 
 user.profileimg = 'images.png';
 
 const token = await user.generateAuthToken();

 res.cookie('x-auth', token, {maxAge: 1000*60*60*24*30, httpOnly: true});

 res.redirect('/');
  }catch(err){
    
  }
};




exports.validateSignup = (req, res, next)=>{
  try{
 req.sanitizeBody('username');
 req.checkBody('username', 'You must supply a name!').notEmpty();
 req.checkBody('email', 'Email entered is not valid').isEmail();
 req.sanitizeBody('email').normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
 });
 req.checkBody('phone', 'phone is a reqired').isLength({min: 3});
 req.checkBody('password', 'password cannot be empty or less than 6 charadter').isLength({min:6});
 req.checkBody('confirm_password', 'your password didnot matched').equals(req.body.password);

 const errors = req.validationErrors();
 if(errors){
  //  req.flash('errors', errors.map(err=> err.msg));
  let error = errors.map(err=> err.msg);
 
   res.render('register',{body: req.body, flash: error, tittle: 'Register'});
 }
else{
 next();
}
} catch(err){
  console.log(err);
}
};





exports.loginPage = (req, res, next)=>{
  
  res.render('login', { emailerr: null, passerr: null, email: null});
};





exports.loginPost = async (req, res, next)=>{
  try{
   
   const email = req.body.email.trim();
   const password = req.body.password.trim();
   const user = await User.findOne({'email':email});

   if(!user){
    res.render('login',{emailerr: 'invalid email'});
   }
    
   else{

    var pm = null;
    await new Promise(function(resolve, reject){
   bcrypt.compare(password, user.password, function(err, res){
       if(res){
        pm = 'matched';
        resolve();
       }
       else{
         pm='error';
         resolve();
       }
   });
  });

  if(pm === 'matched'){
    const token = await user.generateAuthToken();
    res.cookie('x-auth', token,{maxAge: 1000*60*60*24*30, httpOnly: true});
      res.redirect('/');  
  }
  else{
    console.log('pass error');
        res.render('login',{passerr: 'password didnot matched', emailerr: null, email: email});
  }
  }
 
     } catch(err){
       console.log(err);
         res.json({
            result: "failed",
            data:{err},
            message:"failed to login user"
         });
     }
 
};






exports.Authenticate = async (req, res, next)=>{
   try{
    
    const token = req.cookies['x-auth'];
   
   const user = await User.findByToken(token);
   if(user === null){
     res.redirect('/login');
   }
   else{
     
    req.user = user;
    req.token = token;

   next();
   }
   }catch(err){
     res.redirect('/login');
   }
}





exports.logout = async (req, res, next)=>{
  try{
  await req.user.removeToken(req.token);
   res.clearCookie('x-auth');
   res.redirect('/login');
  }catch(err){
    console.log(err);
  }

};