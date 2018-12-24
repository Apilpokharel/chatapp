
'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    username: {type:String, trim: true},
    email: {type:String, unique: true, trim: true},
    password: {type:String, trim:true},
    profileimg: {type:String},
    phone:{type: String, trim: true, required: true},
    summed:[mongoose.Schema.Types.ObjectId],
    tokens:[{
        access:{type: String},
        token:{type:String}
    }],
    chatgroups:[String]
});




userSchema.pre('save', function(next){
 try{
  
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt){
            if(err){
              return Promise.reject();
            }
           bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
                return Promise.reject();
              } 

              user.password = hash;
              next();
           });
        })
    }
    else{
        next();
    }
 }catch(err){}
});






userSchema.methods.generateAuthToken = async function(){
    try{
        var user = this;
        const access = 'auth';
        const token = jwt.sign({_id: user._id.toHexString(), access}, 'mysecret');
        user.tokens.push({access, token});
        await user.save();
        
        return await token;

    }catch(err){}
};






userSchema.statics.findByToken = async function(token){
    
    var User = this;
   
 let decoded;
 try{
    decoded = jwt.verify(token, 'mysecret');
 }catch(err){
     console.log('error in decoding');
 }

// console.log('decoded is '+ decoded._id);

 return await User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
});


};





userSchema.statics.findByCredentials = async function(email, password){
   
  var User = this;
  const user = await User.findOne({email});
     if(!user){
         console.log('no user found');
        return null;
     }

     bcrypt.compare(password, user.password, function(err, res){
        if(res){
           return user;
        }else{
            console.log('pass didnot matched');
            return null;
        }
   });
      
     
};



userSchema.methods.removeToken = async function(token){
   var user = this;
   await user.update({
    $pull:{
        tokens:{
            token: token
        }
    }
});
};


module.exports = mongoose.model('userauth', userSchema);