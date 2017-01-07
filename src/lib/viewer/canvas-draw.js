/**
 * rsupport webviewer canvas에 device그리는 모듈
 * @version 1.0
 * @author  Jeong Heeju
 *
 * @module {function} viewer/lib/canvas-draw
 * @requires module:shape
 */
'use strict';

var Shape = require('./shape');

/**
 * Canvas draw 객체
 * @param {object} option
 * @param {canvas} option.canvas       webviewer canvas element
 * @param {Screen} option.screen       webviewer screen 모둘 객체
 * @param {number} option.viewerWidth  webviewer viewer 너비
 * @param {number} option.viewerHeight webviewer viewer 높이
 * @param {object} option.option       @see Viewer.defaultOption.canvasDraw
 * @constructor
 */
function CanvasDraw(option) {
  this.canvas = option.canvas;
  this.screen = option.screen;
  this.option = option.option;
  this.device = null;

  // this.margin = 0;
  this.deviceWidth = 0;
  this.deviceHeight = 0;
  this.viewerWidth = option.viewerWidth;
  this.viewerHeight = option.viewerHeight;
  this.centerX = 0;
  this.centerY = 0;
  this.scrollX = 0;
  this.scrollY = 0;
  this.scrolledX = 0;
  this.scrolledY = 0;
  this.degrees = 0;
  this.scale = this.option.scale; //0: auto, -1: mag, < 0 scale~
  this.currentScale = this.option.scale;

  this.drawObj = new Shape.Draw(this.canvas, {
    'context': this.option.context,
    'contextOption': this.option.contextOption
  });

  this.device = new Shape.Batch(getScreenRect(this.screen.canvas), this.drawObj);

  init(this);

  var self = this;

  self.device.on('textureLoadEnd', function() {
    self.centerX = self.device.getValue('centerX');
    self.centerY = self.device.getValue('centerY');
    self.deviceWidth = self.device.getValue('width');
    self.deviceHeight = self.device.getValue('height');

    var setValue = getTranslate(self);
    setValue.scale = getTargetScale(self);
    self.device.set(setValue);
    self.bounding = self.device.integratedRect.bounding;
  });

  self.screen.on('screenUpdate', function(rects) {
    self.device.updateTexture(self.screenRect.index, self.screen.canvas);
  });

  self.screen.on('screenChange', function() {
    self.device.changeRects(getScreenRect(self.screen.canvas));
    init(self);
  });
}

/**
 * canvas draw 초기화
 * @param  {CanvasDraw} self [description]
 * @param  {object}     data [description]
 * @return {null}
 */
function init(self, data) {
  self.bounding = self.device.integratedRect.bounding;
  self.screenBounding = self.device.screenRect.bounding;
  self.rects = self.device.rects;
  self.screenRect = self.device.screenRect;
}

/**
 * canvas를 가지고 Shape.Batch에 사용할 형식으로 전환
 * @param   {canvas}   canvas
 * @return  {object}                  @see Properties
 * @prop    {object[]} textures       texture정보 모음
 * @prop    {number}   textures.index texture index '0'
 * @prop    {canvas}   textures.img   texture로 사용할 canvas
 * @prop    {object[]} rects          생성할 Shpae rect 모음
 * @prop    {string}   rects.type     rect type 'screen'
 * @prop    {number}   rects.x1       rect x1 좌표
 * @prop    {number}   rects.y1       rect y1 좌표
 * @prop    {number}   rects.x2       rect x2 좌표
 * @prop    {number}   rects.y2       rect y2 좌표
 * @prop    {number}   rects.texture  사용할 texture id '0'
 */
function getScreenRect(canvas) {
  return {
    'textures': [
      {
        'index': 0,
        'img': canvas
      }
    ],
    'rects': [
      {
        'type': 'screen',
        'x1': 0,
        'y1': 0,
        'x2': canvas.width,
        'y2': canvas.height,
        'texture': 0
      }
    ]
  };
}

/**
 * 현재 device의 scale값 구하기
 * @param  {CanvasDraw} self
 * @return {number}          현재 device scale
 */
function getTargetScale(self) {
  var scale = 1;
  if (self.scale > 0) {
    scale = self.scale;
  }
  else {
    var viewerRatio = self.viewerWidth / self.viewerHeight
      , deviceRatio = self.deviceWidth / self.deviceHeight;

    if (viewerRatio > deviceRatio) {
      scale = self.viewerHeight / self.deviceHeight;
    } else {
      scale = self.viewerWidth / self.deviceWidth;
    }
    if (self.scale === 0 && scale > 1) {
      scale = 1;
    }
  }

  self.currentScale = scale;

  return scale;
}

/**
 * 중앙 정렬을 위한 translate 값 구하기
 * @param  {CanvasDraw} self
 * @return {object}                 @see Properties
 * @prop   {object}     translateX  움직여야할 x 값
 * @prop   {object}     translateY  움직여야할 y 값
 */
function getTranslate(self) {
  var bounding = self.device.integratedRect.bounding
    , deviceRealWidth = bounding.x2 - bounding.x1
    , deviceRealHeight = bounding.y2 - bounding.y1
    , translateX, translateY;

  if (deviceRealWidth > self.viewerWidth) {
    translateX = (deviceRealWidth - self.deviceWidth) / 2;
    translateX -= (self.scrollX) * (deviceRealWidth - self.viewerWidth) ;
  } else {
    translateX = self.viewerWidth / 2 - self.centerX;
  }

  if (deviceRealHeight > self.viewerHeight) {
    translateY = (deviceRealHeight - self.deviceHeight) / 2;
    translateY -= (self.scrollY) * (deviceRealHeight - self.viewerHeight);
  } else {
    translateY = self.viewerHeight / 2 - self.centerY;
  }

  return {
    'translateX': Math.round(translateX),
    'translateY': Math.round(translateY)
  };
}

/**
 * 디바이스 transform변경
 * @param  {CanvasDraw} self
 * @param  {object}     data        transform 값
 * @param  {number}     data.scale  변경할 scale값
 * @param  {function}   callback    animate 끝난 후 callback
 * @return {null}
 */
function transform(self, data, callback) {
  self.device.set(data, self.option.duration, function () {
    self.degrees = self.degrees % 360;
    if (callback !== undefined && typeof callback === 'function') {
      callback(self);
    }
  });
}

/**
 * CanvasDraw module update
 * update tic마다 실행
 * @param  {object} data
 * @param  {number} data.viewerWidth   webviewer viewer 너비
 * @param  {number} data.viewerHeight  webviewer viewer 높이
 * @param  {number} data.scrollX       canvas device scroll x
 * @param  {number} data.scrollY       canvas device scroll y
 * @return {null}
 */
CanvasDraw.prototype.update = function (data) {
  if (this.device === null) {
    return false;
  }

  this.viewerWidth = data.viewerWidth;
  this.viewerHeight = data.viewerHeight;
  this.device.update({
    'scale': getTargetScale(this)
  });

  // this.scrollX = data.scrollX / this.scale;
  // this.scrollY = data.scrollY / this.scale;

  this.scrollX = data.scrollX;
  this.scrollY = data.scrollY;

  this.device.update(getTranslate(this));

  this.bounding = this.device.integratedRect.bounding;
  this.screenBounding = this.device.screenRect.bounding;

  if (this.device.integratedRect.transitionEnd === undefined && this.transitionEnd === false) {
    this.transitionEnd = true;
  } else {
    this.transitionEnd = this.device.integratedRect.transitionEnd;
  }
};

/**
 * CanvasDraw module draw
 * draw tic마다 실행
 * @return {null}
 */
CanvasDraw.prototype.draw = function () {
  this.device.draw();
};

/**
 * canvas device의 scale변경
 * @param {number} scale @see Viewer.defaultOption.canvasDraw.scale
 */
CanvasDraw.prototype.setScale = function (scale) {
  this.scale = Number(scale);
  transform(this, { scale: getTargetScale(this) });
};

/**
 * 현재 device scale 얻기
 * @return {number} 현재 scale
 */
CanvasDraw.prototype.getCurrentScale = function () {
  return this.currentScale;
};

// function getScreenMousePoint(self, input) {
//   var screenMouseCoord = self.device.contains(self.device.screenRect.index, input.mouse.x, input.mouse.y);
//   if (screenMouseCoord !== false) {
//     self.screenMousePoint.x = screenMouseCoord.x;
//     self.screenMousePoint.y = screenMouseCoord.y;
//     console.log(self.screenMousePoint);
//   }
//   // if (input === false) {
//   //   return;
//   // }

//   // if (input.mouse !== undefined) {
//   // }

//   // if (input.key !== undefined) {
//   //   console.log(input.key.buttons, input.key.up, input.key.down);
//   // }
// }

/**
 * @class
 */
module.exports = CanvasDraw;
