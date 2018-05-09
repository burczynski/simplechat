$(function () {

  // Format
  String.prototype.format = function() {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function(a) {
      return args[ + (a.substr(1, a.length-2)) || 0];
    });
  };
  // End Format

  do{
    var nickName = prompt("Nick?");
    var roomName = nickName;
  }while (nickName === "" || nickName === null);

  // client data
  var userData = {
    clientAlias: nickName,
  };

  // Socket IO
  var socket = io.connect('http://localhost:8000');

  if (nickName !== "" && nickName !== null) {
    socket.emit('userData', userData);
  }    
  //End client data

  // Socket io events block
  socket.on('chat message', function(msg, user, roomName){
    var text = "{0}: {1}".format(user, msg);
    $('#messages').append($('<li>').text(text));
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('changeNick', function(){
    var comment = 'Invalid nickName';
    if(confirm(comment)) {
      window.location.reload();  
    }
  });
  // Socket io events block end
  // Socket IO

  // Send message
  $('form').submit(function(){
    socket.emit('chat message', $('#myMessage').val(), userData.clientAlias, roomName);
    $('#myMessage').val('');
    return false;
  });
  // Send message
});