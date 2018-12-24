


var socket = io(window.location.origin,{secure: true});

socket.on('connect', function(){
  //  console.log('connected to server');
});


socket.on('disconnect', function(){
  console.log('server disconnected');
});


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


//with websocket
navigator.getUserMedia({ video: true, audio: false }, myMedia, function (err) { console.error(err) })
 
function myMedia (stream) {
  var peer = new SimplePeer({ initiator: location.hash === '#init', stream: stream })
  
 

var user = null;
if(location.hash === '#init'){
  user = 'caller';
} else{
  user = 'receiver';
}

  peer.on('signal', function (data) {

  socket.emit('signal', {
   user: user,
   from: 'peer',
   signal: data
  });

    
  });
 
  


  socket.on('data', function(data){
    if(data.user == 'caller' ){
        
    }

    else if(data.user == 'receiver'){
       peer1.signal(data.signal);
    }

    else{
    return;
    }
  });
 
 


  peer1.on('stream', function (stream){
    var video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = stream;
    video.play();
  })
}





















// //simple without websocket
// navigator.getUserMedia({video: true, audio: false}, function(stream){

//   var localVideo = document.getElementById('localstream');
//   localVideo.srcObject = stream;


// var peer = new SimplePeer({
//   initiator: location.hash === '#init',
//   trickle: false,
//   stream: stream
// });

// peer.on('error', function (err) { console.log('error', err) })

// peer.on('connect', function () {
//   console.log('CONNECT')
  
// });


// peer.on('signal', function(data){
//   console.log('data is '+data);
//   document.getElementById('yourId').value = JSON.stringify(data);
// });


// document.getElementById('connect').addEventListener("click", function(){
//   var otherId = JSON.parse(document.getElementById('otherId').value)
  
//   peer.signal(otherId)
// }); 


// document.getElementById('send').addEventListener('click', function(){
//   var yourMessage = document.getElementById('yourMessage').value;
//   peer.send(yourMessage);
// });


// peer.on('data', function(data){
//   document.getElementById('messages').textContent += data + '\n'
// });



// peer.on('stream', function(stream){
//   console.log('we are on stream');
//   var video = document.createElement('video');
//   document.body.appendChild(video);
//   video.srcObject = stream;
//   video.play();
// });
// }, function(err){
//   console.error(err);
// });