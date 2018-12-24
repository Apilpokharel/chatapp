
var socket = io(window.location.origin, {secure: true});


var msgbx=document.getElementById("messageDisplay");
		function scrollt(){

			msgbx.scrollTop=(msgbx.scrollHeight);
		}

function scrollToBottom(){

    //Selectors
    var messages = jQuery('#messageDisplay');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
       messages.scrollTop =scrollHeight;
    }
}



socket.on('connect', function(){

});

socket.on('from_server', function(data){
   var template = jQuery('#message-template').html();
   var html = Mustache.render(template, {
        from: data.from,
        profile: data.profile,
        message: data.message
   });

   jQuery('#messageDisplay').append(html);
//    scrollToBottom();
   scrollt();
});

jQuery('#formid').on('submit', function(e){
    e.preventDefault();
socket.emit('from_client',{
   from: jQuery('#h_user1').val().trim(),
   profile: jQuery('#h_user2').val().trim(),
   message: jQuery('[name=message]').val().trim()
}, function(){
    jQuery('[name=message]').val('');
});

console.log(jQuery('[name=message]').val());
});

socket.on('disconnect', function(){
 
});




$(window).bind("load", function() { 

    // your javascript event here
   
        axios({
            method: 'get',
            url:'/json'
        }).then(function(res){
            console.log('new reform');
         var str = $('#ejsTemplate').html();
         var result = ejs.render(str, res);
         $('#f_suggestion').html(result);
        }).catch(function(err){
            console.log('error is ',err);
        });
   
    });

