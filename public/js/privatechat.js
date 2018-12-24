

var socket = io(window.location.origin, {secure: true});

var paramsfade = window.location.pathname.trim();
var paramsv = paramsfade.split('/');
var parama = paramsv.pop();
var param1 = parama.split('.')[0];
var param2 = parama.split('.')[1];
var paramb = param2+'.'+param1;

var params = {parama, paramb};
console.log(params);
window.onbeforeunload = function() {
   this.alert('relly want to exit');
}

$("#send-input").focus();

let filebhandar = document.getElementById('filebhandar');
let filebtn = jQuery('#send-file');

filebtn.on('click', function(){
    $("#send-input").focus();
    filebhandar.click();
});

jQuery('#messageDisplay').on('click', function(){
    $("#send-input").focus();
});

window.addEventListener("click", function(){
    $("#send-input").focus();

});

socket.on('connect', function(){
  
    socket.emit('joinhijab', params, function(err){
   
if(err){
    alert(err);
    window.location.href='/';
}
else{

}

    });

    socket.emit('callhell',{
        room1: parama,
        room2: paramb,
        user:param1,
        data: 'call that bitch'
    }, function(e){
        console.log(e);
    });
});


var msgbx=document.getElementById("messageDisplay");
		function scrollt(){

			msgbx.scrollTop=(msgbx.scrollHeight);
        }
        


let user;
socket.on('servo1_d', function(data){
    jQuery('#messageDisplay').empty();
    
    for(let i = 0; i < data.chats.length ; i++){

        
console.log('not to show ',data.chats[i].notToShow[0]);
console.log(param2);

if(data.chats[i].notToShow == param2){
  console.log('luck');
} else{
    console.log('notluck');
    var styles;
    if(data.chats[i].message === 'image' || data.chats[i].message === 'video'){
        styles= 'display: none;';
       }
   
    else{
       
        if((data.chats[i].grade == parama.split('.')[0]) && (data.chats[i].message != 'image' || data.chats[i].message != 'video')){
            styles = 'color: #fffefe;  background-color: tomato; border: 0.5px solid red; text-shadow: 2px 2px 4px #000000; float: right;'
            
       }
      
       else if((data.chats[i].grade == parama.split('.')[1]) && (data.chats[i].message !== 'image' || data.chats[i].message !== 'video')){
           styles= 'color: black;  background-color: #fffefe; border: 0.5px solid brown; ';
       }
       else{
           styles= 'display: none;'
       }
    }

    let imagemsg = null;
    if(data.chats[i].message === 'image'){
             imagemsg = 'image';
    }


   let options = {
    from: data.chats[i].from,
    profile: data.chats[i].profile,
    message: data.chats[i].message,
    grade: data.chats[i].grade,
    styles: styles,
    chatid: data.chats[i].chatid,
    chatinfoid: data.chats[i].chatinfoid,
    filename:  data.chats[i].filename,
    i: i,
    image: imagemsg,
   };

   var source = jQuery('#message-template').html();
   var compiled = dust.compile(source, "intro");
   dust.loadSource(compiled);

   dust.render("intro", options, function(err, out) {
    jQuery('#messageDisplay').append(out);
});
  
  
}
}

scrollt();
});










function deleteChat(a, f){
    $("#send-input").focus();
    let chatid_d = jQuery(`#chatid_${a}`).val();
    let chatinfoid_d = jQuery(`#chatinfoid_${a}`).val();
    let user = jQuery(`#grade_${a}`).val();
    let message__ = document.getElementById(`msg_${a}`).textContent;
    let filename__ ;
    console.log('message is ', message__);
    if(message__ == 'image' || message__ == 'video'){
    filename__ = jQuery(`#filename_${f}`).val(); 
    console.log('filename is ', filename__);

    }
    else{
        filename__ = null;
    }
    // console.log('id'+ chatid_d+" chatid "+chatinfoid_d);
    axios({
      method: 'post',
      url:`/delete/${chatid_d}`,
      data:{
          chatinfoid_d: chatinfoid_d,
          user:user,
          msg: message__,
          filename_: filename__,
          index: a,
          fileIndex: f
      }
    }).then(function(res){
   console.log(res.data);


   socket.emit('callhell',{
    room1: parama,
    room2: paramb,
    data: 'call that bitch'
}, function(e){
    if(e){
        return console.log('eknoeledge is ', e);
    }
});


    }).catch(function(err){
        console.log('error in saving ',err);
    });

}







jQuery('#formid').on('submit', function(e){
 e.preventDefault();

    $("#send-input").focus();
if(filebhandar.files.length > 0){

    console.log('file is present and is ',filebhandar.files.length);

    var context = filebhandar.files[0].type;
    var str = context.split("/");
    console.log('file is ', str[0]);

    if(str[0] == 'image' || str[0] == 'video'){
        document.getElementById("send-input").disabled = true;
        document.getElementById("send-file").disabled = true;
        const formData = new FormData();
         for(let i=0; i < filebhandar.files.length; i++){
            formData.append("files", filebhandar.files[i]);
         }

         console.log('parama ', parama);
         console.log('paramb ', paramb);

         formData.append("id",jQuery('#sender_grade').val().trim());
         formData.append("msg",str[0]);
         formData.append("param_",parama);
         formData.append("param__",paramb);
         




         const contenttype = {
             headers:{
                 'content-type':'multipart/form-data'
             }
         }

   axios({
    method: 'post',
    url: '/chatpost/file',
    data: formData,
    headers: contenttype
    
  }).then(function(res){
    document.getElementById("send-input").disabled = false;
    document.getElementById("send-file").disabled = false;

    console.log(res.data);
    socket.emit('callhell',{
        room1: parama,
        room2: paramb,
        data: 'call that bitch'
    }, function(e){
        filebhandar.value = null;
        jQuery('[name=message]').val('');
        if(e){
            return console.log('eknoeledge is ', e);
        }
    });
    filebhandar.value = null;
}).catch(function(err){
    console.log('eror is ', err);
});
    }
} 





else{
    console.log('on this fuck');



if(jQuery('[name=message]').val().trim() != ''){ 


    // console.log('message is ', msg);
socket.emit('hijabo1_m', {
    from: jQuery('#sender_name').val().trim(),
    room1: parama,
    room2: paramb,
    grade: jQuery('#sender_grade').val().trim(),
    message: jQuery('[name=message]').val().trim(),
}, function(e){
    jQuery('[name=message]').val('');
    if(e){
        return console.log('eknoeledge is ', e);
    }
});




axios({
    method: 'post',
    url: '/chatpost',
    data: {
    id: jQuery('#sender_grade').val().trim(),
    msg: jQuery('[name=message]').val().trim(),
    params: params
    }
  }).then(function(res){
    console.log(res.data);
    socket.emit('callhell',{
        room1: parama,
        room2: paramb,
        data: 'call that bitch'
    }, function(e){
        jQuery('[name=message]').val('');
        if(e){
            return console.log('eknoeledge is ', e);
        }
    });
}).catch(function(err){
    console.log('eror is ', err);
});



}
}
});


 function typing(a){

    socket.emit('typing',{
        id: param1,
        user:  jQuery('#sender_name').val(),
        room1: parama,
        room2: paramb,
        length: jQuery('[name=message]').val().trim().length,
        typmsg: jQuery('[name=message]').val().trim(),
        submit: a

    }, function(e){
        jQuery('#typeDisplay').empty();
    });
};


socket.on('typing_server', function(data){

    jQuery('#typeDisplay').empty();

    // console.log('maover '+data.id +' '+ data.user+' '+ data.length);
   let display;

   if(data.submit == 'submited'){
    display = 'none';
   }
  
   else{
   if(data.length < 1){
       display = 'none';
   }
 
   else{
    if(data.id != param1){
        display = 'block';
    }
   }
}

 let options = {
     display: display,
     user: data.user,
     typ: data.msg
 };

    var source2 = jQuery('#typing_template').html();
    var compiled2 = dust.compile(source2, "typ");
    dust.loadSource(compiled2);
 
    dust.render("typ", options, function(err, out) {
     jQuery('#typeDisplay').append(out);
 });
   
});

socket.on('disconnect', function(){

});




