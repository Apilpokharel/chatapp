'use strict';

const multer = require('multer');
const uuid = require('uuid');

const multeroption = {
  storage: multer.diskStorage({
      destination: function(req, file, cb){
         cb(null, 'C:/Users/APIL/Documents/nodejs-workspace/ChatApp/public/uploads');
      },
      filename: function(req, file, cb){
          cb(null, uuid.v4()+'.'+file.mimetype.split('/')[1]);
      }
  }),

  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto ){ 
        next(null, true);
       }
       else{
           next({message:'type of file isnot supported'}, false);
       }
  }
};


exports.upload = multer(multeroption).single('file');
