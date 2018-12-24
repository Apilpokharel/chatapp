'use strict';

const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
    accessKeyId: "AKIAI3MRCLGP2LIBLP4Q",
    secretAccessKey: "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",
});

const s3 = new AWS.S3();

const s3option = {
  s3: s3,
  bucket: 'summed-s3-bucket',
  acl: 'public-read',
  metadata: function(req, file, cb){
      cb(null, {fieldName: file.fieldname});
  },
  key: function(req, file, cb){
      cb(null, uuid.v4()+'.'+file.mimetype.split('/')[1])
  }

};



 exports.upload = multer({
    storage: multerS3(s3option),
    
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto ){ 
        next(null, true);
       }
       else{
           next({message:'type of file isnot supported'}, false);
       }
  }
}).single('file');



exports.delete = (filename, bucketName)=>{
    s3.deleteObject({
        Bucket: bucketName,
        Key: filename
      },function (err,data){
          console.log('error in s3 bucket ', err);
      })
};


const manys3option = {
    s3: s3,
    bucket: 'chat-s3-bucket',
    acl: 'public-read',
    metadata: function(req, file, cb){
        cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb){
        cb(null, uuid.v4()+'.'+file.mimetype.split('/')[1])
    }
  
  };


exports.manyUpload = multer({
    storage: multerS3(manys3option),
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        if(isPhoto || isVideo){ 
            next(null, true);
           }
           else{
               next({message:'type of file isnot supported'}, false);
           }
      }
}).array('files', 12);