
'use strict';

const fs = require('fs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../schema/UserSchema');
const Chat = require('../schema/ChatsSchema');
const aws = require('../handlers/AWSFileUpload');
exports.homePage = (req, res, next)=>{
console.log('req.msg is '+ req.msg);
  res.render('index',{id: req.user.id, img: req.user.profileimg, username: req.user.username, sug_users: req.susers, sum_users: req.friends, msgs: req.msg});
  
};

exports.homeJson = (req, res, next)=>{
    res.json({
        id: req.user.id,
         img: req.user.profileimg,
          username: req.user.username,
           sug_users: req.susers, 
           sum_users: req.friends,
            msgs: req.msg
    });
};

exports.messages =  async (req, res, next)=>{
try{
    var messagess = [];

    for(let i = 0; i < req.friends.length; i++){
        
        const param1 = req.friends[i].id+'.'+req.user.id;
        const param2 = req.user.id+'.'+req.friends[i].id;

    console.log(param1, param2);

     const msgs = await Chat.findOne({$or: [{'chatname1': param1}, {'chatname2': param1}]});
        if(!msgs.info){
          console.log('no msg present');

        }

        var msg;
        var isRead;
        console.log(msgs);

        if(msgs.info.length > 0){
         msg = msgs.info[msgs.info.length-1].msg[0].value;
         isRead = msgs.info[msgs.info.length-1].isRead;
        }

        else{
            msg = 'new to chat';
            isRead = true;
        }

        console.log('msg is ', msg);

        messagess.push({msg, isRead});
        
  
   

   

    }

    req.msg = messagess;
console.log(messagess);
    next();
} catch(err){
    console.log(err);
}

};



exports.userPost = async (req, res, next)=>{
    try{
if(!req.file){
    res.redirect('/');
}
else{
console.log('file name is '+req.file.key);
if(req.user.profileimg != 'images.png'){


await aws.delete(req.user.profileimg, 'summed-s3-bucket');

   fs.unlink(`./public/uploads/${req.user.profileimg}`, (err)=>{
      if(err)console.log(err);
      console.log('sucessfully deleted file');
   });
}

   let id = req.params.id;
   const user = await User.findByIdAndUpdate(req.user.id, { $set: { profileimg: req.file.key}}, {new: true});
   if(!user){
       res.status(404).send();
   }

   res.redirect('/');
}
    }catch(err){
        console.log(err);
    }

};





exports.suggestion = async (req, res, next)=>{
 
    const allusers = await User.find({});
    var users = allusers.filter(user =>{
       return user.id !== req.user.id;
    });
 
    
   
  if(req.user.summed.length > 0){
    
     users = users.filter(user =>{
        
          return req.user.summed.indexOf(user.id) < 0;
        
    });

    
  }

  

    req.susers = users;
    next();
  
};





exports.friends = async (req, res, next)=>{

    var friends = [];
      
    if(req.user.summed){
    for(let i = 0; i < req.user.summed.length; i++){
        const id = req.user.summed[i];
        const user = await User.findById(id);
        
        friends.push(user);
    }
}
    
    req.friends = friends;
    next();
};





exports.addUser = async (req, res, next)=>{
    try{
      
     const sum = req.params.sum.trim();
     const sumquery = sum || { $exists: true};

     const user = await User.findById(sumquery);

     const updateu1 = req.user.update({
         $addToSet:{
             summed: sum,
             chatgroups: req.user.id+'.'+sum
         }
         
     });
   
     
     const updateu2 = user.update({
         $addToSet:{
             summed: req.user.id,
             chatgroups: sum+'.'+ req.user.id
         },
     });
       
     const chatmodel = new Chat({
        chatname1 : req.user.id+'.'+sum,
        chatname2 : sum+'.'+ req.user.id
     });
     
     console.log('chat is ',chatmodel);
     const saveChat = chatmodel.save();
     await Promise.all([updateu1, updateu2, saveChat]);

     res.redirect('/');
    }catch(err){}
 };




exports.removeUser = async (req, res, next)=>{
  const sum = req.params.sum.trim();
const sumquery = sum || {$exists: true};

  const user = await User.findById(sumquery);

  if(!user){
    console.log('none one found');
   }

   const  updateu1 = req.user.update({
       $pull:{
           summed: sum
       }
   });

   const updateu2 = user.update({
    $pull:{
        summed: req.user.id
    }
   });
   const chatname_ = req.user.id+'.'+sum;
   const chatname__ = sum+'.'+req.user.id;
   const deleteChat = Chat.findOneAndRemove({$or:[{'chatname1': chatname_},{'chatname1': chatname__}]});

   await Promise.all([updateu1, updateu2, deleteChat]);
   
   

 res.redirect('/');
};



exports.messagePost = async function(req, res, next){

    console.log('params is '+req.body);
    try{
    const info = {
           sender: req.body.id,
           msg:{ value: req.body.msg,},
           isRead: false,
       };
       console.log(info);
      
    await Chat.findOneAndUpdate({$or:  [{'chatname1': req.body.params.parama}, {'chatname1': req.body.params.paramb}]},{
    $push:{
        info: info
    }  
   },{'new': true });
 

   res.json({
     result: "success",
     data: "succefully posted data"
   });
} catch(err){
    res.json({
        result: "failed",
        data: "cannot post data",
        error:err 
      }); 
}
};



exports.privateChat = async (req, res, next)=>{

    const msgs = await Chat.findOne({$or: [{'chatname1': req.params.chatname}, {'chatname2': req.params.chatname}]});
    

    if(msgs.info.length > 0){
        if(msgs.info[msgs.info.length-1].isRead == false){
            const query = `info.${msgs.info.length-1}.isRead`;
            await msgs.update({
                $set: {
                    [query]: true
                }
            });
        }
    }

    res.render('privatechat', {user: req.user});
};





exports.deleteChat = async (req, res, next)=>{

    try{
    const id = req.params.id.trim();
    const chatid = req.body.chatinfoid_d;
    const user =  req.body.user;
    const index = req.body.index;
    const msg = req.body.msg;
    const filename = req.body.filename_;
    const fileIndex = req.body.fileIndex;
    
    console.log('user id is '+user);
    console.log('user id inside is '+req.user.id);
    console.log('id '+id+' chatid '+chatid);
    if(user == req.user.id){
     

    if(msg == 'image' || msg == 'video'){
   console.log('filename is ', filename);
   console.log('fileindex is ', fileIndex);
        await aws.delete(filename, 'chat-s3-bucket');

        const query = `info.${index}.msg.0.filename`;
    

   const fchat =  await Chat.findById(id);
   if(fchat.info[index].msg[0].filename.length > 1){
   await fchat.update({ '$pop': 
   {
     [query] : fileIndex
      }
  });
}
else{
    await Chat.findByIdAndUpdate(id, {
        $pull:{
           'info':{
               '_id': chatid
           }
         }

    
},{'new': true});
}
    } else{

        await Chat.findByIdAndUpdate(id, {
            $pull:{
               'info':{
                   '_id': chatid
               }
             }
    
        
    },{'new': true});
    }
 
res.json({
    result: "success",
    data: " posted data",
    
});
    }
    else{

const un = await Chat.findById(id);
const query = `info.${index}.msg.0.notShowTo`;
const chatt =  await un.update(
 { '$addToSet': 
     {
        [query] : user
         }
     }
 );
    
    res.json({
        result: "403",
        data: " else user",
        
    });
}
    
    } catch(err){
        console.log(err);
        res.json({
            result: "failed",
            data: "cannot post data",
            error:err 
        });
    }

};



exports.messageFileUpload = async (req, res, next)=>{
    try{
        var filename = [];
        if(req.files){
            for(let i=0; i < req.files.length; i++){
                filename.push(req.files[i].key);
            }
        }
    const info = {
           sender: req.body.id,
           msg:{ value: req.body.msg,
                filename: filename},
           isRead: false,
       };
         
   const chatinfo = await Chat.findOneAndUpdate({$or:  [{'chatname1': req.body.param_}, {'chatname1': req.body.param__}]}
   ,{
    $push:{
        info: info
    }  
   },{'new': true }
);
 
   console.log('chat info is ', chatinfo);

   res.json({
     result: "success",
     data: "succefully posted data"
   });
} catch(err){
    res.json({
        result: "failed",
        data: "cannot post data",
        error:err 
      }); 
}
};


exports.peer_client = (req, res, next)=>{
    res.render('peer_client');
};