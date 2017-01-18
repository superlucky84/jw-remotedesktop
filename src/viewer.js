
'use strict';

import Emitter from './lib/viewer/emitter';
import $ from './lib/viewer/dom-helper';
import Mouse from './lib/viewer/mouse';
import Keyboard from './lib/viewer/keyboard';
import Scroller from './lib/viewer/scroller';
import Whiteboard from './lib/viewer/whiteboard';
import Laserpointer from './lib/viewer/laserpointer';

module.exports = class Viewer {

  constructor(option) {

    this.emitter = new Emitter();
    this.option = option;


    this.viewerWrap = document.querySelector(".viewer-wrap");
    this.viewer = document.querySelector(".viewer");
    this.scaleArea = document.querySelector(".scale-wrap");

    this.scale = 1;
    this.fullscreen = false;

    this.mouse = new Mouse({
      'emitter': this.emitter
    });

    this.screenOption = {};

  }

  init(screenApp) {

    var self = this;

    this.keyboard = new Keyboard({
      'emitter': this.emitter
    });

    this.emitter.on('keyboardUpdate', function(data) {


      data.topic = 'KeyMouseCtrl:KeyEvent';
      console.log(data);
      self.emitter.emit('dataSend', JSON.stringify(data));

    });


    this.emitter.on('mouseUpdate', function() {

      var mouse = self.mouse.state.mouse;
      if (mouse !== false) {

        var mask = 0;
        if (mouse.buttons !== undefined) {
          for (var i = 0; i < mouse.buttons.length; i++) {
            mask += 1 << (mouse.buttons[i] - 1);
          }
        }


        let screenId = self.viewer.querySelector(".screen.show").id;


        var data = {
          buttonMask: mask,
          x: mouse.x + self.screenOption[screenId].x,
          y: mouse.y + self.screenOption[screenId].y
        };



        data.topic = 'KeyMouseCtrl:MouseEvent';
        console.log(data);
        self.emitter.emit('dataSend', JSON.stringify(data));

      }
    });

    this.emitter.on('whiteboardUpdate', function(topic,data) {

      if (!data) {
        data = {};
      }

      data.topic = topic;
      console.log(data);
      self.emitter.emit('dataSend', JSON.stringify(data));

    });


    this.emitter.on('laserpointerUpdate', function(topic,data) {

      if (!data) {
        data = {};
      }

      data.topic = topic;
      console.log(data);
      self.emitter.emit('dataSend', JSON.stringify(data));

    });

    this.emitter.on('whiteboardToggle', (power) => {

      document.querySelector(".display-whiteboard").innerHTML = (power)?'on':'off';

      if (power == true && this.laserpointer.power == true) {
        this.laserpointer.off();
      }

    });

    this.emitter.on('laserpointerToggle', (power) => {

      document.querySelector(".display-laserpointer").innerHTML = (power)?'on':'off';

      if (power == true && this.whiteboard.power == true) {
        this.whiteboard.off();
      }

    });


    setTimeout(()=>{
      this.scroller = new Scroller({
        'bounding': { 'X': 0, 'Y': 100 }
      });
      /*
      this.whiteboard = new Whiteboard({
        'emitter': this.emitter,
      });
      this.laserpointer = new Laserpointer({
        'emitter': this.emitter
      });
      */
      self.setScale(1);
    },3000);


    document.getElementById("scale-range").addEventListener('change', function () {

      let scale = this.value;
      self.setScale(scale);
    });


    document.getElementById("screenshot").addEventListener('click', function() {

      let screen = self.viewer.querySelector(".screen.show");
      let canvas = document.createElement('canvas');

      canvas.width = screen.offsetWidth;
      canvas.height = screen.offsetHeight;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(screen, 0, 0, canvas.width, canvas.height);

      let dataURI = canvas.toDataURL('image/jpeg');

      let link = document.createElement('a');
      link.href = dataURI;
      link.download = "output.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    });

    this.scaleArea.addEventListener('transitionend', () => {
      console.log('transitionend-');
      self.scroller.makeScrollPosition();
      self.scroller.setScrollTop();
    })

    document.getElementById("viewer-fullscreen").addEventListener('click', () => {
      self.toggleFullScreen();
    });






    window.addEventListener('resize',function() {

      self.changeCenter();

      if( window.innerHeight == screen.height) {
        self.setFullScreen(true);
      }
      else {
        console.log('isnot---fullscreen');
        self.setFullScreen(false);
      }

    });





  }

  setFullScreen(isfullscreen) {

    this.fullscreen = isfullscreen;

    let toolbox = document.getElementById("toolbox");

    if (isfullscreen) {

      $.addClass(toolbox, 'fullscreen');
      $.addClass(this.viewerWrap, 'fullscreen');

      this.setScale(this.scale);
    }
    else {

      $.removeClass(toolbox, 'fullscreen');
      $.removeClass(this.viewerWrap, 'fullscreen');
      this.setScale(this.scale);

    }
  }

  toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }



  changeCenter() {

    let self = this;

    let screen = self.viewer.querySelector(".screen.show");

    let marginHeight = (self.viewer.offsetHeight - Number(screen.offsetHeight * self.scale)) / 2;

    if (marginHeight <= 0) {
      marginHeight = 0;
    }
    self.scaleArea.style.top = marginHeight+"px";

  }

  setScale(scale) {


    let self = this;
    self.scale = scale;

    let screen = self.viewer.querySelector(".screen.show");
    //let laserpointer = self.viewer.querySelector("#laserpointer");
    //let whiteboard = self.viewer.querySelector("#whiteboard");

    screen.style.transform = `scale(${scale})`;
    screen.style.transformOrigin = 'left top';

    //laserpointer.style.transform = `scale(${scale})`;
    //laserpointer.style.transformOrigin = 'left top';

    //whiteboard.style.transform = `scale(${scale})`;
    //whiteboard.style.transformOrigin = 'left top';

    document.querySelector(".display-scale").innerHTML = parseInt(scale*100);


    self.scaleArea.style.width = Number(screen.offsetWidth * scale)+"px";
    self.scaleArea.style.height = Number(screen.offsetHeight * scale)+"px";


    self.changeCenter();


  }

  addMouseEvent(videoElement) {
    this.mouse.addMouseListeners(videoElement);
  }

  addScreenOption(screenId, screenOption) {
    this.screenOption[screenId] = screenOption;
  }


  stop() {
    this.emitter.emit('stop');
  }


}




