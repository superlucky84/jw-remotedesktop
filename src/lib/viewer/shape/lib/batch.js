/**
 * rect shape 동시 처리 모듈
 * @version 1.0
 * @author  Jeong Heeju
 * @module  {function} shape/lib/batch
 * @requires module:shape/lib/shape
 * @requires module:emitter
 */
'use strict';

var Shape = require('./shape.js')
  , setImmediate = require('setImmediate');

require('../../emitter')(Batch.prototype);

/**
 * Shape 객체 일괄 처리
 * @param {object}      datas                 일괄처리할 shape, texture 모음
 * @param {object[]}    datas.rects           생성할 rect 정보 모음
 * @param {string}      datas.rects.type      rect type. 'scrren', etc
 * @param {number}      datas.rects.x1        coordinate x1
 * @param {number}      datas.rects.y1        coordinate y1
 * @param {number}      datas.rects.x2        coordinate x2
 * @param {number}      datas.rects.y2        coordinate y2
 * @param {number}      datas.rects.texture   사용할 texture index
 * @param {object[]}    datas.textures        rect에 사용할 texture 정보 모음
 * @param {number}      datas.textures.index  texture index
 * @param {img|canvas}  datas.textures.img    texture로 사용할 image 또는 canvas
 * @param {number}      [datas.centerX]       shape모음 center 좌표 x
 * @param {number}      [datas.centerY]       shape모음 center 좌표 y
 * @param {Draw}        drawObj               canvas에 그리는 역할의 object
 * @constructor
 */
export default function Batch(datas, drawObj) {
  this.drawObj = drawObj;
  this.canvas = drawObj.canvas;
  this.contextType = drawObj.contextType;
  this.started = false;

  init(this, datas);
}

/**
 * shpae, texture 생성 및 batch 초기화
 * @param  {Batch}  self
 * @param  {object} datas @see Batch datas param
 * @return {null}
 */
function init(self, datas) {
  self.rects = [];
  // self.screenRect = [];

  var rects = datas.rects
    , values = {}
    , x = []
    , y = []
    , textureIndex;

  for (var i = 0; i < rects.length; i++) {
    self.rects[i] = new Shape('rect', {
      x1: rects[i].x1,
      x2: rects[i].x2,
      y1: rects[i].y1,
      y2: rects[i].y2
    });

    self.rects[i].index = i;
    self.rects[i].data = rects[i];

    datas.textures[rects[i].texture].type = rects[i].type;
    // console.log(datas.textures[rects[i].texture].index)
    textureIndex = datas.textures[rects[i].texture].index;

    if (rects[i].type === 'screen') {
      // self.screenRect[index] = self.rects[i];
      self.screenRect = self.rects[i];
    }

    x.push(rects[i].x1, rects[i].x2);
    y.push(rects[i].y1, rects[i].y2);
  }

  values.x1 = Math.min.apply(null, x);
  values.y1 = Math.min.apply(null, y);
  values.x2 = Math.max.apply(null, x);
  values.y2 = Math.max.apply(null, y);

  self.centerX = values.centerX =
    (datas.centerX === undefined) ? (values.x2 - values.x1) / 2 : datas.centerX;

  self.centerY = values.centerY =
    (datas.centerY === undefined) ? (values.y2 - values.y1) / 2 : datas.centerY;

  setValue(self, {
    centerX: self.centerX,
    centerY: self.centerY
  });

  self.drawObj.setupRects(self.rects);
  self.drawObj.loadTextures(datas.textures, function(result) {
    setImmediate(function() {
      self.emit('textureLoadEnd');
      if (self.started === false) {
        self.emit('start');
        self.started = true;
      }
    });
  });

  /**
   * rect 통합한 bounding rect
   * @type {Shape}
   */
  self.integratedRect = new Shape('rect', values);
}

/**
 * shape 에 변화된 값 일괄 적용
 * @param {Batch}   self
 * @param {object}  vals 변경할 값 @see Shape changeableShapeVars
 */
function setValue(self, vals) {
  for (var i = 0; i < self.rects.length; i++) {
    self.rects[i].setValue(vals);
  }
}

/**
 * Batch object에서 값 얻기
 * @param  {string} vals 변수 name
 * @return {*}           얻어진 값
 */
Batch.prototype.getValue = function(vals) {
  return this.integratedRect.getValue(vals);
}

/**
 * 바꿀 값 일괄 적용
 * @param {object}   toVars     변경할 값 @see Shape changeableShapeVars
 * @param {number}   [duration] animation duration. 0 or undefined is no animation
 * @param {Function} [callback] callback after animation end
 */
Batch.prototype.set = function(toVars, duration, callback) {
  this.integratedRect.set(toVars, duration, callback);
  for (var i = 0; i < this.rects.length; i++) {
    this.rects[i].set(toVars, duration, callback);
  }
}

/**
 * shape 일괄 update
 * update tic 때마다 호출
 * @param   {object} [values] 변경할 값 @see Shape changeableShapeVars
 * @return  {null}
 */
Batch.prototype.update = function(values) {
  this.integratedRect.update(values);
  for (var i = 0; i < this.rects.length; i++) {
    this.rects[i].update(values);
  }
}

/**
 * canvas에 일괄 그리기.
 * draw tic마다 호출
 * @return {null}
 */
Batch.prototype.draw = function() {
  // var transformValues = this.integratedRect.getValue(['scaleX', 'rotate', 'drawGapX', 'drawGapY']);
  this.drawObj.drawRects(
    this.rects,
    this.integratedRect.getValue(['scaleX', 'rotate', 'drawGapX', 'drawGapY'])
  );
}

/**
 * 특정 rect에 대한 상대 좌표값 구하기
 * @param  {number} rectIndex rect shape id
 * @param  {number}         x  pointer x
 * @param  {nymber}         y  pointer y
 * @return {boolean|object}    좌표가 도형안에 있으면 상대 좌표, 없으면 false
 */
Batch.prototype.contains = function(rectIndex, x, y) {
  return this.rects[rectIndex].contains(x, y);
}

/**
 * batch가 바뀔때 다시 설정.
 * @param  {object} datas @see Batch datas param
 * @return {null}
 */
Batch.prototype.changeRects = function(datas) {
  this.drawObj.clearRects();
  this.drawObj.clearTextures();
  init(this, datas);
}

/**
 * 특정 index의 rect texture를 update
 * @param  {number} rect index
 * @return {null}
 */
Batch.prototype.updateTexture = function(index) {
  this.drawObj.refreshTexture(this.rects[index].data.texture);
}

/**
 * @class
 */
