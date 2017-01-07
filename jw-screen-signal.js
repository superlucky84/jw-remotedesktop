var http     = require('http');
var socketio = require('socket.io');


var server = http.createServer().listen(12345,function(){
    console.log('Server Running at screenshare singnaling');
});


/*
var ROOMINFO =  {
  host: null,
  client: [],
}
*/
var ROOMINFO =  {};

var io = socketio.listen(server);
io.set( 'origins', '*:*' );
io.of('/vc');
io.sockets.on('connection', function (socket) {

  var roomnams = [];

  //socket.join(roomname);
  //io.sockets.in(user_info.roomname).emit('user_list',user_list[user_info.roomname]);
  //io.sockets.connected[socket.id].emit('join_exit_ok',true);

  socket.on('join', function(userType, roomname, callback) {
    socket.join(roomname);


    if (roomnams.indexOf() < 0) {
      roomnams.push(roomname);
    }

    if (!ROOMINFO[roomname]) {
      ROOMINFO[roomname] = {};
    }

    if (!ROOMINFO[roomname].client) {
      ROOMINFO[roomname].client = [];
    }

    console.log("JJJJJJJJJJ----",roomname, socket.id);

    if (userType == 'sender') {
      ROOMINFO[roomname].host = socket.id;

      if (callback) {
        callback(ROOMINFO[roomname].client);
      }

    }
    else {
      ROOMINFO[roomname].client.push(socket.id);

      // 클라이언트에서 호스트에게 OFFER 요청
      console.log("ROOMNAME",roomname, ROOMINFO[roomname]);
      io.sockets.connected[ROOMINFO[roomname].host].emit('requestConnectRequest', socket.id);

    }
  });



  socket.on('leave', function(roomname) {
    socket.leave(roomname);
  });

  socket.on('requestCreateRtc', function(wsid, roomname) {
    io.sockets.connected[wsid].emit('receiveCreateRtc', socket.id, roomname);
  });

  socket.on('sendIceCandidate', function(wsid, candidate) {
    if (io.sockets.connected[wsid]) {
      io.sockets.connected[wsid].emit('receiveIceCandidate',candidate, socket.id);
    }
  });

  socket.on('sendOffer', function(wsid, desc) {
    console.log('sendOFFERRRR');
    if (io.sockets.connected[wsid]) {
      io.sockets.connected[wsid].emit('receiveOffer', desc, socket.id);
    }
  });

  socket.on('sendAnswer', function(wsid, desc) {
    //console.log("SENDANASSER",wsid,room);
    io.sockets.connected[wsid].emit('receiveAnswer', desc, socket.id);
  });

  // 연결끊김
  socket.on('disconnect', function() {
    roomnams.forEach(function(name) {
      socket.leave(name);
    });

  });
});




