
'use strict';

import Emitter from './lib/viewer/emitter';
import $ from './lib/viewer/dom-helper';
import Mouse from './lib/viewer/mouse';
import Keyboard from './lib/viewer/keyboard';
import Scroller from './lib/viewer/scroller';
import Whiteboard from './lib/viewer/whiteboard';
import Laserpointer from './lib/viewer/laserpointer';
import Protocol from './lib/rc.protocol';
import Parser from './lib/rc.parser.client'; 

module.exports = class Viewer {

  constructor(option) {

    this.emitter = new Emitter();
    this.option = option;

    this.viewer = document.querySelector(".viewer");
    this.scaleArea = document.querySelector(".scale-wrap");

    this.started = false;
  }

  init(screenApp) {


    var self = this;

    this.mouse = new Mouse({
      'emitter': this.emitter
    });

    this.keyboard = new Keyboard({
      'emitter': this.emitter
    });

    this.emitter.on('keyboardUpdate', function(data) {

        //var protocol =  Protocol['data'];
        //var schema = protocol.get('KeyMouseCtrl:KeyEvent');
        //var packet = new Parser.Encoder(schema, data||{}).pack();
        //self.emitter.emit('dataSend',packet.buffer);

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

        var data = {
          buttonMask: mask,
          x: mouse.x,
          y: mouse.y
        };

        //var protocol =  Protocol['data'];
        //var schema = protocol.get('KeyMouseCtrl:MouseEvent');
        //var packet = new Parser.Encoder(schema, data||{}).pack();
        //self.emitter.emit('dataSend',packet.buffer);


        data.topic = 'KeyMouseCtrl:MouseEvent';
        console.log(data);
        self.emitter.emit('dataSend', JSON.stringify(data));

      }
    });

    this.emitter.on('whiteboardUpdate', function(topic,data) {

      if (!data) {
        data = {};
      }

      //var protocol =  Protocol['data'];
      //var schema = protocol.get(topic);
      //var packet = new Parser.Encoder(schema, data||{}).pack();



      data.topic = topic;
      console.log(data);
      self.emitter.emit('dataSend', JSON.stringify(data));

    });


    this.emitter.on('laserpointerUpdate', function(topic,data) {

      if (!data) {
        data = {};
      }

      //var protocol =  Protocol['data'];
      //var schema = protocol.get(topic);
      //var packet = new Parser.Encoder(schema, data||{}).pack();

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
      this.whiteboard = new Whiteboard({
        'emitter': this.emitter
      });
      this.laserpointer = new Laserpointer({
        'emitter': this.emitter
      });
      self.setScale(1);

    },4000);


    document.getElementById("scale-range").addEventListener('change', function () {

      let scale = this.value;
      self.setScale(scale);

    });


  }

  setScale(scale) {
    let self = this;

    let screen = self.viewer.querySelector("video");
    let laserpointer = self.viewer.querySelector("#laserpointer");
    let whiteboard = self.viewer.querySelector("#whiteboard");

    screen.style.transform = `scale(${scale})`;
    screen.style.transformOrigin = 'left top';

    laserpointer.style.transform = `scale(${scale})`;
    laserpointer.style.transformOrigin = 'left top';

    whiteboard.style.transform = `scale(${scale})`;
    whiteboard.style.transformOrigin = 'left top';

    document.querySelector(".display-scale").innerHTML = parseInt(scale*100);

    self.scaleArea.style.width = Number(screen.offsetWidth * scale)+"px";
    self.scaleArea.style.height = Number(screen.offsetHeight * scale)+"px";

    self.scroller.makeScrollPosition();
    self.scroller.setScrollTop();

  }


  stop() {
    this.emitter.emit('stop');
  }


}




