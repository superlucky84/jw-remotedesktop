
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Host = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _robotjs = require('robotjs');

var _robotjs2 = _interopRequireDefault(_robotjs);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Host = exports.Host = function () {
  function Host(option) {
    _classCallCheck(this, Host);

    _robotjs2.default.setMouseDelay(1);
    _robotjs2.default.setKeyboardDelay(1);

    this.socketUrl = option.socketUrl;
    this.Jrtc = option.Jrtc;
    this.io = option.io;

    this.receiver = {};
    this.sourcesInfo = null;
    this.sender = {
      'screen-main': null
    };

    this.screens = _electron.screen.getAllDisplays();
    this.screenOption = {};
  }

  _createClass(Host, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.displayScreenBox();
      this.displayScreenImg();

      document.getElementById("ready").addEventListener('click', function () {
        _this.getStreamReady();
      });
    }
  }, {
    key: 'getStreamReady',
    value: function getStreamReady() {
      var self = this;

      var sources = this.sourcesInfo;

      sources.forEach(function (source) {
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
        }, function (sourceId, stream) {

          console.log("STREAM", sourceId, stream);

          if (self.sender['screen-main'] == null) {
            self.sender['screen-main'] = self.createSender('all', sources.length);
            self.sender['screen-main'].setEvent(stream, self.screenOption[sourceId]);
            self.sender['screen-main'].receiveCreateRtc = function (id, roomname) {
              self.receiveCreateRtc(id, roomname);
            };

            self.sender['screen-main'].join('screen-main', function (receveirIds) {
              receveirIds.forEach(function (id) {
                self.sender['screen-main'].createPeer(id);
                self.sender['screen-main'].createOffer(id);
              });
            });
          } else {
            self.sender['screen-main'].streamIds.push(stream.id);

            self.sender['screen-sub-' + stream.id] = self.createSender('screen', sources.length);
            self.sender['screen-sub-' + stream.id].setEvent(stream, self.screenOption[sourceId]);

            self.sender['screen-sub-' + stream.id].join('screen-sub-' + stream.id, function (receveirIds) {
              receveirIds.forEach(function (id) {
                self.sender['screen-sub-' + stream.id].createPeer(id);
                self.sender['screen-sub-' + stream.id].createOffer(id);
              });
            });
          }
        }.bind(this, source.id), self.handleError);
      });
    }
  }, {
    key: 'receiveCreateRtc',
    value: function receiveCreateRtc(id, roomname) {

      this.receiver[id] = new this.Jrtc('receiver', 'data', this.io.connect(socketUrl));

      // join 을 하면 센더에서 크레이트 피어를 합니다.
      this.receiver[id].join(roomname);

      var mouseDown = false;

      this.receiver[id].onReceiveMessageCallback = function (event) {
        var data = JSON.parse(event.data);

        console.log("va-", data);
        var option = [];

        if (data.isShift) option.push('shift');
        if (data.isCtrl) option.push('control');

        if (data.key == 'w' && data.isShift) {
          option = ['control'];
        }

        if (data.topic == 'KeyMouseCtrl:KeyEvent') {
          _robotjs2.default.keyToggle(data.key, data.down == 1 ? 'down' : 'up', option);
        }

        if (data.topic == 'KeyMouseCtrl:MouseEvent') {
          _robotjs2.default.moveMouse(data.x, data.y);

          if (!mouseDown && data.buttonMask == 1) {
            _robotjs2.default.mouseToggle("down");
            mouseDown = true;
          }

          if (mouseDown) {
            _robotjs2.default.dragMouse(data.x, data.y);
          }

          if (mouseDown && data.buttonMask == 0) {
            mouseDown = false;
          }

          if (data.buttonMask == 0) {
            _robotjs2.default.mouseToggle("up");
          }
        }
      };
    }
  }, {
    key: 'handleError',
    value: function handleError(e) {
      console.log(e);
    }
  }, {
    key: 'createSender',
    value: function createSender(channleType, length) {

      var videoElement = document.createElement("video");

      videoElement.style.width = parseInt(100 / length) + "%";

      var $VIDEOS = document.getElementById('VIDEOS');
      $VIDEOS.appendChild(videoElement);

      var sender = new this.Jrtc('sender', channleType, //all or screen
      this.io.connect(this.socketUrl), videoElement);

      return sender;
    }
  }, {
    key: 'displayScreenImg',
    value: function displayScreenImg() {
      var _this2 = this;

      _electron.desktopCapturer.getSources({ types: ['screen'] }, function (error, sources) {

        var IMGS = document.getElementById("IMGS");

        _this2.sourcesInfo = sources;

        sources.forEach(function (source) {

          var imgUrl = source.thumbnail.toDataURL();
          var img = document.createElement("img");

          img.src = imgUrl;
          img.style.width = "100px";
          img.style.marginRight = "10px";
          img.setAttribute("dragable", "true");

          img.id = source.id;

          img.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("target", event.target.id);
          });

          IMGS.appendChild(img);
        });
      });
    }
  }, {
    key: 'displayScreenBox',
    value: function displayScreenBox() {

      var self = this;

      this.screens.forEach(function (info) {

        var moniter = document.getElementById("MONITER");
        var div = document.createElement("div");

        div.style.position = "absolute";
        div.style.width = parseInt(info.bounds.width / 8) + "px";
        div.style.height = parseInt(info.bounds.height / 8) + "px";

        div.style.left = parseInt(info.bounds.x / 8) + "px";
        div.style.top = parseInt(info.bounds.y / 8) + "px";

        div.style.border = "1px solid #000";

        div.addEventListener('dragover', function (event) {
          event.preventDefault();
        });

        div.addEventListener("drop", function (event) {
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
          };

          event.currentTarget.appendChild(optionElement);
          event.preventDefault();
        });

        moniter.appendChild(div);
      });
    }
  }]);

  return Host;
}();