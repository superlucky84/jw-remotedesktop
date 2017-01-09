'use strict';

var $ = require('./dom-helper');

export default class Laserpointer {
  constructor(option) {

    this.emitter = option.emitter;

    this.scaleWrap = document.querySelector(".scale-wrap");
    this.screen = document.querySelector("#screen");

    this.power = false;

    this.background = document.createElement('div');
    this.background.className = 'laserpointer';
    this.background.id = 'laserpointer';
    this.background.style.width = this.screen.offsetWidth+"px";
    this.background.style.height = this.screen.offsetHeight+"px";
    this.background.tabIndex = 0;

    this.scaleWrap.appendChild(this.background);

    this.addEvent();

  }

  on() {
    this.power = true;
    $.addClass(this.background, 'show');

    this.emitter.emit('laserpointerToggle', this.power);
  }

  off() {
    this.power = false;
    $.removeClass(this.background, 'show');

    this.emitter.emit('laserpointerToggle', this.power);
  }

  start(evt) {

    this.emitter.emit('laserpointerUpdate','LaserPointer:Start', {
      'type': self.type,
      'x': evt.offsetX,
      'y': evt.offsetY
    });
  }

  end(evt) {

    this.emitter.emit('laserpointerUpdate','LaserPointer:End');
  }

  pos(evt) {


    this.emitter.emit('laserpointerUpdate','LaserPointer:Pos', {
      'positions': [{
        'x': evt.offsetX,
        'y': evt.offsetY
      }]
    });
  }

  addEvent() {

    let self = this;

    self.background.addEventListener('mousemove',(evt) => {

      if (evt.buttons == 1) {
        self.pos(evt);
      }
    });

    self.background.addEventListener('mousedown',(evt) => {

      self.start(evt);
    });

    self.background.addEventListener('mouseup',(evt) => {
      self.end(evt);

    });

    document.getElementById('lp-toggle').addEventListener('click',() => {
      if (this.power) {
        this.off();
      }
      else {
        this.on();
      }
    });

    document.getElementById("lp-type").addEventListener("change", function(){
      self.type = this.value;
    });
  }
}

