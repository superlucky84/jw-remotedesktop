
'use strict';

import Emitter from './lib/viewer/emitter';
import $ from './lib/viewer/dom-helper';
import Mouse from './lib/viewer/mouse';
import Keyboard from './lib/viewer/keyboard';
import Scroller from './lib/viewer/scroller';
import Whiteboard from './lib/viewer/whiteboard';
//import Protocol from './lib/rc.protocol';
//import Parser from './lib/rc.parser.client'; 

module.exports = class Viewer {

  constructor(option) {

    this.emitter = new Emitter();
    this.option = option;


    this.canvas = document.createElement('canvas');
    this.canvas.className = 'rswv-screen';
    this.canvas.tabIndex = 0;

    this.started = false;
  }

  init(screenApp) {

    let $viewer = document.querySelector(".viewer");

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


    setTimeout(()=>{
      this.scroller = new Scroller({
        'bounding': { 'X': 0, 'Y': 100 }
      });
      this.whiteboard = new Whiteboard({
        'emitter': this.emitter
      });
    },4000);

  }


  stop() {
    this.emitter.emit('stop');
  }

  setScale(scale) {
    this.canvasDraw.setScale(scale);
  }

}




