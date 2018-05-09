module.exports = {
	
  findRoom: function(list, room) {
    return new Promise(function(resolve, reject) {
      // check if chat exist
      function getRoom (socket){
        var rta = undefined;
        if (socket.socketCurrentRoom === room) {
            rta = socket;
        }
        return rta;
      }

      var checkChat = list.find(getRoom);
      if (checkChat == undefined) {
        resolve(undefined);
      }
      else if (checkChat != undefined) {
        resolve(checkChat);
      }
      // END check if chat exist
    });
  },
  // END findRoom

  setSocket: function(socket, room, type, list) {
    return new Promise(function(resolve, reject){
      socket.currentRoom = room;
      socket.type        = type;
      socket.join(room);

      setted = {
                socketId          : socket.id,
                socketCurrentRoom : socket.currentRoom,
                socketTypeUser    : socket.type
              };
      list.push(setted);
      resolve(list);
    });
  },
  // END setSocket

  removeSocket: function(list, room) {
  	return new Promise(function(resolve, reject){
  		var index;
      list.forEach(function(listSocket){
        if (listSocket.socketCurrentRoom == room) {
          index = list.indexOf(listSocket);
          list.splice(index, 1);
          resolve(list);
        }
  	  });
    });
  }
  // END removeSocket
};