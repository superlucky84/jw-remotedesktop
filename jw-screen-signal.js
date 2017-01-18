var http     = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server_handler = function (req, res) {
  res.writeHead(404);
  res.end();
};

var server = http.createServer().listen(12341,function(){
    console.log('Server Running at screenshare singnaling');
});

/*
var server = require('https').Server({
  key: fs.readFileSync(__dirname+'/jssl.key'),
  cert: fs.readFileSync(__dirname+'/1_superlucky.co.kr_bundle.crt')
}, server_handler);
server.listen(12341);
*/



var ROOMINFO =  {};

var io = socketio.listen(server);
io.set( 'origins', '*:*' );
io.of('/vc');
io.sockets.on('connection', function (socket) {

  var currentroom = null;


  socket.on('join', function(userType, roomname, callback) {

    socket.join(roomname);

    currentroom = roomname;


    if (!ROOMINFO[roomname]) {
      ROOMINFO[roomname] = {};
    }

    if (!ROOMINFO[roomname].client) {
      ROOMINFO[roomname].client = [];
    }

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

  socket.on('sendOffer', function(wsid, desc, screenOption) {
    console.log('sendOFFERRRR');
    if (io.sockets.connected[wsid]) {
      io.sockets.connected[wsid].emit('receiveOffer', desc, socket.id, screenOption);
    }
  });

  socket.on('sendAnswer', function(wsid, desc) {
    io.sockets.connected[wsid].emit('receiveAnswer', desc, socket.id);
  });

  // 연결끊김
  socket.on('disconnect', function() {

    // sender 일때 처리
    if (ROOMINFO[currentroom] && ROOMINFO[currentroom].host == socket.id) {
      delete ROOMINFO[currentroom].host;
    }
    // receiver 일때 처리
    else if (ROOMINFO[currentroom] && ROOMINFO[currentroom].client ) {
      var arr = ROOMINFO[currentroom].client;
      arr.splice(arr.indexOf(socket.id),1);
    }
    socket.broadcast.emit('destroy', socket.id);
    socket.leave(currentroom);

    if (
        ROOMINFO[currentroom] && ROOMINFO[currentroom].client.length == 0 &&
        !ROOMINFO[currentroom] && ROOMINFO[currentroom].host
    ){
      delete ROOMINFO[currentroom];
    }

  });
});
