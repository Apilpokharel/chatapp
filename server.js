
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const socketIO = require('socket.io');

const app = require('./app');

const PORT = process.env.PORT || 3000;

const options = {
    key: fs.readFileSync('./public/SSL/privatekey.pem'),
    cert: fs.readFileSync('./public/SSL/certificate.pem')
 };



 // const httpsServer = https.createServer(options, app);
 const httpServer = http.createServer(app);
 // const io = socketIO(httpsServer);
 const io = socketIO(httpServer);

 require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err)=>{
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});



require('./controller/SocketController').adminSocket(io);

 process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


// httpsServer.listen(443, (e)=>{
//     if(e){
//         console.log(`server stoped due to ${e}`);
        
//     }

//     console.log('server started on port'+8443);
//  });

 // http.createServer((req, res)=>{
 //    console.log( "host is "+req.headers['host'] );
 //    res.writeHead(301, { "Location":"https://" + req.headers['host'] + req.url  });
  
 //    res.end();
 //    }).listen(80);



httpServer.listen(80);
