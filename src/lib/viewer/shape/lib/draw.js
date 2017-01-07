/**
 * Shape Batch를 canvas에 2d나 webgl로 그려주는 모듈
 * @version 1.0
 * @author  Jeong Heeju
 * @module  {function} shape/lib/draw
 * @requires module:extend
 */
'use strict';

var extend = require('extend');

/**
 * vertex shader 소스
 * @type {Array}
 */
var vertexShaderSrc = [
  "attribute vec2 a_position;",
  "attribute vec2 a_texCoord;",
  "uniform vec2 u_resolution;",
  "uniform vec2 u_translation;",
  "uniform float u_angle;",
  "uniform float u_scale;",
  "varying vec2 v_texCoord;",
  "void main() {",
  "  float rad = -radians(u_angle); // * 0.01745329251;",
  "  float s = sin(rad);",
  "  float c = cos(rad);",
  "  vec2 position = vec2(",
  "    a_position.x * c + a_position.y * s,",
  "    a_position.y * c - a_position.x * s",
  "  );",
  "  position = ((position * vec2(u_scale, u_scale) + u_translation) / u_resolution) * 2.0 - 1.0;",
  "  gl_Position = vec4(position * vec2(1, -1), 0, 1);",
  "  v_texCoord = a_texCoord;",
  "}"
];

/**
 * fragmentShader 소스
 * @type {Array}
 */
var fragmentShaderSrc = [
  "precision mediump float;",
  "uniform sampler2D u_sampler;",
  "varying vec2 v_texCoord;",
  "void main() {",
  "  gl_FragColor = texture2D(u_sampler, v_texCoord);",
  "}"
];

var BPE = Float32Array.BYTES_PER_ELEMENT;

/**
 * Shape Batch를 canvas에 그리는 객체
 * @param {canvas} canvas               draw할 canavs
 * @param {object} option               canvas context options
 * @param {string} option.context       context type. '2d' or 'webgl'
 * @param {object} option.contextOption context options for webgl
 * @constructor
 */
export default function Draw(canvas, option) {
  this.canvas = canvas;

  this.option = extend({
    'context': 'webgl',
    'contextOption': {
      'alpha': true,
      'depth': true,
      'stencil': false,
      'antialias': true,
      'premultipliedAlpha': false,
      'preserveDrawingBuffer': false
    }
  }, option, true);

  this.textures = [];

  // get context
  var self = this
    , useWebgl = false;

  var createWebgl = (function() {
    try {
      return !!(window.WebGLRenderingContext && (
        self.gl =
          self.canvas.getContext('webgl', self.option.contextOption) ||
          self.canvas.getContext('experimental-webgl', self.option.contextOption)
      ));
    } catch (e) {
      return false;
    }
  });

  if (this.option.context === 'webgl') {
    useWebgl = createWebgl();
  }

  // 2d
  if (useWebgl === false) {
    this.context = this.canvas.getContext('2d', { 'alpha': this.option.contextOption.alpha });
    this.contextType = '2d';
    this.func = {
      'setupTexture'       : setup2dTexture,
      'updateCanvasTexture': update2dCanvasTexture,
      'deleteTexture'      : delete2dTexture,
      'drawRects'          : draw2dRects
    };
  }
  // webgl
  else {
    initWebgl(this);
    this.contextType = 'webgl';
    this.func = {
      'setupTexture'       : setupWebglTexture,
      'updateCanvasTexture': updateWebglCanvasTexture,
      'deleteTexture'      : deleteWebglTexture,
      'drawRects'          : drawWebglRects
    };
  }
}

/**
 * 텍스쳐 image load하기
 * @param  {Draw}       self    그리기 object
 * @param  {img|canvas} texture 택스쳐로 사용할 image나 canvas
 * @return {null}
 */
function loadTextureImage(self, texture) {
  var image = new Image();

  image.onload = function() {
    texture.texture = image;
    self.func.setupTexture(self, texture);
    image = null;
  }

  image.src = texture.img;
}

/**
 * texture가 모두 onload 되면 callback실행
 * @param  {Draw} self
 * @return {null}
 */
function completeTextureLoad(self) {
  if (self.textureSetupCount !== undefined && --self.textureSetupCount === 0) {
    delete self.textureSetupCount;
    if (self.loadTextureCallback !== undefined) {
      if (typeof self.loadTextureCallback === 'function') {
        self.loadTextureCallback(self.textures);
      }
      delete self.loadTextureCallback;
    }
  }
}

/**
 * webgl 세팅
 * @param  {Draw} self
 * @return {boolean}   성공적으로 마쳤으면 true반환
 */
function initWebgl(self) {
  var gl = self.gl
    , program = loadWebglProgram(gl);

  // var err = gl.getError();
  // if (err !== gl.NO_ERROR) {
  //   var errorMessage = "";
  //   if (err == gl.INVALID_ENUM) {
  //     errorMessage = "Invalid constant";
  //   }
  //   else if (err == gl.INVALID_VALUE) {
  //     errorMessage = "Numeric argument out of range.";
  //   }
  //   else if (err == gl.INVALID_OPERATION) {
  //     errorMessage = "Invalid operation for current state.";
  //   }
  //   else if (err == gl.OUT_OF_MEMORY) {
  //     errorMessage = "Out of memory!!";
  //   }
  //   else {
  //     errorMessage = "Unknown error";
  //   }
  //   return errorMessage;
  // }

  self.buffers = [];
  self.program = program;
  gl.useProgram(program);

  self.positionLocation = gl.getAttribLocation(program, 'a_position');
  self.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
  self.u_resolution     = gl.getUniformLocation(program, 'u_resolution');
  self.u_translation    = gl.getUniformLocation(program, 'u_translation');
  self.u_angle          = gl.getUniformLocation(program, 'u_angle');
  self.u_scale          = gl.getUniformLocation(program, 'u_scale');
  self.u_sampler        = gl.getUniformLocation(program, 'u_sampler');

  gl.enableVertexAttribArray(self.texCoordLocation);
  gl.enableVertexAttribArray(self.positionLocation);

  gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);

  return true;
}

/**
 * webgl shader load하기
 * @param  {WebGLRenderingContext}  gl          webgl context
 * @param  {string}                 shaderType  'vertext' or 'fragment'
 * @return {WebGLShader|null}                   생성한 shader 또는 실패시 null
 */
function getWebglShader(gl, shaderType) {
  var option
    , source;

  if (shaderType === 'vertex') {
    option = gl.VERTEX_SHADER;
    source = vertexShaderSrc;
  }

  else if (shaderType === 'fragment') {
    option = gl.FRAGMENT_SHADER;
    source = fragmentShaderSrc;
  }

  else {
    return null;
  }

  var shader = gl.createShader(option);
  gl.shaderSource(shader, source.join('\n'));
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

/**
 * webgl program load하기
 * @param  {WebGLRenderingContext}  gl  webgl context
 * @return {WebGLProgram}               생성된 webgl program
 */
function loadWebglProgram(gl) {
  var program = gl.createProgram();

  gl.attachShader(program, getWebglShader(gl, 'vertex'));
  gl.attachShader(program, getWebglShader(gl, 'fragment'));
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
    var lastError = gl.getProgramInfoLog(program);
    console.warn('Error in program linking:' + lastError);
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/**
 * webgl buffer 생성
 * @param  {Draw}   self
 * @param  {Shape}  rect  buffer 생성할 rect object
 * @return {null}
 */
function setupWebglBuffer(self, rect) {
  var gl = self.gl
    , index = rect.index;

  var width = rect.getValue('width')
    , height = rect.getValue('height')
    , x1 = -width / 2
    , y1 = -height / 2
    , x2 = width / 2
    , y2 = height / 2

  // vertex buffer
  self.buffers[index] = gl.createBuffer();
  rect.buffer = self.buffers[index];

  var bufferUsage = gl.STATIC_DRAW;
  // if (rect.data.type === 'screen') {
  //   bufferUsage = gl.DYNAMIC_DRAW;
  // }

  gl.bindBuffer(gl.ARRAY_BUFFER, self.buffers[index]);

  // // gl.TRIANGLES
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  //   x1, y1, 0.0, 0.0,
  //   x2, y1, 1.0, 0.0,
  //   x1, y2, 0.0, 1.0,
  //   x1, y2, 0.0, 1.0,
  //   x2, y1, 1.0, 0.0,
  //   x2, y2, 1.0, 1.0
  // ]), bufferUsage);

  // // gl.TRIANGLE_FAN
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  //   x1, y2, 0.0, 1.0,
  //   x1, y1, 0.0, 0.0,
  //   x2, y1, 1.0, 0.0,
  //   x2, y2, 1.0, 1.0
  // ]), bufferUsage);

  // gl.TRIANGLE_STRIP
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1, 0.0, 0.0,
    x1, y2, 0.0, 1.0,
    x2, y1, 1.0, 0.0,
    x2, y2, 1.0, 1.0
  ]), bufferUsage);
}

/**
 * webgl 버퍼 삭제하기
 * @param  {Draw}   self
 * @param  {number} index 생성된 buffer의 index
 * @return {null}
 */
function deleteWebglBuffer(self, index) {
  self.gl.deleteBuffer(self.buffers[index]);
  self.buffers[index] = null;
}

/**
 * webgl texture 생성
 * @param  {Draw}       self
 * @param  {object}     texture
 * @param  {number}     texture.index   texture index
 * @param  {img|canvas} texture.texture texture로 사용할 img or canvas
 * @return {null}
 */
function setupWebglTexture(self, texture) {
  var gl = self.gl
    , index = texture.index;

  gl.activeTexture(gl.TEXTURE0 + index);

  self.textures[index] = gl.createTexture();
  self.textures[index].source = texture.texture;

  gl.bindTexture(gl.TEXTURE_2D, self.textures[index]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.texture);
  // repeat
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // mag, min
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  completeTextureLoad(self);
}

/**
 * update된 canvas texture 업데이트
 * @param  {Draw}   self
 * @param  {number} textureIndex texture index
 * @return {null}
 */
function updateWebglCanvasTexture(self, textureIndex) {
  var gl = self.gl
  var texture = self.textures[textureIndex];
  gl.bindTexture(gl.TEXTURE_2D, texture);

  try{
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
  }
  catch(e){
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source, null);
  }
  // gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * webgl texture 삭제
 * @param  {Draw}   self
 * @param  {number} index 삭제할 texture index
 * @return {null}
 */
function deleteWebglTexture(self, index) {
  self.gl.deleteTexture(self.textures[index]);
  self.textures[index] = null;
}

/**
 * rect를 webgl로 그림
 * draw tic 때마다 호출
 * @param  {Draw}     self
 * @param  {Shape[]}  rects                     그려야 할 shape 객체 배열
 * @param  {object}   transformValues           그려야 할 객체의 transform 값
 * @param  {object}   transformValues.rotate    기울기 값
 * @param  {object}   transformValues.scaleX    scale 값
 * @param  {object}   transformValues.drawGapX  위치 보정 값 x
 * @param  {object}   transformValues.drawGapY  위치 보정 값 y
 * @return {null}
 */
function drawWebglRects(self, rects, transformValues) {
  var gl = self.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, self.canvas.width, self.canvas.height);
  gl.uniform2f(self.u_resolution, self.canvas.width, self.canvas.height);
  gl.uniform1f(self.u_angle, transformValues.rotate);
  gl.uniform1f(self.u_scale, transformValues.scaleX);

  var drawGapX = transformValues.drawGapX || 0
    , drawGapY = transformValues.drawGapY || 0;

  var bufferIndex, textureIndex, translate;
  for (var i = 0; i < rects.length; i++) {
    bufferIndex = rects[i].index;
    textureIndex = rects[i].data.texture;
    translate = rects[i].getValue('drawTranslate');
    // translate value
    gl.uniform2f(self.u_translation, translate.x + drawGapX, translate.y + drawGapY);
    // texture
    gl.activeTexture(gl.TEXTURE0 + textureIndex);
    gl.uniform1i(self.u_sampler, textureIndex);
    // buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, self.buffers[bufferIndex]);
    gl.vertexAttribPointer(self.positionLocation, 2, gl.FLOAT, false, 4 * BPE, 0);
    gl.vertexAttribPointer(self.texCoordLocation, 2, gl.FLOAT, false, 4 * BPE, 2 * BPE);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

/**
 * 2d context에서 사용하는 texture 설정
 * @param  {Draw} self
 * @param  {object}     texture
 * @param  {number}     texture.index   texture index
 * @param  {img|canvas} texture.texture texture로 사용할 img or canvas
 * @return {null}
 */
function setup2dTexture(self, texture) {
  self.textures[texture.index] = texture.texture;
  completeTextureLoad(self);
}

function update2dCanvasTexture() {
  // self.textures[index] = texture;
}

/**
 * 2d texture 삭제
 * @param  {Draw}   self
 * @param  {number} index 삭제할 texture index
 * @return {null}
 */
function delete2dTexture(self, index) {
  // self.textures[index].texture.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  self.textures[index] = null;
}

/**
 * rect를 webgl로 그림
 * draw tic 때마다 호출
 * @param  {Draw}     self
 * @param  {Shape[]}  rects 그려야 할 shape 객체 배열
 * @return {null}
 */
function draw2dRects(self, rects) {
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
  // self.context.save();
  // self.context.fillStyle = 'rgba(0,0,0,0)';
  // self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
  // self.context.restore();

  for (var i = 0; i < rects.length; i++) {
    rects[i].draw(self.context, self.textures[rects[i].data.texture]);
  }
}

/**
 * rect setup하기
 * @param  {Shape[]} rects  setup할 Shape 객체 모음배열
 * @return {null}
 */
Draw.prototype.setupRects = function(rects) {
  if (this.contextType === 'webgl') {
    for (var i = 0; i < rects.length; i++) {
      setupWebglBuffer(this, rects[i]);
    }
  }
};

/**
 * 버퍼 모두 삭제
 * @return {null}
 */
Draw.prototype.clearRects = function() {
  if (this.contextType === 'webgl') {
    for (var i = 0; i < this.buffers.length; i++) {
      if (this.buffers[i]) {
        deleteWebglBuffer(this, i);
      }
    }
    this.buffers = [];
  }
};

/**
 * 택스쳐 로드하기
 * @param  {object[]}   textures        texture 정보 모음
 * @param  {number}     textures.index  texture index
 * @param  {img|canvas} textures.img    texture로 사용할 image 또는 canvas
 * @param  {Function}   callback        callback after texture load
 * @return {null}
 */
Draw.prototype.loadTextures = function(textures, callback) {
  this.textureSetupCount = textures.length;
  this.loadTextureCallback = callback;
  for (var i = 0; i < textures.length; i++) {
    // textures[i].index = i;
    //image url
    if (typeof textures[i].img === 'string') {
      loadTextureImage(this, textures[i]);
    }

    //native image or canvas object
    else if (textures[i].img instanceof HTMLElement && textures[i].img.tagName && (
      textures[i].img.tagName.toLowerCase() === 'canvas' ||
      textures[i].img.tagName.toLowerCase() === 'img'
    )) {
      textures[i].texture = textures[i].img;
      this.func.setupTexture(this, textures[i]);
    }
    // noting
    else {
      this.textures[i] = null;
    }
  }
};

/**
 * 특정 texture 업데이트
 * @param  {number} index texture index
 * @return {null}
 */
Draw.prototype.refreshTexture = function(index) {
  this.func.updateCanvasTexture(this, index);
};

/**
 * 텍스쳐 삭제
 * @return {null}
 */
Draw.prototype.clearTextures = function() {
  for (var i = 0; i < this.textures.length; i++) {
    if (this.textures[i]) {
      this.func.deleteTexture(this, i);
    }
  }
  this.textures = [];
};

/**
 * canvas에 일괄 그리기.
 * draw tic마다 호출
 * @param  {Shape[]} rects                    그려야 할 shape 객체 배열
 * @param  {object}  transformValues          그려야 할 객체의 transform 값
 * @param  {object}  transformValues.rotate   기울기 값
 * @param  {object}  transformValues.scaleX   scale 값
 * @param  {object}  transformValues.drawGapX 위치 보정 값 x
 * @param  {object}  transformValues.drawGapY 위치 보정 값 y
 * @return {null}
 */
Draw.prototype.drawRects = function(rects, transformValues) {
  this.func.drawRects(this, rects, transformValues);
};

