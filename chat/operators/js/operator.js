$(document).ready(function() {

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
  var toRoomName;

  // functions
  function clientAppend(roomName) {
    $("#chats").append('<li name="{4}"><a href="#{0}" id="{1}" value="{3}">{2}</a></li>'.format(roomName, roomName, roomName, roomName, roomName)).on('click',
        function(){
          toRoomName = roomName;
          $("#messages").empty();
          socket.emit('joinRoom', roomName, userData.clientAlias);
        });
  }
  // end functions


  // Socket IO
  
  var socket = io.connect('http://localhost:8000');

  if (nickName !== "" && nickName !== null) {
    socket.emit('userPrivateData', userData);
  }    
  //End client data

  // Socket io events block
  socket.on('userConected', function(currentRoom) {
    // Set current Room
    toRoomName = currentRoom;
  });

  socket.on('allClients', function(clients){
    $("#chats").empty();
    clients.forEach(function(socket){
      console.log(socket.socketCurrentRoom);
      clientAppend(socket.socketCurrentRoom);
    });
  });

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
    socket.emit('chat message', $('#myMessage').val(), userData.clientAlias, toRoomName);
    $('#myMessage').val('');
    return false;
  });
  // Send message
});