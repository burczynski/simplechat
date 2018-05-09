var app        = require('express')();
var server     = require('http').createServer(app);
var io         = require('socket.io')(server);
var tools      = require('./runserverTools/appTools');
var serverPort = 8000;

// List
var operatorsList  = [];
var clientChatsIds = [];
server.listen(serverPort, function () {
  homeMessage = "Chat server listening on port: "+serverPort;
  console.log(homeMessage);

  // Socket IO Conexion
  io.sockets.on('connection', function(socket) {
    // Socket: userData
    socket.on('userData', function(userData) {

      if (userData.clientAlias != undefined) {
        var room = userData.clientAlias;
        tools.findRoom(clientChatsIds, room)
        .then(function(foundClient) {
          if (foundClient == undefined) {
            var type = 'client';
            tools.setSocket(socket, room, type, clientChatsIds)
            .then(function(list) {
              if (list) {
                console.log("New Client connected");
                io.sockets.emit('allClients', list);
              }              
            },function(err) {
              console.log("Problem: ", err);
            });
          } else {
            socket.emit('changeNick');
          }
        },function(err) {
          console.log("Problem: ", err);
        });
      }
    });
    // Socket: userData

    // Socket: userPrivateData
    socket.on('userPrivateData', function(operatorData) {

      if (operatorData.clientAlias != undefined) {
        var room = operatorData.clientAlias;
        tools.findRoom(operatorsList, room)
        .then(function(foundOperator) {
          if (foundOperator == undefined) {
            var type = 'operator';
            tools.setSocket(socket, room, type, operatorsList)
            .then(function(list) {
              if (list) {
                console.log("New Operator connected");
                socket.emit('userConected', socket.currentRoom);
                io.sockets.emit('allClients', clientChatsIds);
              }              
            },function(err) {
              console.log("Problem: ", err);
            });
          } else {
            socket.emit('changeNick');
          }
        },function(err) {
          console.log("Problem: ", err);
        });        
      }   
    });
    // Socket: userPrivateData

    // Socket: joinRoom
    socket.on('joinRoom', function(roomName, userName) {
    console.log(userName + ' se unio a la sala ' + roomName);  
    });
    // Socket: joinRoom

    // Socket: sendMessage
    socket.on('chat message', function(msg, user, roomName) {
      console.log(user + ' dijo ' + msg + ' en la sala ' + roomName);
      io.in(roomName).emit('chat message', msg, user, roomName);

    });
    // Socket: sendMessage 

    // Socket: disconnect
    socket.on('disconnect', function(){
      var room = socket.currentRoom;
      if (socket.type == 'client') {
        tools.removeSocket(clientChatsIds, room)
        .then(function(list) {
          console.log('Client disconnected');
          io.sockets.emit('allClients', list);
        },function(err) {
          console.log("Problem: ", err);
        });
      } else{
        tools.removeSocket(operatorsList, room)
        .then(function(list) {
          console.log('Operator disconnected');
        },function(err) {
          console.log("Problem: ", err);
        });
      }
    });
    // Socket: disconnect
  });
  // Socket IO Conexion
});
