/* IMPORT WEBRTC */
import webrtc from 'webrtc-adapter';

export default class Jrtc {

  constructor(type, channel,  ws, $video) {

    this.peer = null;

    /* sender or receiver */
    this.type = type;

    this.parterId = null;

    this.$video = $video;

    this.room = null;

    this.ws = ws;

    this.channel = channel;

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
    this.sendChannel = null;
		this.sendProgress = document.querySelector('progress#sendProgress');
		this.bytesToSend = Math.round(128) * 1024 * 1024;
    this.receiveProgress = document.querySelector('progress#receiveProgress');
    this.receivedSize = 0;

  }

  join(roomname, callback = false) {
    this.room = roomname;
    this.ws.emit('join', this.type, roomname, callback);
  }

  requestCreateRtc() {
    this.ws.emit('requestCreateRtc', this.room, this.parterId);
  }


  /**
   * SENDER FUNCTION
   */

  getUserMedia() {

    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).
    then((stream) => { this.sendStart(stream) }).catch(function(e){
        alert('getUserMedia() error: ' + e.name);
    });

  }

  sendStart(stream) {

    let that = this;


    that.peer = new RTCPeerConnection(that.iceConfig);


    if (that.channel == 'screen' || that.channel == 'all') {

      /*
      let offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      };
      */


      let videoTracks = stream.getVideoTracks();
      console.log('Using video device: ' + videoTracks[0].label);
      stream.oninactive = function() {
        console.log('Stream inactive');
      };


      window.stream = stream; // make variable available to browser console
      that.$video.srcObject = stream;

      that.peer.addStream(stream);

    }
    if (that.channel == 'data'|| that.channel == 'all'){

      let dataChannelParams = {ordered: true};
      that.sendChannel = that.peer.createDataChannel('sendDataChannel', dataChannelParams);
      that.sendChannel.binaryType = 'arraybuffer';
      that.sendChannel.onopen = that.onSendChannelStateChange.bind(that);
      that.sendChannel.onclose = that.onSendChannelStateChange.bind(that);
    }


    that.peer.onicecandidate = function(e) {
      that.onIceCandidate(e);
    };

    that.peer.oniceconnectionstatechange = function(e) {
      that.onIceStateChange(e);
    };

    that.ws.on('receiveCreateRtc', function(id) {
      that.receiveCreateRtc();
    });

    // 연결하자고 pc2_id로 부터 요청을 받는다
    that.ws.on('requestConnectRequest', function(id) {

      that.parterId = id;
      that.peer.createOffer(

      ).then(
        that.onCreateOfferSuccess.bind(that),
        that.onCreateSessionDescriptionError
      );
    });

    that.ws.on('receiveAnswer',function(desc) {
      console.log("ANSWSERDESC --",desc);
      that.peer.setRemoteDescription(desc).then(
        that.onSetRemoteSuccess.bind(that),
        that.onSetSessionDescriptionError
      );
    });

    that.ws.on('receiveIceCandidate',function(candidate) {
      that.peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      ).then(
        that.onAddIceCandidateSuccess,
        that.onAddIceCandidateError
      );
    });
  }

  onCreateOfferSuccess(desc) {

    let that = this;

    console.log('Offer from pc1\n' + desc);
    console.log('pc1 setLocalDescription start');

    that.peer.setLocalDescription(desc).then(
      () => {
        that.onSetLocalSuccess(desc);
      },
      that.onSetSessionDescriptionError
    );
  }


  /* this datachannel function */

  onSendChannelStateChange() {

    var readyState = this.sendChannel.readyState;

    console.log("state",readyState);

    if (readyState === 'open') {
      console.log('SENDGENERATE-DATA');
      //this.sendGeneratedData();

      this.sendChannel.send("REQUEST_REVERSE_DATA_CHANNAL");
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
    if (typeof this.sendChannel.bufferedAmountLowThreshold === 'number') {
      usePolling = false;

      // Reduce the buffer fullness threshold, since we now have more efficient
      // buffer management.
      bufferFullThreshold = chunkSize / 2;

      // This is "overcontrol": our high and low thresholds are the same.
      this.sendChannel.bufferedAmountLowThreshold = bufferFullThreshold;
    }
    // Listen for one bufferedamountlow event.
    var listener = function() {
      that.sendChannel.removeEventListener('bufferedamountlow', listener);
      sendAllData();
    };
    var sendAllData = function() {
      // Try to queue up a bunch of data and back off when the channel starts to
      // fill up. We don't setTimeout after each send since this lowers our
      // throughput quite a bit (setTimeout(fn, 0) can take hundreds of milli-
      // seconds to execute).
      while (that.sendProgress.value < that.sendProgress.max) {
        if (that.sendChannel.bufferedAmount > bufferFullThreshold) {
          if (usePolling) {
            setTimeout(sendAllData, 250);
          } else {
            that.sendChannel.addEventListener('bufferedamountlow', listener);
          }
          return;
        }
        that.sendProgress.value += chunkSize;
        that.sendChannel.send(stringToSendRepeatedly);
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




  /**
   * RECEIVER FUNCTION
   */


  gotRemoteStream(e) {
    //video.srcObject = e.stream;
    //video.src = URL.createObjectURL(e.stream);
    //let $this = ReactDOM.findDOMNode(this);
    //$video.srcObject = e.stream;
    //$video.srcObject = e.stream;

    this.$video.src = URL.createObjectURL(e.stream);

  }

  onCreateAnswerSuccess(desc) {
    this.peer.setLocalDescription(desc).then(
      () => {
        this.onSetLocalSuccess(desc);
      },
      this.onSetSessionDescriptionError
    );
  }

  /* datachannel sample */
  receiveChannelCallback(event) {

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

    let that = this;

    that.peer = new RTCPeerConnection(that.iceConfig);


    that.peer.onicecandidate = function(e) {
      that.onIceCandidate(e);
    };

    that.peer.oniceconnectionstatechange = function(e) {
      that.onIceStateChange(e);
    };


    if (that.channel == 'screen' || that.channel == 'all') {
      that.peer.onaddstream = that.gotRemoteStream.bind(that);
    }
    if (that.channel == 'data'|| that.channel == 'all'){
      that.peer.ondatachannel = that.receiveChannelCallback.bind(that);
    }



    that.ws.on('receiveOffer', function(desc, offer_id) {

      if(that.parterId != null) {
        console.log('이미 연결중임');
        return false;
      }

      that.parterId = offer_id;
      that.peer.setRemoteDescription(desc).then(
        that.onSetRemoteSuccess.bind(that),
        that.onSetSessionDescriptionError
      );
    });

    that.ws.on('receiveIceCandidate',function(candidate) {

      that.peer.addIceCandidate(
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

  onIceCandidate(event) {
    if (event.candidate) {
      this.ws.emit('sendIceCandidate', this.room, this.parterId,event.candidate);
    }
  }


  onSetLocalSuccess(desc) {
    console.log('setLocalDescription complete');
    // 성공 후 웹소켓으로 parter에게 sdp 전달
    let sendType = "sendOffer";
    if (this.type == 'receiver') {
      sendType = "sendAnswer";
    }
    this.ws.emit(sendType, this.room, this.parterId, desc);
  }


  onSetRemoteSuccess() {

    console.log('SETREMOTEDESCRIPTION COMPLETE');

    // setremotesdp 성공 후 createSdp 생성
    if (this.type == 'receiver') {
      this.peer.createAnswer().then(
        this.onCreateAnswerSuccess.bind(this),
        this.onCreateSessionDescriptionError
      );
    }
  }

  onIceStateChange(event) {
    console.log(this.peer.iceConnectionState);
    //console.log("AA",this.sendChannel.readyState);


    /*
    if (this.peer.iceConnectionState == 'disconnected') {
      this.peer.close();
    }
    */

    /*
    if (this.type == 'sender' && this.peer.iceConnectionState == 'connected') {
      this.sendChannel.send("CONNEDTD OK");
    }
    */


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

window.Jrtc = Jrtc;
