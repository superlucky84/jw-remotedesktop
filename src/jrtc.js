/* IMPORT WEBRTC */
import webrtc from 'webrtc-adapter';

module.exports = class Jrtc {

  constructor(type, channel,  ws, $video) {

    this.peer = {};

    /* sender or receiver */
    this.type = type;

    this.parterId = null;

    this.$video = $video;

    this.ws = ws;

    this.channel = channel;

    this.stream = null;


    this.iceConfig = {
      iceServers: [
        {
          url: 'stun:104.236.113.81:3478'
        },
        {
          url: 'turn:104.236.113.81:3478?transport=udp',
          credential: 'fd8f745ea7a07828e6690fa0d080e522',
          username: 'jj'
        },
        {
          url: 'turn:104.236.113.81:3478?transport=tcp',
          credential: 'fd8f745ea7a07828e6690fa0d080e522',
          username: 'jj'
        }
      ]
    }

    if (this.type == 'receiver') {
      this.requestConnect();
    }

    /* datachannel sample */
    this.sendChannel = {};
		this.sendProgress = document.querySelector('progress#sendProgress');
		this.bytesToSend = Math.round(128) * 1024 * 1024;
    this.receiveProgress = document.querySelector('progress#receiveProgress');
    this.receivedSize = 0;
  }

  join(room, callback = false) {
    this.ws.emit('join', this.type, room , callback);
  }



  /**
   * SENDER FUNCTION
   */

  getUserMedia() {

    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).
    then((stream) => { this.setEvent(stream) }).catch(function(e){
        alert('getUserMedia() error: ' + e.name);
    });

  }


  setEvent(stream) {

    let that = this;
    that.stream = stream;

    if (that.channel == 'screen' || that.channel == 'all') {

      let videoTracks = stream.getVideoTracks();
      console.log('Using video device: ' + videoTracks[0].label);
      stream.oninactive = function() {
        console.log('Stream inactive');
      };

      window.stream = stream;
      that.$video.srcObject = stream;
    }


    that.ws.on('receiveCreateRtc', function(id, roomname) {
      that.receiveCreateRtc(id, roomname);
    });

    // 연결하자고 pc2_id로 부터 요청을 받는다
    that.ws.on('requestConnectRequest', function(id) {
      that.createPeer(id);
      that.createOffer(id);
    });

    that.ws.on('receiveAnswer',function(desc, id) {

      that.peer[id].setRemoteDescription(desc).then(
        that.onSetRemoteSuccess.bind(that, id),
        that.onSetSessionDescriptionError
      );
    });

    that.ws.on('receiveIceCandidate',function(candidate, id) {

      if (!that.peer[id]) return;

      that.peer[id].addIceCandidate(
        new RTCIceCandidate(candidate)
      ).then(
        that.onAddIceCandidateSuccess,
        that.onAddIceCandidateError
      );
    });

  }

  createOffer(id) {

    console.log('CREATEOFFER');

    let that = this;

    that.peer[id].createOffer(
    ).then(
      that.onCreateOfferSuccess.bind(that, id),
      that.onCreateSessionDescriptionError
    );
  }

  createPeer(id) {
    console.log('CREATEPEER');

    let that = this;

    /*
    if (that.peer[id]) {
      that.peer[id].close();
    }
    */

    that.peer[id] = new RTCPeerConnection(that.iceConfig);

    if (that.channel == 'screen' || that.channel == 'all') {
      that.peer[id].addStream(that.stream);
    }

    if (that.channel == 'data'|| that.channel == 'all'){

      let dataChannelParams = {ordered: true};
      that.sendChannel[id] = that.peer[id].createDataChannel('sendDataChannel', dataChannelParams);
      that.sendChannel[id].binaryType = 'arraybuffer';
      that.sendChannel[id].onopen = that.onSendChannelStateChange.bind(that, id);
      that.sendChannel[id].onclose = that.onSendChannelStateChange.bind(that, id);
    }


    that.peer[id].onicecandidate = function(e) {
      that.onIceCandidate(e, id);
    };

    that.peer[id].oniceconnectionstatechange = function(e) {
      that.onIceStateChange(e, id);
    };

  }

  onCreateOfferSuccess(id, desc) {

    let that = this;

    console.log('Offer from pc1\n' + desc);
    console.log('pc1 setLocalDescription start');

    that.peer[id].setLocalDescription(desc).then(
      () => {
        that.onSetLocalSuccess(desc, id);
      },
      that.onSetSessionDescriptionError
    );
  }


  /* this datachannel function */

  onSendChannelStateChange(id) {

    var readyState = this.sendChannel[id].readyState;

    if (readyState === 'open') {
      console.log('SENDGENERATE-DATA');
      //this.sendGeneratedData();

      this.sendChannel[id].send("REQUEST_REVERSE_DATA_CHANNAL");
    }
  }

  sendGeneratedData() {
    let that = this;

    this.sendProgress.max = this.bytesToSend;
    this.sendProgress.value = 0;

    var chunkSize = 16384;
    var stringToSendRepeatedly = randomAsciiString(chunkSize);
    var bufferFullThreshold = 5 * chunkSize;
    var usePolling = true;
    if (typeof this.sendChannel[id].bufferedAmountLowThreshold === 'number') {
      usePolling = false;

      // Reduce the buffer fullness threshold, since we now have more efficient
      // buffer management.
      bufferFullThreshold = chunkSize / 2;

      // This is "overcontrol": our high and low thresholds are the same.
      this.sendChannel[id].bufferedAmountLowThreshold = bufferFullThreshold;
    }
    // Listen for one bufferedamountlow event.
    var listener = function() {
      that.sendChannel[id].removeEventListener('bufferedamountlow', listener);
      sendAllData();
    };
    var sendAllData = function() {
      // Try to queue up a bunch of data and back off when the channel starts to
      // fill up. We don't setTimeout after each send since this lowers our
      // throughput quite a bit (setTimeout(fn, 0) can take hundreds of milli-
      // seconds to execute).
      while (that.sendProgress.value < that.sendProgress.max) {
        if (that.sendChannel[id].bufferedAmount > bufferFullThreshold) {
          if (usePolling) {
            setTimeout(sendAllData, 250);
          } else {
            that.sendChannel[id].addEventListener('bufferedamountlow', listener);
          }
          return;
        }
        that.sendProgress.value += chunkSize;
        that.sendChannel[id].send(stringToSendRepeatedly);
      }
    };
    setTimeout(sendAllData, 0);

		function randomAsciiString(length) {
			var result = '';
			for (var i = 0; i < length; i++) {
				// Visible ASCII chars are between 33 and 126.
				result += String.fromCharCode(33 + Math.random() * 93);
			}
			return result;
		}
  }
  receiveCreateRtc(id) {
    console.log('not define');
  }




  /**
   * RECEIVER FUNCTION
   */


  requestCreateRtc(roomname) {
    this.ws.emit('requestCreateRtc',  this.parterId, roomname);
  }

  gotRemoteStream(e) {
    //video.srcObject = e.stream;
    //video.src = URL.createObjectURL(e.stream);
    //let $this = ReactDOM.findDOMNode(this);
    //$video.srcObject = e.stream;
    //$video.srcObject = e.stream;

    this.$video.src = URL.createObjectURL(e.stream);

  }

  onCreateAnswerSuccess(id, desc) {
    console.log('KKKKKKKKKKKKKKKk--',id,desc);
    this.peer[id].setLocalDescription(desc).then(
      this.onSetLocalSuccess.bind(this, desc, id),
      this.onSetSessionDescriptionError
    );
  }

  /* datachannel sample */
  receiveChannelCallback(id ,event) {

    //this.receiveProgress.max = this.bytesToSend;
    //this.receiveProgress.value = 0;

    this.receiveChannel = event.channel;
    this.receiveChannel.binaryType = 'arraybuffer';
    this.receiveChannel.onmessage = this.onReceiveMessageCallback.bind(this);
    this.receivedSize = 0;
  }

  onReceiveMessageCallback(event) {
    console.log("RECEIVE DATA",event.data, typeof event.data);

    /*
    this.receivedSize += event.data.length;
    console.log(this.receivedSize);
    this.receiveProgress.value = this.receivedSize;
    */
  }

  requestConnect() {
    console.log('REQUESTCONNECT-------------',new Date().getTime());

    let that = this;



    that.ws.on('receiveOffer', function(desc, id) {

      console.log('RECEIVEOFFER----',(new Date).getTime());

      /*
      if (that.peer[id]) {
        that.peer[id].close();
      }
      */

      that.peer[id] = new RTCPeerConnection(that.iceConfig);

      that.peer[id].onicecandidate = function(e) {
        that.onIceCandidate(e, id);
      };

      that.peer[id].oniceconnectionstatechange = function(e) {
        that.onIceStateChange(e, id);
      };

      if (that.channel == 'screen' || that.channel == 'all') {
        that.peer[id].onaddstream = that.gotRemoteStream.bind(that);
      }
      if (that.channel == 'data'|| that.channel == 'all'){
        that.peer[id].ondatachannel = that.receiveChannelCallback.bind(that, id);
      }


      that.parterId = id;
      that.peer[id].setRemoteDescription(desc).then(
        that.onSetRemoteSuccess.bind(that, id),
        that.onSetSessionDescriptionError
      );
    });

    that.ws.on('receiveIceCandidate',function(candidate, id) {

      if (!that.peer[id]) return;

      that.peer[id].addIceCandidate(
        new RTCIceCandidate(candidate)
      ).then(
        that.onAddIceCandidateSuccess,
        that.onAddIceCandidateError
      );
    });

  }


  /**
   * SENDER RECEIVER 공통함수들
   */

  onIceCandidate(event, id) {
    if (event.candidate) {
      this.ws.emit('sendIceCandidate', id, event.candidate);
    }
  }


  onSetLocalSuccess(desc, id) {
    console.log('setLocalDescription complete');
    // 성공 후 웹소켓으로 parter에게 sdp 전달
    let sendType = "sendOffer";
    if (this.type == 'receiver') {
      sendType = "sendAnswer";
    }
    console.log('JJJJJJJJJJJJJJJJJJJJ', sendType, id, desc);
    this.ws.emit(sendType, id, desc);
  }


  onSetRemoteSuccess(id) {

    console.log('SETREMOTEDESCRIPTION COMPLETE');

    // setremotesdp 성공 후 createSdp 생성
    if (this.type == 'receiver') {
      this.peer[id].createAnswer().then(
        this.onCreateAnswerSuccess.bind(this, id),
        this.onCreateSessionDescriptionError
      );
    }
  }

  onIceStateChange(event, id) {
    console.log(this.peer[id].iceConnectionState);
  }

  onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString());
  }

  onSetSessionDescriptionError(error) {
    console.log('Failed to set session description: ' + error.toString());
  }

  onAddIceCandidateSuccess() {
    console.log(' addIceCandidate success');
  }

  onAddIceCandidateError(error) {
    console.log(' failed to add ICE Candidate: ' + error.toString());
  }

  handleError(e) {
    console.log(e);
  }
}

