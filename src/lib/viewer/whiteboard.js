'use strict';


import {Shape} from './shape';
import $ from './dom-helper';


export default class Whiteboard {

  constructor(option) {

    this.emitter = option.emitter;

    this.viewer = document.querySelector(".viewer");
    this.screen = document.querySelector("#screen");

    this.positions = [];

    this.point = {x:0, y:0};

    this.power = false;
    this.type = 0; // 0: free 1:직선 2:사각형 3:원형 4:화살표
    this.width = 3; // 선 두깨 1~5
    this.color = '#ff0000';

    this.ShpeType = {
      '0': 'free',
      '1': 'line',
      '2': 'rect',
      '3': 'circle',
      '4': 'arrow'
    };

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'whiteboard';
    this.canvas.id = 'whiteboard';
    this.canvas.width = this.viewer.scrollWidth;
    this.canvas.height = this.viewer.scrollHeight;

    this.canvas.tabIndex = 0;
    this.viewer.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.shape = null;

    this.addEvent();

  }

  on() {
    this.power = true;
    $.addClass(this.canvas, 'show');

    this.emitter.emit('whiteboardUpdate','Draw:Start');

  }

  off() {
    this.power = false;
    $.removeClass(this.canvas, 'show');

    this.emitter.emit('whiteboardUpdate','Draw:End');
  }

  drawFreeLineMove(evt) {

    let self = this;

    let x = evt.offsetX;
    let y = evt.offsetY;

    let last = this.positions.length - 1;

    if (last > 0) {
      self.context.save();
      self.context.moveTo(0,0);
      self.context.strokeStyle = self.color;
      self.context.lineWidth = self.width;
      self.context.lineJoin = 'round';
      self.context.beginPath();
      self.context.moveTo(self.positions[last].x, self.positions[last].y);
      self.context.lineTo(x, y);
      self.context.closePath();
      self.context.stroke();
      self.context.restore();
    }

    // 마지막에 배열에 넣어줌
    self.positions.push({
      'x': x,
      'y': y 
    });

  }


  drawShapeStart(evt) {

    let self = this;

    let x = evt.offsetX;
    let y = evt.offsetY;


    let type = self.ShpeType[self.type];
    if (self.type == '4') {
      type = self.ShpeType[1];
    }

    self.positions[0] = {
      'x': x,
      'y': y 
    };

    self.positions[1] = {
      'x': x,
      'y': y 
    };

    self.shape = new Shape(type, {
      'x1': x,
      'y1': y,
      'x2': x,
      'y2': y,
      'lineWidth': self.width,
      'strokeStyle': self.color
    });
  }

  drawShapeMove(evt) {

    let self = this;
    let x = evt.offsetX;
    let y = evt.offsetY;

    if (self.shape === null) {
      return;
    }

    self.positions[1] = {
      'x': x,
      'y': y 
    };

    self.shape.set({
      'x2': x,
      'y2': y 
    });


    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

    self.shape.draw(self.context);
    if (self.type == 4) {
      self.drawArrowHead();
    }

    self.shape.update();

  }

  drawArrowHead() {

    let self = this;

    var c = self.shape.getValue(['x1', 'y1', 'x2', 'y2']);
    if (c.y2 - c.y1 === 0 && c.x2 - c.x1 === 0) {
      return;
    }

    self.context.save();
    self.context.translate(c.x2, c.y2);
    self.context.rotate(Math.atan2(c.y2 - c.y1, c.x2 - c.x1));
    self.context.clearRect(-10, -self.width, 20, self.width * 2);
    self.context.beginPath();
    self.context.moveTo(0, 0);
    self.context.lineTo(-18 - self.width,  3 + self.width);
    self.context.lineTo(-18 - self.width, -3 - self.width);
    self.context.closePath();
    self.context.lineJoin = 'round';
    self.context.fillStyle = self.color;
    self.context.fill();
    self.context.restore();
  }




  addEvent() {

    let self = this;

    this.canvas.addEventListener('mousemove',(evt) => {

      if (evt.buttons != 1) {
        return false;
      }

      if (this.type == 0) {
        this.drawFreeLineMove(evt);
      }
      else {
        this.drawShapeMove(evt);
      }

    });

    document.getElementById("wb-type").addEventListener("change", function(){
      self.type = this.value;
    });

    document.getElementById("wb-width").addEventListener("change", function(){
      self.width = this.value;
    });

    document.getElementById("wb-color").addEventListener("change", function(){
      self.color = this.value;
    });

    this.canvas.addEventListener('mousedown',(evt) => {

      // 1. 스타일 세팅

      this.positions = [];


      if (this.type == 0) {
        this.drawFreeLineMove(evt);
      }
      else {
        this.drawShapeStart(evt);
      }


      this.emitter.emit('whiteboardUpdate','Draw:Info',{
        type: self.type,
        color: hexCodeToByte(self.color),
        thickness: self.width,
        realtime: 0 
      });

    });

    this.canvas.addEventListener('mouseup',(evt) => {


      self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

      this.emitter.emit('whiteboardUpdate','Draw:Data',{
        positions: self.positions
      });

    });

    document.getElementById('wb-toggle').addEventListener('click',() => {
      if (this.power) {
        this.off();
      }
      else {
        this.on();
      }
    });
  }
}

function hexCodeToByte(hex) {
  hex = hex.replace(/^#/, '');
  var r = 0, g = 0, b = 0;

  if (hex.length != 6) {

  }

  r = parseInt(hex.substr(0,2), 16);
  g = parseInt(hex.substr(2,2), 16);
  b = parseInt(hex.substr(4,2), 16);

  return b << 16 | g << 8 | r;
}



