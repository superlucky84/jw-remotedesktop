
'use strict';

import robot from 'robotjs';
import {desktopCapturer, screen} from 'electron';


export class Host {

  constructor(option) {

    robot.setMouseDelay(1);
    robot.setKeyboardDelay(1);

    this.socketUrl = option.socketUrl;
    this.Jrtc = option.Jrtc;
    this.io = option.io;

    this.receiver = {};
    this.sourcesInfo = null;
    this.sender = {
      'screen-main': null
    };

    this.screens = screen.getAllDisplays();
    this.screenOption = {};


  }

  init() {

    this.displayScreenBox();
    this.displayScreenImg();

    document.getElementById("ready").addEventListener('click', () => {
      this.getStreamReady();
    });
  }

  getStreamReady() {
      let self = this;

      let sources = this.sourcesInfo;

      sources.forEach(function(source) {
        console.log(source);

        navigator.webkitGetUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: self.screenOption[source.id].width,
              maxWidth: self.screenOption[source.id].width,
              minHeight: self.screenOption[source.id].height,
              maxHeight: self.screenOption[source.id].height
            }
          }
        },
        function(sourceId, stream) {

          console.log("STREAM",sourceId,stream);

          if (self.sender['screen-main'] == null) {
            self.sender['screen-main'] = self.createSender('all', sources.length);
            self.sender['screen-main'].setEvent(stream, self.screenOption[sourceId]);
            self.sender['screen-main'].receiveCreateRtc = (id, roomname) => {
              self.receiveCreateRtc(id, roomname);
            }

            self.sender['screen-main'].join('screen-main', function(receveirIds) {
              receveirIds.forEach(function(id) {
                self.sender['screen-main'].createPeer(id);
                self.sender['screen-main'].createOffer(id);
              });
            });

          }
          else {
            self.sender['screen-main'].streamIds.push(stream.id);

            self.sender['screen-sub-'+stream.id] = self.createSender('screen', sources.length);
            self.sender['screen-sub-'+stream.id].setEvent(stream, self.screenOption[sourceId]);

            self.sender['screen-sub-'+stream.id].join('screen-sub-'+stream.id, function(receveirIds) {
              receveirIds.forEach(function(id) {
                self.sender['screen-sub-'+stream.id].createPeer(id);
                self.sender['screen-sub-'+stream.id].createOffer(id);
              });
            });
          }
        }.bind(this, source.id), 
        self.handleError);
      });


  }

  receiveCreateRtc(id, roomname) {

      this.receiver[id] = new this.Jrtc( 'receiver', 'data', this.io.connect(socketUrl));


      // join 을 하면 센더에서 크레이트 피어를 합니다.
      this.receiver[id].join(roomname);

      let mouseDown = false;

      this.receiver[id].onReceiveMessageCallback = function(event) {
        let data = JSON.parse(event.data);

        console.log("va-",data);
        let option = [];


        if (data.isShift) option.push('shift');
        if (data.isCtrl) option.push('control');

        if (data.key == 'w' && data.isShift) {
          option = ['control'];
        }


        if (data.topic == 'KeyMouseCtrl:KeyEvent') {
          robot.keyToggle(
              data.key, 
              (data.down==1)?'down':'up',
              option
          );
        }


        if (data.topic == 'KeyMouseCtrl:MouseEvent') {
          robot.moveMouse(data.x, data.y);

          if (!mouseDown && data.buttonMask == 1) {
            robot.mouseToggle("down");
            mouseDown = true;
          }

          if (mouseDown) {
            robot.dragMouse(data.x,data.y);
          }

          if (mouseDown && data.buttonMask == 0) {
            mouseDown = false;
          }

          if (data.buttonMask == 0)  {
            robot.mouseToggle("up");
          }
        }
      }

  }

  handleError(e) {
    console.log(e)
  }

  createSender(channleType, length) {

    let videoElement = document.createElement("video");

    videoElement.style.width = parseInt(100/length)+"%";

    let $VIDEOS = document.getElementById('VIDEOS');
    $VIDEOS.appendChild(videoElement);


    let sender = new this.Jrtc(
        'sender',
        channleType, //all or screen
        this.io.connect(this.socketUrl),
        videoElement
    );

    return sender;

  }

  displayScreenImg() {

    desktopCapturer.getSources({types: ['screen']}, (error, sources) => {

      let IMGS = document.getElementById("IMGS");

      this.sourcesInfo = sources;

      sources.forEach(function(source) {

        let imgUrl = source.thumbnail.toDataURL();
        let img = document.createElement("img");

        img.src = imgUrl;
        img.style.width = "100px";
        img.style.marginRight = "10px";
        img.setAttribute("dragable","true");

        img.id = source.id;

        img.addEventListener("dragstart", function(event) {
          event.dataTransfer.setData("target", event.target.id);
        });

        IMGS.appendChild(img);
      });



    });

  }

  displayScreenBox() {

    let self = this;

    this.screens.forEach(function(info) {

      let moniter = document.getElementById("MONITER");
      let div = document.createElement("div");

      div.style.position = "absolute";
      div.style.width  =  parseInt(info.bounds.width / 8)+"px";
      div.style.height =  parseInt(info.bounds.height / 8)+"px";

      div.style.left =  parseInt(info.bounds.x / 8)+"px";
      div.style.top  =  parseInt(info.bounds.y / 8)+"px";

      div.style.border = "1px solid #000";

      div.addEventListener('dragover', function(event) {
        event.preventDefault();
      });

      div.addEventListener("drop", function(event) {
        console.log('drop', event);

        //dataTransfer 객체로 부터 데이터를 꺼내옴
        var id = event.dataTransfer.getData("target");
        var optionElement = document.getElementById(id);
        optionElement.parentNode.removeChild(optionElement);
        optionElement.style.width = "100%";

        self.screenOption[id] = {
          "width": info.bounds.width,
          "height": info.bounds.height,
          "x": info.bounds.x,
          "y": info.bounds.y
        }


        event.currentTarget.appendChild(optionElement);
        event.preventDefault();
      });


      moniter.appendChild(div);

    });

  }

}




