/**
 * laser pointer app
 * @version 1.0
 * @author  Jeong Heeju
 *
 * @module {function} laser-pointer
 * @requires module:dom-helper
 * @requires module:extend
 */
'use strict';

var $ = require('dom-helper')
  , extend = require('extend');

/**
 * laserpointer app for rsupport webviewer
 * @param {object}      option      options for laser pointer
 * @param {dataChannel} dataChannel webviewer dataChannel object
 * @constructor
 */
function LaserPointer(option, dataChannel) {
  option = extend(LaserPointer.defaultOption, option, true);

  this.type = parseInt(option.type);
  this.board = document.createElement('div');
  this.active = false;
  this.point = {x: 0, y: 0};
  this.viewer = null;

  $.css(this.board, {
    'position': 'absolute',
    'top'     : '0',
    'bottom'  : '0',
    'left'    : '0',
    'right'   : '0',
    'z-index' : '2',
    'outline' : 'none',
    'background-color': 'rgba(0,0,0,0)'
  });

  this.dataChannel = dataChannel;
}

/**
 * start app
 * @param  {LaserPointer} self LaserPointer object
 */
function start(self) {
  $.addClass(self.viewer, 'rswv-laserpointer-moving');
  self.dataChannel.send('LaserPointer:Start', {
    'type': self.type,
    'x': self.point.x,
    'y': self.point.y
  });
}

/**
 * end app
 * @param  {LaserPointer} self
 */
function end(self) {
  $.removeClass(self.viewer, 'rswv-laserpointer-moving');
  self.dataChannel.send('LaserPointer:End');
}

/**
 * change position laserpointer cursor
 * @param  {LaserPointer} self [description]
 */
function pos(self) {
  self.dataChannel.send('LaserPointer:Pos', {
    'positions': [{
      'x': self.point.x,
      'y': self.point.y
    }]
  });
}

/**
 * LaserPointer app on
 * @param  {object} data [description]
 */
LaserPointer.prototype.on = function(data) {
  if (this.active === true) {
    return;
  }
  this.active = true;
  this.viewer = data.viewer;
  $.addClass(this.viewer, 'rswv-laserpointer-on');
  $.appendTo(this.board, this.viewer);
};

/**
 * LaserPointer app update when update tick
 * @param  {object} mouse mouse info object
 */
LaserPointer.prototype.update = function(mouse) {
  if (this.active === false) {
    return;
  }

  this.point.x = mouse.screenX;
  this.point.y = mouse.screenY;

  if (mouse.screenDown['1'] === true && mouse.down['1'] == this.board) {
    start(this);
  }

  if (mouse.screenUp['1'] === true) {
    end(this);
  }

  if (mouse.move === true) {
    pos(this)
  }
};

/**
 * LaserPointer app off
 */
LaserPointer.prototype.off = function() {
  $.remove(this.board);
  $.removeClass(this.viewer, 'rswv-laserpointer-on');
  this.viewer = null;
  this.active = false;
};

/**
 * set pointer type
 * @param {number|string} type index of type
 */
LaserPointer.prototype.setType = function(type) {
  this.type = parseInt(type);
};

/**
 * Laser Pointer App 기본 옵션
 * @type {object}
 * @prop {number} type 레이저 포인터 모양  0: 화살표, 1: 빨간점
 */
LaserPointer.defaultOption = {
  'type': '0'
};

/**
 * @class
 */
module.exports = LaserPointer;
