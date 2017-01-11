(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Viewer"] = factory();
	else
		root["Viewer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _emitter = __webpack_require__(11);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _domHelper = __webpack_require__(12);

	var _domHelper2 = _interopRequireDefault(_domHelper);

	var _mouse = __webpack_require__(13);

	var _mouse2 = _interopRequireDefault(_mouse);

	var _keyboard = __webpack_require__(14);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _scroller = __webpack_require__(16);

	var _scroller2 = _interopRequireDefault(_scroller);

	var _whiteboard = __webpack_require__(17);

	var _whiteboard2 = _interopRequireDefault(_whiteboard);

	var _laserpointer = __webpack_require__(25);

	var _laserpointer2 = _interopRequireDefault(_laserpointer);

	var _rc = __webpack_require__(26);

	var _rc2 = _interopRequireDefault(_rc);

	var _rcParser = __webpack_require__(30);

	var _rcParser2 = _interopRequireDefault(_rcParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function () {
	  function Viewer(option) {
	    _classCallCheck(this, Viewer);

	    this.emitter = new _emitter2.default();
	    this.option = option;

	    this.viewerWrap = document.querySelector(".viewer-wrap");
	    this.viewer = document.querySelector(".viewer");
	    this.scaleArea = document.querySelector(".scale-wrap");

	    this.scale = 1;
	    this.fullscreen = false;
	  }

	  _createClass(Viewer, [{
	    key: 'init',
	    value: function init(screenApp) {
	      var _this = this;

	      var self = this;

	      this.mouse = new _mouse2.default({
	        'emitter': this.emitter
	      });

	      this.keyboard = new _keyboard2.default({
	        'emitter': this.emitter
	      });

	      this.emitter.on('keyboardUpdate', function (data) {

	        //var protocol =  Protocol['data'];
	        //var schema = protocol.get('KeyMouseCtrl:KeyEvent');
	        //var packet = new Parser.Encoder(schema, data||{}).pack();
	        //self.emitter.emit('dataSend',packet.buffer);

	        data.topic = 'KeyMouseCtrl:KeyEvent';
	        console.log(data);
	        self.emitter.emit('dataSend', JSON.stringify(data));
	      });

	      this.emitter.on('mouseUpdate', function () {

	        var mouse = self.mouse.state.mouse;
	        if (mouse !== false) {

	          var mask = 0;
	          if (mouse.buttons !== undefined) {
	            for (var i = 0; i < mouse.buttons.length; i++) {
	              mask += 1 << mouse.buttons[i] - 1;
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

	      this.emitter.on('whiteboardUpdate', function (topic, data) {

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

	      this.emitter.on('laserpointerUpdate', function (topic, data) {

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

	      this.emitter.on('whiteboardToggle', function (power) {

	        document.querySelector(".display-whiteboard").innerHTML = power ? 'on' : 'off';

	        if (power == true && _this.laserpointer.power == true) {
	          _this.laserpointer.off();
	        }
	      });

	      this.emitter.on('laserpointerToggle', function (power) {

	        document.querySelector(".display-laserpointer").innerHTML = power ? 'on' : 'off';

	        if (power == true && _this.whiteboard.power == true) {
	          _this.whiteboard.off();
	        }
	      });

	      setTimeout(function () {
	        _this.scroller = new _scroller2.default({
	          'bounding': { 'X': 0, 'Y': 100 }
	        });
	        _this.whiteboard = new _whiteboard2.default({
	          'emitter': _this.emitter
	        });
	        _this.laserpointer = new _laserpointer2.default({
	          'emitter': _this.emitter
	        });
	        self.setScale(1);
	      }, 3000);

	      document.getElementById("scale-range").addEventListener('change', function () {

	        var scale = this.value;
	        self.setScale(scale);
	      });

	      document.getElementById("screenshot").addEventListener('click', function () {

	        var screen = self.viewer.querySelector("video");
	        var canvas = document.createElement('canvas');

	        canvas.width = screen.offsetWidth;
	        canvas.height = screen.offsetHeight;

	        var ctx = canvas.getContext('2d');
	        ctx.drawImage(screen, 0, 0, canvas.width, canvas.height);

	        var dataURI = canvas.toDataURL('image/jpeg');

	        var link = document.createElement('a');
	        link.href = dataURI;
	        link.download = "output.png";
	        document.body.appendChild(link);
	        link.click();
	        document.body.removeChild(link);
	      });

	      this.scaleArea.addEventListener('transitionend', function () {
	        console.log('transitionend-');
	        self.scroller.makeScrollPosition();
	        self.scroller.setScrollTop();
	      });

	      document.getElementById("viewer-fullscreen").addEventListener('click', function () {
	        self.toggleFullScreen();
	      });

	      window.addEventListener('resize', function () {

	        self.changeCenter();

	        if (window.innerHeight == screen.height) {
	          self.setFullScreen(true);
	        } else {
	          console.log('isnot---fullscreen');
	          self.setFullScreen(false);
	        }
	      });
	    }
	  }, {
	    key: 'setFullScreen',
	    value: function setFullScreen(isfullscreen) {

	      this.fullscreen = isfullscreen;

	      var toolbox = document.getElementById("toolbox");

	      if (isfullscreen) {

	        _domHelper2.default.addClass(toolbox, 'fullscreen');
	        _domHelper2.default.addClass(this.viewerWrap, 'fullscreen');

	        this.setScale(this.scale);
	      } else {

	        _domHelper2.default.removeClass(toolbox, 'fullscreen');
	        _domHelper2.default.removeClass(this.viewerWrap, 'fullscreen');
	        this.setScale(this.scale);
	      }
	    }
	  }, {
	    key: 'toggleFullScreen',
	    value: function toggleFullScreen() {
	      if (!document.fullscreenElement && // alternative standard method
	      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
	        // current working methods
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
	  }, {
	    key: 'changeCenter',
	    value: function changeCenter() {

	      var self = this;

	      var screen = self.viewer.querySelector("video");

	      var marginHeight = (self.viewer.offsetHeight - Number(screen.offsetHeight * self.scale)) / 2;

	      if (marginHeight <= 0) {
	        marginHeight = 0;
	      }
	      self.scaleArea.style.top = marginHeight + "px";
	    }
	  }, {
	    key: 'setScale',
	    value: function setScale(scale) {

	      var self = this;
	      self.scale = scale;

	      var screen = self.viewer.querySelector("video");
	      var laserpointer = self.viewer.querySelector("#laserpointer");
	      var whiteboard = self.viewer.querySelector("#whiteboard");

	      screen.style.transform = 'scale(' + scale + ')';
	      screen.style.transformOrigin = 'left top';

	      laserpointer.style.transform = 'scale(' + scale + ')';
	      laserpointer.style.transformOrigin = 'left top';

	      whiteboard.style.transform = 'scale(' + scale + ')';
	      whiteboard.style.transformOrigin = 'left top';

	      document.querySelector(".display-scale").innerHTML = parseInt(scale * 100);

	      self.scaleArea.style.width = Number(screen.offsetWidth * scale) + "px";
	      self.scaleArea.style.height = Number(screen.offsetHeight * scale) + "px";

	      self.changeCenter();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.emitter.emit('stop');
	    }
	  }]);

	  return Viewer;
	}();

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `Emitter`.
	 * @module  emitter
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function (event, fn) {
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function (event) {
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1),
	      callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function (event) {
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function (event) {
	  return !!this.listeners(event).length;
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * DOM manipulation utils
	 * some functions referred by http://youmightnotneedjquery.com/
	 * @version 1.0
	 * @author  Jeong Heeju
	 * @module  {object} dom-helper
	 */
	'use strict';

	/**
	 * -,_,공백문자를 camel case로 변환
	 * @param   {string} str dash, underline, space words
	 * @returns {string}
	 */

	function toCamelCase(str) {
	  return str.replace(/[\s_-](\w)/gi, function (r, l) {
	    return l.toUpperCase();
	  });
	}

	/**
	 * @param   {*}       element
	 * @returns {boolean}
	 */
	function isHTMLElement(el) {
	  return el instanceof HTMLElement;
	}

	/**
	 * @param   {*}       elemnt
	 * @returns {Boolean}
	 */
	function isHTMLCollection(el) {
	  return el instanceof HTMLCollection;
	}

	/**
	 * @param  {*}        element
	 * @return {Boolean}
	 */
	function isDocument(el) {
	  return el === document;
	}

	/**
	 * @param  {*}        element
	 * @return {Boolean}
	 */
	function isWindow(el) {
	  return el === window;
	}

	/**
	 * @param  {*}        element
	 * @return {Boolean}
	 */
	function isDOMElement(el) {
	  return isHTMLElement(el) || isDocument(el) || isWindow(el);
	}

	/**
	 * @param  {string}       selector  css selector
	 * @param  {HTMLElement}  [context] parnet element
	 * @return {?HTMLElement}           selected HTMLElement od HTMLCollection
	 */
	function domSelect(selector, context) {
	  var matches = selector.match(/([#\.])?([\w-]+)/i);

	  if (!matches || !matches.length) {
	    return null;
	  }

	  if (matches[0] !== selector) {
	    matches[1] = 'querySelector';
	    matches[2] = selector;
	  }

	  var method = {
	    '#': 'getElementById',
	    '.': 'getElementsByClassName',
	    'undefined': 'getElementsByTagName',
	    'querySelector': 'querySelectorAll'
	  }[matches[1]];

	  if (context === undefined || isHTMLElement(context) === false) {
	    context = document;
	  }

	  var el;
	  try {
	    el = context[method](matches[2]);
	  } catch (e) {
	    el = null;
	  }

	  if (el && el.length !== undefined) {
	    if (el.length === 0) {
	      el = null;
	    } else if (el.length === 1) {
	      el = el[0];
	    }
	  }

	  return el;
	}

	/**
	 * compare HTMLElements
	 * @param  {HTMLElement} el     to compare HTMLElement
	 * @param  {HTMLElement} target to compare HTMLElement
	 * @return {boolean}            true if el and target is same
	 */
	function equals(el, target) {
	  if (el === undefined || target === undefined || isHTMLElement(el) === false) {
	    return;
	  }

	  if (isDOMElement(target) === true) {
	    return el === target;
	  }
	}

	/**
	 * 엘리먼트에 자식이 있는지 판별
	 * @param   {HTMLElement}  el    부모
	 * @param   {HTMLElement}  child 자식
	 * @returns {Boolean}            부모에 자식이 있으면 true
	 */
	function isContains(el, child) {
	  if (el === undefined || isDOMElement(el) === false) {
	    return false;
	  }

	  if (child && isDOMElement(child) === true) {
	    return el !== child && el.contains(child);
	  } else {
	    return el.ownerDocument.contains(el);
	  }
	}

	/**
	 * HTMLElement 복사
	 * @param   {HTMLElement}   el
	 * @returns {?HTMLElement}     복사된 HTMLElement
	 */
	function clone(el) {
	  if (el === undefined || isDOMElement(el) === false) {
	    return null;
	  }

	  return el.cloneNode(true);
	}

	/**
	 * classname 있는지 검사
	 * @param   {HTMLElement} el
	 * @param   {String}      className class name
	 * @returns {Boolean}
	 */
	function hasClass(el, className) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return false;
	  }

	  if (el.classList) {
	    return el.classList.contains(className);
	  } else {
	    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	  }
	}

	/**
	 * Element에 class name 추가
	 * @param   {HTMLElement}   el
	 * @param   {String}        className 추가할 class name
	 * @returns {?HTMLElement}            classname 추가된 HTMLElement
	 */
	function addClass(el, className) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return null;
	  }

	  el.classList.add(className);

	  // if (el.classList) {
	  //   el.classList.add(className);
	  // }
	  // else {
	  //   el.className += ' ' + className;
	  // }

	  return el;
	}

	/**
	 * Element에 class name 삭제
	 * @param   {HTMLElement}  el
	 * @param   {String}       className  삭제할 class name
	 * @returns {?HTMLElement}            classnames이 삭제된 HTMLElement
	 */
	function removeClass(el, className) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return null;
	  }

	  el.classList.remove(className);

	  // if (el.classList) {
	  //   el.classList.remove(className);
	  // }
	  // else {
	  //   el.className = el.className.replace(
	  //     new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '
	  //   );
	  // }

	  return el;
	}

	/**
	 * class name 토글
	 * @param   {HTMLElement}   el
	 * @param   {String}        className toggle할 class name
	 * @param   {Boolean}       state     add or remove flag
	 * @returns {?HTMLElement}            toggle된 HTMLElement
	 */
	function toggleClass(el, className, state) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return null;
	  }

	  if (state === true) {
	    return addClass(el, className);
	  } else if (state === false) {
	    return removeClass(el, className);
	  }

	  el.classList.toggle(className);

	  // if (el.classList) {
	  //   el.classList.toggle(className);
	  // }
	  // else {
	  //   var classes = el.className.split(' ');
	  //   var index = classes.indexOf(className);
	  //   if (index >= 0) {
	  //     classes.splice(index, 1);
	  //   }
	  //   else {
	  //     classes.push(className);
	  //   }
	  //   el.className = classes.join(' ');
	  // }

	  return el;
	}

	/**
	 * HTMLElement 속성 set/get
	 * @param   {HTMLElement}         el
	 * @param   {String}              name    attribute 이름
	 * @param   {String}              [value] attribute 값
	 * @returns {HTMLElement|string}          getter: String, setter: HTMLElement
	 */
	function attr(el, name, value) {
	  if (el === undefined || isHTMLElement(el) === false || name === undefined) {
	    return;
	  }

	  //get value
	  if (value === undefined) {
	    return el.getAttribute(name);
	  }
	  //set value
	  else {
	      el.setAttribute(name, value);
	      return el;
	    }
	}

	/**
	 * HTMLElement 속성 삭제
	 * @param   {HTMLElement} el
	 * @param   {String}      name attribute 이름
	 * @returns {HTMLElement}      attribute 삭제된 HTMLElement
	 */
	function removeAttr(el, name) {
	  if (el != undefined && isHTMLElement(el) === true && name != undefined) {
	    el.removeAttribute(name);
	  }

	  return el;
	}

	/**
	 * HTMLElement style get/set
	 * @param     {HTMLElement}         el
	 * @param     {string|object}       name    style name
	 * @param     {string}              [value]
	 * @returnss  {?string|HTMLElement}         get: string. set: HTMLElement
	 */
	function css(el, name, value) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return null;
	  }

	  //get
	  if (name === undefined) {
	    return getComputedStyle(el);
	  }
	  if (value === undefined && name.constructor !== Object) {
	    var styles = getComputedStyle(el);

	    if (typeof name === 'string') {
	      return styles[toCamelCase(name)];
	    } else if (Array.isArray(name)) {
	      var result = {};
	      for (var i = 0; i < name.length; i++) {
	        result[name[i]] = styles[toCamelCase(name[i])];
	      }
	      return result;
	    } else {
	      return styles;
	    }
	  }

	  //set
	  var setStyles = {};
	  if (name.constructor === Object) {
	    setStyles = name;
	  }
	  if (typeof name === 'string') {
	    setStyles[name] = value;
	  }
	  for (var key in setStyles) {
	    if (typeof setStyles[key] === 'number' && key.match('index') === null) {
	      setStyles[key] += 'px';
	    }
	    el.style[toCamelCase(key)] = setStyles[key];
	  }

	  return el;
	}

	/**
	 * get background color
	 * @param  {HTMLElement} el
	 * @return {string}           background color code or 'transparent'
	 */
	function getBgColor(el) {
	  var bgc = '';

	  do {
	    bgc = css(el, 'background-color');
	    el = el.parentNode;
	  } while (bgc === 'transparent' || bgc === 'rgba(0, 0, 0, 0)');

	  return bgc || 'transparent';
	}

	/**
	 * insert stylesheet rule in document
	 * @param  {string} selector css selector
	 * @param  {string} rule     css rule
	 * @param  {number} [index]  stylesheet index
	 * @return {null}
	 */
	function insertStyleSheet(selector, rule, index) {
	  if (index === undefined) {
	    index = 0;
	  }

	  var styleSheets = document.styleSheets[document.styleSheets.length - 1];
	  styleSheets.insertRule(selector + '{' + rule + '}', 0);
	}

	/**
	 * delete inserted stylesheet rule
	 * @param  {number} [index] stylesheet index
	 * @return {null}
	 */
	function deleteStyleSheet(index) {
	  if (index === undefined) {
	    index = 0;
	  }
	  var styleSheets = document.styleSheets[document.styleSheets.length - 1];
	  styleSheets.deleteRule(index);
	}

	/**
	 * get or set element width
	 * @param  {HTMLElement}        el
	 * @param  {number|boolean}     [value] set width or include padding flag
	 * @return {HTMLElement|number}         setted HTMLElement or getted width (or with padding)
	 */
	function width(el, value) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return 0;
	  }

	  if (value !== undefined && value !== true) {
	    value = parseInt(value);
	    if (typeof value === 'number') {
	      css(el, 'width', value + 'px');
	      return el;
	    }
	  }

	  var style = getComputedStyle(el),
	      width = el.offsetWidth - parseInt(style.borderLeftWidth) - parseInt(style.borderRightWidth);

	  // include padding
	  if (value === true) {
	    return width;
	  }

	  return width - parseInt(style.paddingLeft) - parseInt(style.paddingRight);
	}

	/**
	 * get inner width
	 * @param  {HTMLElement} el
	 * @return {number}      width value with padding
	 */
	function innerWidth(el) {
	  return width(el, true);
	}

	/**
	 * get outer width
	 * @param  {HTMLElement}  el
	 * @param  {boolean}      [withMargin]  include margin width
	 * @return {number}                     width value with border, padding (margin)
	 */
	function outerWidth(el, withMargin) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return 0;
	  }

	  var width = el.offsetWidth;
	  if (withMargin === true) {
	    var style = getComputedStyle(el);
	    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	  }

	  return width;
	}

	/**
	 * get or set element height
	 * @param  {HTMLElement}        el
	 * @param  {number|boolean}     [value] set height or include padding flag
	 * @return {HTMLElement|number}         setted HTMLElement or getted height (or with padding)
	 */
	function height(el, value) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return 0;
	  }

	  if (typeof value === 'number') {
	    return css(el, 'height', value + 'px');
	  }

	  var style = getComputedStyle(el),
	      height = el.offsetHeight - parseInt(style.borderTopWidth) - parseInt(style.borderBottomWidth);

	  // include padding
	  if (value === true) {
	    return height;
	  }

	  return height - parseInt(style.paddingTop) - parseInt(style.paddingBottom);
	}

	/**
	 * get inner height
	 * @param  {HTMLElement} el
	 * @return {number}      height value with padding
	 */
	function innerHeight(el) {
	  return height(el, true);
	}

	/**
	 * get outer height
	 * @param  {HTMLElement}  el
	 * @param  {boolean}      [withMargin]  include margin height
	 * @return {number}                     height value with border, padding (margin)
	 */
	function outerHeight(el, withMargin) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return null;
	  }

	  var height = el.offsetHeight;
	  if (withMargin === true) {
	    var style = getComputedStyle(el);
	    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	  }

	  return height;
	}

	/**
	 * get real rect dimentions
	 * @param   {HTMLElement} el
	 * @returns {Object}          bounding rect values
	 */
	function getRect(el) {
	  return el.getBoundingClientRect();
	}

	/**
	 * get element offset
	 * @param   {HTMLElement} el
	 * @param   {Boolean}     [isRelation]  include scrolled position
	 * @returns {object}                    offset top, left
	 */
	function offset(el, isRelation) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return {};
	  }

	  var rect = getRect(el);
	  if (isRelation === true) {
	    return {
	      'top': rect.top,
	      'left': rect.left
	    };
	  }

	  return {
	    'top': rect.top + document.body.scrollTop,
	    'left': rect.left + document.body.scrollLeft
	  };
	}

	/**
	 * get element position
	 * @param   {HTMLElement} el
	 * @returns {object}      offset top, left
	 */
	function position(el) {
	  if (el === undefined || isHTMLElement(el) === false) {
	    return {};
	  }

	  return {
	    top: el.offsetTop,
	    left: el.offsetLeft
	  };
	}

	/**
	 * insert element to target element head
	 * @param   {HTMLElement}       el      child element
	 * @param   {HTMLElement}       parent  parent element (target)
	 * @returns {HTMLElement|null}          inserted child element
	 */
	function appendTo(el, parent) {
	  if (el === undefined || isHTMLElement(el) === false || parent === undefined || isHTMLElement(parent) === false) {
	    return null;
	  }
	  parent.appendChild(el);

	  return el;
	}

	/**
	 * insert element to target element tail
	 * @param   {HTMLElement}       el      child element
	 * @param   {HTMLElement}       parent  parent element (target)
	 * @returns {HTMLElement|null}          inserted child element
	 */
	function prependTo(el, parent) {
	  if (el === undefined || isHTMLElement(el) === false || parent === undefined || isHTMLElement(parent) === false) {
	    return null;
	  }

	  insertBefore(el, parent.firstChild);

	  return el;
	}

	/**
	 * insert element to target element below
	 * @param   {HTMLElement}       el      insert element
	 * @param   {HTMLElement}       target  target element
	 * @returns {HTMLElement|null}          inserted element
	 */
	function insertBefore(el, target) {
	  if (el === undefined || isHTMLElement(el) === false || target === undefined || isHTMLElement(target) === false) {
	    return null;
	  }

	  if (target.insertAdjacentElement) {
	    target.insertAdjacentElement('beforeBegin', el);
	  } else {
	    target.parentNode.insertBefore(el, target);
	  }

	  return el;
	}

	/**
	 * insert element to target element adove
	 * @param   {HTMLElement} el      insert element
	 * @param   {HTMLElement} target  target element
	 * @returns {HTMLElement}         inserted element
	 */
	function insertAfter(el, target) {
	  if (el === undefined || isHTMLElement(el) === false || target === undefined || isHTMLElement(target) === false) {
	    return;
	  }

	  if (target.insertAdjacentElement) {
	    target.insertAdjacentElement('afterend', el);
	  } else {
	    if (target.parentNode.lastChild == target) {
	      appendTo(el, target.parentNode);
	    } else {
	      insertBefore(el, target.nextSibling);
	    }
	  }

	  return el;
	}

	/**
	 * append target child to element
	 * @param   {HTMLElement} el     parent element
	 * @param   {HTMLElement} child  child element
	 * @returns {HTMLElement}        child appended parent
	 */
	function append(el, child) {
	  appendTo(child, el);

	  return el;
	}

	/**
	 * prepend target child to element
	 * @param   {HTMLElement} el     parent element
	 * @param   {HTMLElement} child  child element
	 * @returns {HTMLElement}        child prepended parent
	 */
	function prepend(el, child) {
	  prependTo(child, el);

	  return el;
	}

	/**
	 * insert element to target before
	 * @param   {HTMLElement} el
	 * @param   {HTMLElement} target
	 * @returns {HTMLElement}
	 */
	function before(el, target) {
	  insertBefore(target, el);

	  return el;
	}

	/**
	 * insert element to target after
	 * @param   {HTMLElement} el
	 * @param   {HTMLElement} target
	 * @returns {HTMLElement}
	 */
	function after(el, target) {
	  insertAfter(target, el);

	  return el;
	}

	/**
	 * remove HTMLElement
	 * @param  {HTMLElement} el
	 */
	function remove(el) {
	  if (el != undefined && isHTMLElement(el) === true && el.parentNode) {
	    el.parentNode.removeChild(el);
	  }

	  return null;
	}

	/**
	 * empty HTMLElement contents
	 * @param   {HTMLElement} el
	 * @returns {HTMLElement} empty HTMLElement
	 */
	function empty(el) {
	  if (el != undefined && isHTMLElement(el) === true) {
	    el.textContent = '';
	  }

	  return el;
	}

	/**
	 * 포커스 되었는지 검사
	 * @param   {HTMLElement}  el
	 * @returns {Boolean}
	 */
	function isFocused(el) {
	  return equals(el, document.activeElement);
	}

	module.exports = {
	  'isHTMLElement': isHTMLElement,
	  'isHTMLCollection': isHTMLCollection,
	  'isDocument': isDocument,
	  'isWindow': isWindow,
	  'isDOMElement': isDOMElement,
	  'isContains': isContains,
	  'is': equals,
	  'equals': equals,
	  'contains': isContains,
	  'clone': clone,

	  //selection
	  'domSelect': domSelect,
	  'select': domSelect,

	  //class control
	  'hasClass': hasClass,
	  'addClass': addClass,
	  'removeClass': removeClass,
	  'toggleClass': toggleClass,

	  //attribute control
	  'attr': attr,
	  'removeAttr': removeAttr,

	  //style control
	  'css': css,
	  'getBgColor': getBgColor,

	  //dimensions
	  'width': width,
	  'innerWidth': innerWidth,
	  'outerWidth': outerWidth,
	  'height': height,
	  'innerHeight': innerHeight,
	  'outerHeight': outerHeight,
	  'getRect': getRect,

	  //offset
	  'offset': offset,
	  'position': position,

	  //DOM insertions & removals
	  'appendTo': appendTo,
	  'prependTo': prependTo,
	  'append': append,
	  'prepend': prepend,
	  'insertBefore': insertBefore,
	  'insertAfter': insertAfter,
	  'before': before,
	  'after': after,
	  'remove': remove,
	  'empty': empty,

	  //etc
	  'isFocused': isFocused
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Mouse = function () {
	  function Mouse(option) {
	    _classCallCheck(this, Mouse);

	    this.emitter = option.emitter;
	    this.active = true;
	    this.mouse = {};
	    this.pressAutoEvent = null;

	    addMouseListeners(this);
	  }

	  _createClass(Mouse, [{
	    key: 'update',
	    value: function update() {
	      this.state = {
	        'mouse': getMouseStatus(this)
	      };
	    }
	  }]);

	  return Mouse;
	}();

	exports.default = Mouse;


	function pressAutoEvent(event, self) {

	  sendInput(self);
	  self.pressAutoEvent = requestAnimationFrame(function () {
	    pressAutoEvent(event, self);
	  });
	}

	function addMouseListeners(self) {
	  self.mouse = {
	    'buttons': {},
	    'screenButtons': {},
	    'x': -1,
	    'y': -1
	  };

	  var $screen = document.querySelector("video");

	  var prevX = 0,
	      prevY = 0;

	  $screen.addEventListener('contextmenu', function (event) {
	    event.preventDefault();
	    return false;
	  });

	  $screen.addEventListener('mousedown', function (event) {

	    if (self.active === false) return false;

	    var button = event.which;

	    if (self.mouse.buttons[button] === undefined) {
	      self.mouse.buttons[button] = event.target;
	    }

	    getMousePointer(event, self);

	    if (self.mouse.screenButtons[button] === undefined) {
	      self.mouse.screenButtons[button] = true;
	    }

	    pressAutoEvent(event, self);

	    event.preventDefault();
	    return false;
	  });

	  $screen.addEventListener('mouseup', function (event) {

	    cancelAnimationFrame(self.pressAutoEvent);

	    if (self.active === false) return false;

	    var button = event.which;

	    if (self.mouse.buttons[button] !== undefined) {
	      delete self.mouse.buttons[button];
	    }

	    getMousePointer(event, self);

	    if (self.mouse.screenButtons[button] === true) {
	      delete self.mouse.screenButtons[button];
	    }

	    event.preventDefault();
	    return false;
	  });

	  $screen.addEventListener('wheel', function (event) {

	    if (self.active === false) return false;

	    var button = event.deltaY < 0 ? 4 : 5;

	    getMousePointer(event, self);

	    if (self.mouse.screenButtons[button] === undefined) {
	      self.mouse.screenButtons[button] = true;
	    }

	    sendInput(self);

	    event.preventDefault();
	    return false;
	  });

	  $screen.addEventListener('mousemove', function (event) {

	    if (self.active === false) return false;

	    getMousePointer(event, self);
	    sendInput(self);
	  });

	  window.addEventListener('focus', function () {
	    self.active = true;
	  });

	  window.addEventListener('blur', function () {
	    console.log('BLUR');
	    self.active = false;
	  });
	}

	function getMousePointer(event, self) {

	  self.mouse.x = event.offsetX;
	  self.mouse.y = event.offsetY;

	  return true;
	}

	function getMouseStatus(self) {

	  var result = {};

	  if (Object.keys(self.mouse.screenButtons).length > 0) {
	    result.buttons = Object.keys(self.mouse.screenButtons);
	  }

	  result.x = self.mouse.x;
	  result.y = self.mouse.y;

	  return result;
	}

	function sendInput(self) {
	  self.update();
	  self.emitter.emit('mouseUpdate');
	  inputEnd(self);
	}

	function inputEnd(self) {

	  //wheel
	  delete self.mouse.screenButtons['4'];
	  delete self.mouse.screenButtons['5'];
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domEvent = __webpack_require__(15);

	var _domEvent2 = _interopRequireDefault(_domEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Keyboard = function () {
	  function Keyboard(option) {
	    _classCallCheck(this, Keyboard);

	    this.emitter = option.emitter;

	    //this.inputTarget = option.inputTarget;
	    this.inputTarget = document.querySelector(".viewer-wrap");
	    this.active = true;
	    this.isMac = /Mac/.test(navigator.platform);

	    //this.channel = dataChannel;
	    this.state = {
	      'down': {},
	      'up': {},
	      'button': {},
	      'capslock': false, // specialkey 1
	      'numlock': false, // specialkey 2
	      'scrolllock': false };

	    this.keysym = this.setKeysym();
	    this.inputTarget.focus();

	    addListeners(this);
	  }

	  _createClass(Keyboard, [{
	    key: 'defaultOption',
	    value: function defaultOption() {
	      return {};
	    }
	  }, {
	    key: 'activate',
	    value: function activate() {
	      this.active = true;
	    }
	  }, {
	    key: 'inactivate',
	    value: function inactivate() {
	      this.active = false;
	    }
	  }, {
	    key: 'setKeysym',
	    value: function setKeysym() {
	      return {
	        '8': 0xFF08, // backspace
	        '9': 0xFF09, // tab
	        '13': 0xFF0D, // enter
	        '16': 0xFFE1, // shift
	        '17': 0xFFE3, // ctrl
	        '18': 0xFFE9, // alt
	        '19': 0xFF13, // pause/break
	        '20': 0, // 0xFFE5 capslock
	        '144': 0, // 0xFF7F numlock
	        '145': 0, // 0xFF14 scrolllock
	        '21': 0xFFEB, // hangul(0xFFEA RIGHT ALT)
	        '25': 0xFFF0, // hanja (0xFFE4 RIGHT CTRL)
	        '27': 0xFF1B, // escape
	        '32': 0x0020, // space
	        '33': 0xFF55, // page up
	        '34': 0xFF56, // page down
	        '35': 0xFF57, // end
	        '36': 0xFF50, // home
	        '37': 0xFF51, // left arrow
	        '38': 0xFF52, // up arrow
	        '39': 0xFF53, // right arrow
	        '40': 0xFF54, // down arrow
	        '45': 0xFF63, // insert
	        '46': 0xFFFF, // delete
	        '91': 0, // 0xFFEB left window key (hyper_l)
	        '92': 0, // 0xFF67 right window key (menu key?)
	        '93': 0xFF60, // menu key
	        '112': 0xFFBE, // F1
	        '113': 0xFFBF, // F2
	        '114': 0xFFC0, // F3
	        '115': 0xFFC1, // F4
	        '116': 0xFFC2, // F5
	        '117': 0xFFC3, // F6
	        '118': 0xFFC4, // F7
	        '119': 0xFFC5, // F8
	        '120': 0xFFC6, // F9
	        '121': 0xFFC7, // F10
	        '122': 0xFFC8, // F11
	        '123': 0xFFC9, // F12
	        // special chars
	        '59': 0x003B, // SEMICOLON (;) firefox
	        '61': 0x003D, // EQUAL (=) firefox
	        '173': 0x002D, // DASH (-) firefox
	        '186': 0x003B, // SEMICOLON (;)
	        '187': 0x003D, // EQUAL (=)
	        '188': 0x002C, // COMMA (,)
	        '189': 0x002D, // DASH (-)
	        '190': 0x002E, // PERIOD (.)
	        '191': 0x002F, // SLASH (/)
	        '192': 0x0060, // GRAVE (`)
	        '219': 0x005B, // BRACKETOPEN ([)
	        '220': 0x005C, // BACKSLASH (\)
	        '221': 0x005D, // BRACKETCLOSE (])
	        '222': 0x0022, // QUOTE (')
	        // 231: 0x005C,
	        // number keys
	        // 12: -1, //
	        '96': 0x0030, // 0
	        '97': 0x0031, // 1
	        '98': 0x0032, // 2
	        '99': 0x0033, // 3
	        '100': 0x0034, // 4
	        '101': 0x0035, // 5
	        '102': 0x0036, // 6
	        '103': 0x0037, // 7
	        '104': 0x0038, // 8
	        '105': 0x0039, // 9
	        '106': -0x0038, // *
	        '107': -0x003D, // +
	        '109': 0x002D, // -
	        '110': 0x002E, // .
	        '111': 0x002F };

	      var keymap = {
	        'BACKSPACE': '8',
	        'TAB': '9',
	        'ENTER': '13',
	        'SHIFT': '16',
	        'CTRL': '17',
	        'ALT': '18',
	        'PAUSE': '19',
	        'BREAK': '19',
	        'CAPSLOCK': '20',
	        'RIGHTALT': '21',
	        'RIGHTCTRL': '25',
	        'ESC': '27',
	        'SPACE': '32',
	        'PAGEUP': '33',
	        'PAGEDOWN': '34',
	        'END': '35',
	        'HOME': '36',
	        'LEFT': '37',
	        'UP': '38',
	        'RIGHT': '39',
	        'DOWN': '40',
	        'INSERT': '45',
	        'DELETE': '46',
	        '0': '48',
	        '1': '49',
	        '2': '50',
	        '3': '51',
	        '4': '52',
	        '5': '53',
	        '6': '54',
	        '7': '55',
	        '8': '56',
	        '9': '57',
	        'A': '65',
	        'B': '66',
	        'C': '67',
	        'D': '68',
	        'E': '69',
	        'F': '70',
	        'G': '71',
	        'H': '72',
	        'I': '73',
	        'J': '74',
	        'K': '75',
	        'L': '76',
	        'M': '77',
	        'N': '78',
	        'O': '79',
	        'P': '80',
	        'Q': '81',
	        'R': '82',
	        'S': '83',
	        'T': '84',
	        'U': '85',
	        'V': '86',
	        'W': '87',
	        'X': '88',
	        'Y': '89',
	        'Z': '90',
	        'META': '91',
	        'WIN': '91',
	        'RIGHTMETA': '92',
	        'RIGHTWIN': '92',
	        'SELECT': '93',
	        'NUM0': '96',
	        'NUM1': '97',
	        'NUM2': '98',
	        'NUM3': '99',
	        'NUM4': '100',
	        'NUM5': '101',
	        'NUM6': '102',
	        'NUM7': '103',
	        'NUM8': '104',
	        'NUM9': '105',
	        'MILTIPLY': '106',
	        'ADD': '107',
	        'SUBTRACT': '109',
	        'DECIMAL': '110',
	        'DIVIDE': '111',
	        'F1': '112',
	        'F2': '113',
	        'F3': '114',
	        'F4': '115',
	        'F5': '116',
	        'F6': '117',
	        'F7': '118',
	        'F8': '119',
	        'F9': '120',
	        'F10': '121',
	        'F11': '122',
	        'F12': '123',
	        'NUMLOCK': '144',
	        'SCROLLLOCK': '145',
	        'SEMICOLON': '186', //59
	        'EQUAL': '187', //61
	        'COMMA': '188',
	        'DASH': '189', //173
	        'PERIOD': '190',
	        'SLASH': '191',
	        'FORWARDSLASH': '191',
	        'GRAVE': '192',
	        'BRACKETOPEN': '219',
	        'BACKSLASH': '220',
	        'BRACKETCLOSE': '221',
	        'QUOTE': '222'
	      };
	    }
	  }]);

	  return Keyboard;
	}();

	exports.default = Keyboard;


	function addListeners(self) {

	  self.inputTarget.querySelector('.viewer').addEventListener('click', function () {
	    self.inputTarget.focus();
	  });

	  _domEvent2.default.add(document.body, 'keydown', function (event) {

	    var keyCode = event.which;
	    if (keyCode < 65 || keyCode > 90 || event.ctrlKey === true || event.altKey === true) {
	      //!A-Z || ctrl || alt
	      event.preventDefault();
	      sendKey(self, event);
	    }
	    event.stopPropagation();
	    return false;
	  });

	  _domEvent2.default.add(document.body, 'keypress', function (event) {

	    var keyCode = event.which;
	    if (keyCode >= 97 && keyCode <= 122) {
	      //lowercase
	      self.state.capslock = event.shiftKey;
	      sendKey(self, event);
	    } else if (keyCode >= 65 && keyCode <= 90 && !(event.shiftKey && self.isMac)) {
	      //uppercase
	      self.state.capslock = !event.shiftKey;
	      sendKey(self, event);
	    }
	    event.stopPropagation();
	    event.preventDefault();
	    return false;
	  });

	  _domEvent2.default.add(document.body, 'keyup', function (event) {

	    var keyCode = event.which;
	    sendKey(self, event);
	    event.stopPropagation();
	    event.preventDefault();
	    return false;
	  });
	}

	function preventEvent(event) {
	  event.stopPropagation();
	  event.preventDefault();
	  return false;
	}

	function sendKey(self, event) {

	  if (self.active === false || event.target !== self.inputTarget) {
	    return;
	  }
	  var isDown = event.type == 'keydown' || event.type == 'keypress' ? 1 : 0,
	      keyCode = event.which,
	      isShift = event.shiftKey,
	      specialkeystate = 0;
	  if (event.type == 'keypress' && keyCode >= 97 && keyCode <= 122) {
	    keyCode -= 32;
	  }
	  if (self.keysym[keyCode] !== undefined) {
	    keyCode = self.keysym[keyCode];
	    if (keyCode < 0) {
	      keyCode = -keyCode;
	      isShift = true;
	    }
	  }
	  if (keyCode === 0) {
	    return;
	  }
	  if (event.getModifierState !== undefined) {
	    self.state.capslock = self.state.capslock || event.getModifierState('CapsLock');
	    self.state.numlock = event.getModifierState('NumLock');
	    self.state.scrolllock = event.getModifierState('ScrollLock') === true || event.getModifierState('Scroll') === true;
	  }
	  if (self.state.capslock === true) {
	    specialkeystate += 1;
	  }
	  if (self.state.numlock === true) {
	    specialkeystate += 2;
	  }
	  if (self.state.scrolllock === true) {
	    specialkeystate += 4;
	  }
	  if (isShift === true) {
	    specialkeystate += 8;
	  }

	  self.emitter.emit('keyboardUpdate', {
	    'down': isDown,
	    'key': parseInt(keyCode),
	    'specialkeystate': specialkeystate
	  });
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * dom event listenners
	 * @version 1.0
	 * @author  Jeong Heeju
	 * @module {object} dom-event
	 */
	'use strict';

	/**
	 * 이벤트 리스너
	 * @param {HTMLElement} el       event target element
	 * @param {String}      name     event name
	 * @param {Function}    listener event handler
	 * @param {Array}       store    listener 저장배열
	 */

	function addListeners(el, name, listener, store) {
	  var events = [],
	      isStore = store !== undefined && Array.isArray(store) === true;

	  if (Array.isArray(name) === true) {
	    events = name;
	  } else {
	    events = name.split(' ');
	  }

	  for (var i = 0; i < events.length; i++) {
	    el.addEventListener(events[i], listener, false);
	    if (isStore === true) {
	      store.push({
	        'el': el,
	        'name': events[i],
	        'listener': listener
	      });
	    }
	  }
	}

	/**
	 * 이벤트 리스너 삭제
	 * @param {Array} stored listener 저장배열
	 */
	function removeAllListeners(stored) {
	  if (stored === undefined || Array.isArray(stored) === false) {
	    return false;
	  }

	  for (var i = 0; i < stored.length; i++) {
	    stored[i].el.removeEventListener(stored[i].name, stored[i].listener, false);
	  }
	  stored = [];
	}

	/**
	 * 한번만 실행되는 listener
	 * @param {HTMLElement} el       event target element
	 * @param {String}      name     event name
	 * @param {Function}    listener event listener
	 */
	function once(el, name, listener) {
	  var events = [];

	  if (Array.isArray(name) === true) {
	    events = name;
	  } else {
	    events = name.split(' ');
	  }

	  for (var i = 0; i < events.length; i++) {
	    el.addEventListener(events[i], function (event) {
	      event.target.removeEventListener(event.type, arguments.callee);
	      listener.call(this, event);
	    }, false);
	  }
	}

	module.exports = {
	  'add': addListeners,
	  'removeAll': removeAllListeners,
	  'once': once
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domHelper = __webpack_require__(12);

	var _domHelper2 = _interopRequireDefault(_domHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Emitter = __webpack_require__(11);

	var Scroller = function (_Emitter) {
	  _inherits(Scroller, _Emitter);

	  function Scroller(option) {
	    _classCallCheck(this, Scroller);

	    var _this = _possibleConstructorReturn(this, (Scroller.__proto__ || Object.getPrototypeOf(Scroller)).call(this));

	    _this.op = option;

	    _this.scrollWrap = document.querySelector(".viewer-wrap");
	    _this.scrollInner = _this.scrollWrap.querySelector('.viewer');

	    _this.scrollShowTimeout = null;

	    _this.psX = null;
	    _this.psY = null;

	    _this.scX = null;
	    _this.scY = null;

	    _this.rating = {
	      'X': 0,
	      'Y': 0
	    };

	    _this.drag = {
	      'X': false,
	      'Y': false
	    };

	    _this.scrollMoveTimeout = {
	      X: null,
	      Y: null
	    };

	    _this.scrollDragStandard = {
	      X: [],
	      Y: []
	    }, _this.addScroll();
	    _this.makeScrollPosition();
	    _this.setScrollTop();
	    _this.initEvent();

	    return _this;
	  }

	  _createClass(Scroller, [{
	    key: 'addScroll',
	    value: function addScroll() {

	      var jwscrollWrap = this.scrollWrap;

	      this.scY = document.createElement("div");
	      this.psY = document.createElement("div");
	      this.psY.className = "ps-y";
	      this.scY.className = "sc-y";
	      this.scY.appendChild(this.psY);
	      jwscrollWrap.appendChild(this.scY);

	      this.scX = document.createElement("div");
	      this.psX = document.createElement("div");
	      this.psX.className = "ps-x";
	      this.scX.className = "sc-x";
	      this.scX.appendChild(this.psX);
	      jwscrollWrap.appendChild(this.scX);
	    }
	  }, {
	    key: 'makeScrollPosition',
	    value: function makeScrollPosition() {
	      var jwscroll = this.scrollInner;

	      var psY = this.psY;
	      var scrollHeight = jwscroll.scrollHeight;
	      var clientHeight = jwscroll.clientHeight;
	      var posHeight = parseInt(clientHeight * (clientHeight / scrollHeight));
	      psY.style.height = posHeight + "px";

	      var psX = this.psX;
	      var scrollWidth = jwscroll.scrollWidth;
	      var clientWidth = jwscroll.clientWidth;
	      var posWidth = parseInt(clientWidth * (clientWidth / scrollWidth));
	      psX.style.width = posWidth + "px";
	    }
	  }, {
	    key: 'setScrollTop',
	    value: function setScrollTop() {

	      var jwscroll = this.scrollInner;

	      var psY = this.psY;
	      var scrollHeight = jwscroll.scrollHeight;
	      var clientHeight = jwscroll.clientHeight;
	      this.rating.Y = clientHeight / scrollHeight;
	      var scrollTop = jwscroll.scrollTop * this.rating.Y;
	      psY.style.top = scrollTop + "px";

	      var psX = this.psX;
	      var scrollWidth = jwscroll.scrollWidth;
	      var clientWidth = jwscroll.clientWidth;
	      this.rating.X = clientWidth / scrollWidth;
	      var scrollLeft = jwscroll.scrollLeft * this.rating.X;
	      psX.style.left = scrollLeft + "px";
	    }
	  }, {
	    key: 'scrollShy',
	    value: function scrollShy() {
	      var _this2 = this;

	      _domHelper2.default.addClass(this.scX, 'show');
	      _domHelper2.default.addClass(this.scY, 'show');

	      clearTimeout(this.scrollShowTimeout);

	      this.scrollShowTimeout = setTimeout(function () {
	        _domHelper2.default.removeClass(_this2.scX, 'show');
	        _domHelper2.default.removeClass(_this2.scY, 'show');
	      }, 1000);
	    }
	  }, {
	    key: 'initEvent',
	    value: function initEvent() {

	      var self = this;

	      self.scrollWrap.addEventListener('mouseleave', function () {

	        if (self.scrollMoveTimeout['X']) {
	          clearTimeout(self.scrollMoveTimeout['X']);
	          self.scrollMoveTimeout['X'] = null;
	        }

	        if (self.scrollMoveTimeout['Y']) {
	          clearTimeout(self.scrollMoveTimeout['Y']);
	          self.scrollMoveTimeout['Y'] = null;
	        }
	      });

	      document.addEventListener('mousemove', function (evt) {

	        if (evt.target.id == 'screen' || evt.target.id == 'whiteboard') {
	          self.scrollAutoMoveAction('X', evt);
	          self.scrollAutoMoveAction('Y', evt);
	        }

	        if (evt.buttons != 1) {
	          self.drag.X = false;
	          self.drag.Y = false;
	          return;
	        }

	        if (self.drag.X) {
	          var changePx = evt.screenX - self.scrollDragStandard.X[0];
	          var changeLeft = changePx / self.rating.X;
	          var scrollLeft = self.scrollDragStandard.X[1] + changeLeft;
	          self.scrollInner.scrollLeft = scrollLeft;
	        }

	        if (self.drag.Y) {
	          var changePx = evt.screenY - self.scrollDragStandard.Y[0];
	          var changeTop = changePx / self.rating.Y;
	          var scrollTop = self.scrollDragStandard.Y[1] + changeTop;
	          self.scrollInner.scrollTop = scrollTop;
	        }

	        evt.stopPropagation();
	      });

	      window.addEventListener('mouseup', function () {
	        self.drag.X = false;
	        self.drag.Y = false;
	      });

	      self.scrollInner.addEventListener('scroll', function () {
	        self.setScrollTop();
	        self.scrollShy();
	      });

	      window.addEventListener('resize', function () {
	        self.makeScrollPosition();
	        self.setScrollTop();
	      });

	      self.psY.addEventListener('mousedown', function (evt) {
	        self.scrollDragStandard.Y[0] = evt.screenY;
	        self.scrollDragStandard.Y[1] = self.scrollInner.scrollTop;
	        self.drag.Y = true;
	      });

	      self.psX.addEventListener('mousedown', function (evt) {
	        self.scrollDragStandard.X[0] = evt.screenX;
	        self.scrollDragStandard.X[1] = self.scrollInner.scrollLeft;
	        self.drag.X = true;
	      });

	      self.scX.addEventListener('mouseenter', function () {
	        self.clearScrollMoveTimeout();
	        self.scrollShy();
	      });

	      self.scY.addEventListener('mouseenter', function () {
	        self.clearScrollMoveTimeout();
	        self.scrollShy();
	      });
	    }
	  }, {
	    key: 'clearScrollMoveTimeout',
	    value: function clearScrollMoveTimeout() {
	      var self = this;
	      if (self.scrollMoveTimeout['X']) {
	        clearTimeout(self.scrollMoveTimeout['X']);
	        self.scrollMoveTimeout['X'] = null;
	      }

	      if (self.scrollMoveTimeout['Y']) {
	        clearTimeout(self.scrollMoveTimeout['Y']);
	        self.scrollMoveTimeout['Y'] = null;
	      }
	    }
	  }, {
	    key: 'scrollAutoMoveAction',
	    value: function scrollAutoMoveAction(scrollType, evt) {

	      var self = this;
	      var getTypeValue = {
	        'X': {
	          'size': self.scrollWrap.clientWidth,
	          'scTarget': 'scrollLeft'
	        },
	        'Y': {
	          'size': self.scrollWrap.clientHeight,
	          'scTarget': 'scrollTop'
	        }
	      };

	      var pointer = evt['client' + scrollType] - self.op.bounding[scrollType];
	      var postionStart = parseInt(getTypeValue[scrollType].size / 8);
	      var postionEnd = parseInt(getTypeValue[scrollType].size - postionStart);

	      if (pointer > postionEnd && !self.scrollMoveTimeout[scrollType]) {
	        self.scrollMoveTimeout[scrollType] = setInterval(function () {
	          self.scrollInner[getTypeValue[scrollType].scTarget] += 3;
	        }, 10);
	      } else if (pointer < postionStart && !self.scrollMoveTimeout[scrollType]) {
	        self.scrollMoveTimeout[scrollType] = setInterval(function () {
	          self.scrollInner[getTypeValue[scrollType].scTarget] -= 3;
	        }, 10);
	      } else if (pointer <= postionEnd && pointer >= postionStart && self.scrollMoveTimeout[scrollType]) {
	        clearTimeout(self.scrollMoveTimeout[scrollType]);
	        self.scrollMoveTimeout[scrollType] = null;
	      }
	    }
	  }]);

	  return Scroller;
	}(Emitter);

	exports.default = Scroller;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _shape = __webpack_require__(18);

	var _domHelper = __webpack_require__(12);

	var _domHelper2 = _interopRequireDefault(_domHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Whiteboard = function () {
	  function Whiteboard(option) {
	    _classCallCheck(this, Whiteboard);

	    this.emitter = option.emitter;

	    this.scaleWrap = document.querySelector(".scale-wrap");
	    this.screen = document.querySelector("#screen"), this.positions = [];

	    this.point = { x: 0, y: 0 };

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
	    this.canvas.width = this.screen.offsetWidth;
	    this.canvas.height = this.screen.offsetHeight;

	    this.canvas.tabIndex = 0;
	    this.scaleWrap.appendChild(this.canvas);

	    this.context = this.canvas.getContext('2d');

	    this.shape = null;

	    this.addEvent();
	  }

	  _createClass(Whiteboard, [{
	    key: 'on',
	    value: function on() {
	      this.power = true;
	      _domHelper2.default.addClass(this.canvas, 'show');

	      this.emitter.emit('whiteboardToggle', this.power);
	      this.emitter.emit('whiteboardUpdate', 'Draw:Start');
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      this.power = false;
	      _domHelper2.default.removeClass(this.canvas, 'show');

	      this.emitter.emit('whiteboardToggle', this.power);
	      this.emitter.emit('whiteboardUpdate', 'Draw:End');
	    }
	  }, {
	    key: 'drawFreeLineMove',
	    value: function drawFreeLineMove(evt) {

	      var self = this;

	      var x = evt.offsetX;
	      var y = evt.offsetY;

	      var last = this.positions.length - 1;

	      if (last > 0) {
	        self.context.save();
	        self.context.moveTo(0, 0);
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
	  }, {
	    key: 'drawShapeStart',
	    value: function drawShapeStart(evt) {

	      var self = this;

	      var x = evt.offsetX;
	      var y = evt.offsetY;

	      var type = self.ShpeType[self.type];
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

	      self.shape = new _shape.Shape(type, {
	        'x1': x,
	        'y1': y,
	        'x2': x,
	        'y2': y,
	        'lineWidth': self.width,
	        'strokeStyle': self.color
	      });
	    }
	  }, {
	    key: 'drawShapeMove',
	    value: function drawShapeMove(evt) {

	      var self = this;
	      var x = evt.offsetX;
	      var y = evt.offsetY;

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
	  }, {
	    key: 'drawArrowHead',
	    value: function drawArrowHead() {

	      var self = this;

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
	      self.context.lineTo(-18 - self.width, 3 + self.width);
	      self.context.lineTo(-18 - self.width, -3 - self.width);
	      self.context.closePath();
	      self.context.lineJoin = 'round';
	      self.context.fillStyle = self.color;
	      self.context.fill();
	      self.context.restore();
	    }
	  }, {
	    key: 'addEvent',
	    value: function addEvent() {
	      var _this = this;

	      var self = this;

	      this.canvas.addEventListener('mousemove', function (evt) {

	        if (evt.buttons != 1) {
	          return false;
	        }

	        if (_this.type == 0) {
	          _this.drawFreeLineMove(evt);
	        } else {
	          _this.drawShapeMove(evt);
	        }
	      });

	      document.getElementById("wb-type").addEventListener("change", function () {
	        self.type = this.value;
	      });

	      document.getElementById("wb-width").addEventListener("change", function () {
	        self.width = this.value;
	      });

	      document.getElementById("wb-color").addEventListener("change", function () {
	        self.color = this.value;
	      });

	      this.canvas.addEventListener('mousedown', function (evt) {

	        // 1. 스타일 세팅

	        _this.positions = [];

	        if (_this.type == 0) {
	          _this.drawFreeLineMove(evt);
	        } else {
	          _this.drawShapeStart(evt);
	        }

	        _this.emitter.emit('whiteboardUpdate', 'Draw:Info', {
	          type: self.type,
	          color: hexCodeToByte(self.color),
	          thickness: self.width,
	          realtime: 0
	        });
	      });

	      this.canvas.addEventListener('mouseup', function (evt) {

	        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

	        _this.emitter.emit('whiteboardUpdate', 'Draw:Data', {
	          positions: self.positions
	        });
	      });

	      document.getElementById('wb-toggle').addEventListener('click', function () {
	        if (_this.power) {
	          _this.off();
	        } else {
	          _this.on();
	        }
	      });
	    }
	  }]);

	  return Whiteboard;
	}();

	exports.default = Whiteboard;


	function hexCodeToByte(hex) {
	  hex = hex.replace(/^#/, '');
	  var r = 0,
	      g = 0,
	      b = 0;

	  if (hex.length != 6) {}

	  r = parseInt(hex.substr(0, 2), 16);
	  g = parseInt(hex.substr(2, 2), 16);
	  b = parseInt(hex.substr(4, 2), 16);

	  return b << 16 | g << 8 | r;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _shape = __webpack_require__(19);

	var _shape2 = _interopRequireDefault(_shape);

	var _batch = __webpack_require__(20);

	var _batch2 = _interopRequireDefault(_batch);

	var _draw = __webpack_require__(23);

	var _draw2 = _interopRequireDefault(_draw);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  'Shape': _shape2.default,
	  'Batch': _batch2.default,
	  'Draw': _draw2.default
	}; /**
	    * shape utility exports
	    * @version 1.0
	    * @author  Jeong Heeju
	    *
	    * @module shape
	    * @requires module:shape/lib/shape
	    * @requires module:shape/lib/batch
	    * @requires module:shape/lib/draw
	    */

/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Make shape. Draw to canvas 2d and animation
	 * @version 1.0
	 * @author  Jeong Heeju
	 * @module  {function} shape/lib/shape
	 */

	'use strict';

	/**
	 * 가능한 도형 type
	 * @type {Array}
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Shape;
	var enableTypes = ['line', 'rect', 'circle'],


	/**
	 * 경계 사각형 얻기 함수
	 * @type {Object}
	 */
	getBoundingFunc = {
	  'line': getLineBounding,
	  'rect': getRectBounding,
	  'circle': getCircleBounding
	},


	/**
	 * 마우스 좌표 얻기 함수
	 * @type {Object}
	 */
	containsFunc = {
	  'line': containsLine,
	  'rect': containsRect,
	  'circle': containsCircle
	},


	/**
	 * 그리기 함수
	 * @type {Object}
	 */
	drawFunc = {
	  'line': drawLine,
	  'rect': drawRect,
	  'circle': drawCircle
	},


	/**
	 * shape에 사용하는 변수 명들
	 * @type {Array}
	 */
	shapeVars = ['x1', 'y1', 'x2', 'y2', 'centerX', 'centerY', 'scaleX', 'scaleY', 'rotate', 'translateX', 'translateY', 'fillStyle', 'lineWidth', 'strokeStyle', 'img', 'opacity', 'drawGapX', 'drawGapY'],


	/**
	 * 변경 가능한 값들
	 * @type {Array}
	 */
	changeableShapeVars = ['x1', 'y1', 'x2', 'y2', 'centerX', 'centerY', 'scaleX', 'scaleY', 'rotate', 'translateX', 'translateY'],


	/**
	 * transition 되는 값들
	 * @type {Array}
	 */
	transitionShapeVars = ['x1', 'y1', 'x2', 'y2', 'centerX', 'centerY', 'scaleX', 'scaleY', 'rotate', 'translateX', 'translateY', 'opacity'],


	/**
	 * timing으로 사용할 함수
	 * @type {function}
	 */
	timing = window.performance || Date;

	/**
	 * 도형생성
	 * @param {string} type   shape 타입 (line,rect,circle)
	 * @param {object} values 생성시 좌표(x1,y1,x2,y2) 및 transition 값
	 * @constructor
	 */
	function Shape(type, values) {
	  if (type instanceof Object) {
	    values = type;
	    if (values.type === undefined) {
	      return;
	    }
	    type = values.type;
	  }

	  if (enableTypes.indexOf(type) === -1) {
	    return;
	  }

	  this.boundingStyle = {
	    fillStyle: '#bbb',
	    opacity: .6
	  };

	  var self = this,
	      variables = {};

	  variables.type = type;
	  // coordinates
	  variables.x1 = 0;
	  variables.y1 = 0;
	  variables.x2 = 0;
	  variables.y2 = 0;
	  //transform
	  variables.scaleX = 1;
	  variables.scaleY = 1;
	  variables.rotate = 0;
	  variables.translateX = 0;
	  variables.translateY = 0;
	  //style
	  variables.opacity = 1;
	  //draw gap
	  variables.drawGapX = 0;
	  variables.drawGapY = 0;

	  /**
	   * shape값 설정, 변경
	   * @param {string} name           변수 이름
	   * @param {string|number} value   변수 값
	   * @param {boolean}       doApply 바로 적용 flag
	   */
	  this.setValue = function setValue(name, value, doApply) {
	    var changed = false;

	    if (name instanceof Object) {
	      var keys = Object.keys(name),
	          i = keys.length;

	      while (i--) {
	        changed = setValue(keys[i], name[keys[i]], false) || changed;
	      }

	      if (changed === true) {
	        variables = convertValues(variables, true);
	        self.bounding = variables.bounding;
	      }
	      return;
	    }

	    //set values
	    if (shapeVars.indexOf(name) > -1 && variables[name] !== value) {
	      variables[name] = value;
	      if (changeableShapeVars.indexOf(name) > -1) {
	        changed = true;
	      }
	    }

	    //setScale
	    if (name === 'scale') {
	      variables.scaleX = value;
	      variables.scaleY = value;
	      changed = true;
	    }

	    if (changed === true && doApply !== false) {
	      variables = convertValues(variables, true);
	      self.bounding = variables.bounding;
	    }

	    return changed;
	  };

	  /**
	   * shape 값 얻기
	   * @param  {string}                 name  변수 명
	   * @return {number|object|boolean}        값
	   */
	  this.getValue = function getValue(name) {
	    if (typeof name === 'string') {
	      return variables[name];
	    }

	    if (Array.isArray(name)) {
	      var result = {};

	      for (var i = 0; i < name.length; i++) {
	        result[name[i]] = variables[name[i]];
	      }
	      return result;
	    }
	  };

	  this.setValue(values);
	}

	/**
	 * 특정좌표가 중심점으로부터 몇도 기울였을때 변화된 좌표값 구하기
	 * @param  {number} x     좌표 x coordinate
	 * @param  {number} y     좌표 x coordinate
	 * @param  {number} degs  기울일 각도
	 * @param  {number} [cx]  중심 x coordinate 없으면 0
	 * @param  {number} [cy]  중심 x coordinate 없으면 0
	 * @return {object}       기울여진 좌표 값
	 */
	function getRotateCoordinate(x, y, degs, cx, cy) {
	  var radian = degs * Math.PI / 180,
	      sin = Math.sin(radian),
	      cos = Math.cos(radian),
	      cx = cx || 0,
	      cy = cy || 0;

	  return {
	    x: cos * (x - cx) - sin * (y - cy) + cx,
	    y: sin * (x - cx) + cos * (y - cy) + cy
	  };
	}

	/**
	 * 값 변경
	 * @param  {object} vars 변경할 값 모음
	 * @return {object}      변경된 값
	 */
	function convertValues(vars) {
	  vars.coordinates = {
	    x1: vars.x1 + vars.translateX,
	    y1: vars.y1 + vars.translateY,
	    x2: vars.x2 + vars.translateX,
	    y2: vars.y2 + vars.translateY
	  };

	  var shapeCenter = {
	    x: (vars.coordinates.x1 + vars.coordinates.x2) / 2,
	    y: (vars.coordinates.y1 + vars.coordinates.y2) / 2
	  };

	  vars.coordinates.centerX = shapeCenter.x;
	  vars.coordinates.centerY = shapeCenter.y;

	  if (vars.centerX === null || vars.centerX === undefined) {
	    vars.centerX = shapeCenter.x;
	  }

	  if (vars.centerY === null || vars.centerY === undefined) {
	    vars.centerY = shapeCenter.y;
	  }

	  var tCenterX = vars.centerX + vars.translateX,
	      tCenterY = vars.centerY + vars.translateY;

	  vars.width = Math.abs(vars.x2 - vars.x1);
	  vars.height = Math.abs(vars.y2 - vars.y1);
	  vars.radian = vars.rotate * Math.PI / 180;

	  if (tCenterX !== vars.coordinates.centerX || tCenterY !== vars.coordinates.centerY) {

	    if (vars.scaleX !== 1) {
	      vars.coordinates.centerX = tCenterX - (tCenterX - vars.coordinates.centerX) * vars.scaleX;
	    }

	    if (vars.scaleY !== 1) {
	      vars.coordinates.centerY = tCenterY - (tCenterY - vars.coordinates.centerY) * vars.scaleY;
	    }

	    if (vars.rotate % 360 !== 0) {
	      var rotated = getRotateCoordinate(vars.coordinates.centerX, vars.coordinates.centerY, vars.rotate, tCenterX, tCenterY);
	      vars.coordinates.centerX = rotated.x;
	      vars.coordinates.centerY = rotated.y;
	    }

	    vars.coordinates.x1 = vars.x1 - shapeCenter.x + vars.coordinates.centerX + vars.translateX;
	    vars.coordinates.y1 = vars.y1 - shapeCenter.y + vars.coordinates.centerY + vars.translateY;
	    vars.coordinates.x2 = vars.x2 - shapeCenter.x + vars.coordinates.centerX + vars.translateX;
	    vars.coordinates.y2 = vars.y2 - shapeCenter.y + vars.coordinates.centerY + vars.translateY;
	  }

	  //transition to draw
	  vars.drawTranslate = {
	    x: Math.min(vars.coordinates.x1, vars.coordinates.x2) + vars.width / 2,
	    y: Math.min(vars.coordinates.y1, vars.coordinates.y2) + vars.height / 2
	  };

	  // bounding area
	  // if (getBounding === true) {
	  vars.bounding = getBoundingFunc[vars.type](vars.coordinates.x1, vars.coordinates.y1, vars.coordinates.x2, vars.coordinates.y2, vars.coordinates.centerX, vars.coordinates.centerY, vars.scaleX, vars.scaleY, vars.rotate);
	  // }

	  return vars;
	}

	/**
	 * [drawToCanvas description]
	 * @param  {CanvasRenderingContext2D} context canvas 2d context
	 * @param  {string}                   type                @see enableTypes
	 * @param  {object}                   shape               도형 변수모음
	 * @param  {number}                   [shape.width]       도형 너비
	 * @param  {number}                   [shape.height]      도형 높이
	 * @param  {object}                   [shape.coordinates] 도형 좌표
	 * @param  {number}                   shape.radian        도형 기울기
	 * @param  {number}                   shape.scaleX        도형 x scale
	 * @param  {number}                   shape.scaleY        도형 y scale
	 * @param  {number}                   shape.drawGapX      도형 그리기 x보정값
	 * @param  {number}                   shape.drawGapY      도형 그리기 y보정값
	 * @param  {object}                   style               2d context styles
	 * @param  {number}                   style.opacity       투명도
	 * @param  {string}                   style.fillStyle     면 채움 색상
	 * @param  {string}                   style.strokeStyle   선 색상
	 * @param  {number}                   style.lineWidth     선 두께
	 * @param  {HTMLImageElement}         [img]               도형안에 들어가는 이미지
	 * @return {null}
	 */
	function drawToCanvas(context, type, shape, style, img) {
	  var scaleX = shape.scaleX || 1,
	      scaleY = shape.scaleY || 1,
	      radian = shape.radian || 0,
	      width = shape.width || Math.abs(shape.coordinates.x2 - shape.coordinates.x1),
	      height = shape.height || Math.abs(shape.coordinates.y2 - shape.coordinates.y1),
	      tx = shape.drawTranslate && shape.drawTranslate.x || Math.min(shape.coordinates.x1, shape.coordinates.x2) + width / 2,
	      ty = shape.drawTranslate && shape.drawTranslate.y || Math.min(shape.coordinates.y1, shape.coordinates.y2) + height / 2;

	  if (shape.drawGapX !== undefined) {
	    tx += shape.drawGapX;
	  }

	  if (shape.drawGapY !== undefined) {
	    ty += shape.drawGapY;
	  }

	  // 2d context
	  context.save();

	  if (style.opacity < 1) {
	    context.globalAlpha = style.opacity;
	  }
	  context.translate(tx, ty);
	  context.rotate(radian);
	  context.scale(scaleX, scaleY);

	  context.beginPath();
	  drawFunc[type](context, width, height, shape.coordinates);
	  context.closePath();

	  if (img !== undefined) {
	    context.clip();
	    context.drawImage(img, -width / 2, -height / 2, width, height);
	  } else if (style.fillStyle !== undefined) {
	    context.fillStyle = style.fillStyle;
	    context.fill();
	  }

	  if (style.strokeStyle !== undefined && style.lineWidth > 0) {
	    context.lineWidth = style.lineWidth;
	    context.strokeStyle = style.strokeStyle;
	    context.stroke();
	  }

	  context.restore();
	}

	/**
	 * line type 그리기
	 * @param  {CanvasRenderingContext2D} context
	 * @param  {number}                   [width]
	 * @param  {number}                   [height]
	 * @param  {object}                   coordinates 선 좌표
	 * @return {null}
	 */
	function drawLine(context, width, height, coordinates) {
	  width = (coordinates.x2 - coordinates.x1) / 2;
	  height = (coordinates.y2 - coordinates.y1) / 2;
	  context.moveTo(-width, -height);
	  context.lineTo(width, height);
	}

	/**
	 * rect type 그리기
	 * @param  {CanvasRenderingContext2D} context
	 * @param  {number}                   width   사각형 너비
	 * @param  {number}                   height  사각형 높이
	 * @return {null}
	 */
	function drawRect(context, width, height) {
	  context.rect(-width / 2, -height / 2, width, height);
	}

	/**
	 * circle type 그리기
	 * @param  {CanvasRenderingContext2D} context
	 * @param  {number}                   width   타원 너비
	 * @param  {number}                   height  타원 높이
	 * @return {null}
	 */
	function drawCircle(context, width, height) {
	  var kappa = .5522848,
	      rx = width / 2,
	      ry = height / 2,
	      t = -ry * kappa,
	      r = rx * kappa,
	      b = ry * kappa,
	      l = -rx * kappa;

	  context.moveTo(0, -ry);
	  context.bezierCurveTo(r, -ry, rx, t, rx, 0);
	  context.bezierCurveTo(rx, b, r, ry, 0, ry);
	  context.bezierCurveTo(l, ry, -rx, b, -rx, 0);
	  context.bezierCurveTo(-rx, t, l, -ry, 0, -ry);
	}

	function containsLine(x, y, vals) {
	  return false;
	}

	/**
	 * line type 경계 사각형 구하기
	 * @param  {number} x1
	 * @param  {number} y1
	 * @param  {number} x2
	 * @param  {number} y2
	 * @param  {number} cx     중심점 x 좌표
	 * @param  {number} cy     중심점 y 좌표
	 * @param  {number} scaleX
	 * @param  {number} scaleY
	 * @param  {number} degs   기울기 값
	 * @return {object}        경계 사각형 좌표
	 */
	function getLineBounding(x1, y1, x2, y2, cx, cy, scaleX, scaleY, degs) {
	  return getRectBounding(x1, y1, x2, y2, cx, cy, scaleX, scaleY, degs);
	}

	/**
	 * 특정 좌표가 사각형 안에 포함되는지 검사
	 * @param  {number} x             특정 좌표 x
	 * @param  {number} y             특정 좌표 y
	 * @param  {object} shape         도형 특성값들
	 * @param  {object} shape.x1      도형 x1좌표
	 * @param  {object} shape.y1      도형 y1좌표
	 * @param  {object} shape.x2      도형 x2좌표
	 * @param  {object} shape.y2      도형 y2좌표
	 * @param  {object} shape.centerX 도형 중심 x 좌표
	 * @param  {object} shape.centerY 도형 중심 y 좌표
	 * @param  {object} shape.scaleX  도형 x sclae
	 * @param  {object} shape.scaleY  도형 y sclae
	 * @param  {object} shape.rotate  도형 기울기
	 * @return {boolean|object}       좌표가 도형안에 있으면 상대 좌표, 없으면 false
	 */
	function containsRect(x, y, shape) {
	  var cx = shape.centerX,
	      cy = shape.centerY,
	      x1 = cx - (cx - shape.x1) * shape.scaleX,
	      y1 = cy - (cy - shape.y1) * shape.scaleY,
	      x2 = cx - (cx - shape.x2) * shape.scaleX,
	      y2 = cy - (cy - shape.y2) * shape.scaleY;

	  var minX = Math.min(x1, x2),
	      maxX = Math.max(x1, x2),
	      minY = Math.min(y1, y2),
	      maxY = Math.max(y1, y2),
	      point = { x: x, y: y };

	  if (shape.rotate % 360 !== 0) {
	    point = getRotateCoordinate(x, y, -shape.rotate, cx, cy);
	  }

	  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
	    return false;
	  }

	  return {
	    x: Math.round((point.x - minX) / shape.scaleX),
	    y: Math.round((point.y - minY) / shape.scaleY)
	  };
	}

	/**
	 * rect type 경계 사각형 구하기
	 * @param  {number} x1
	 * @param  {number} y1
	 * @param  {number} x2
	 * @param  {number} y2
	 * @param  {number} cx     중심점 x 좌표
	 * @param  {number} cy     중심점 y 좌표
	 * @param  {number} scaleX
	 * @param  {number} scaleY
	 * @param  {number} degs   기울기 값
	 * @return {object}        경계 사각형 좌표
	 */
	function getRectBounding(x1, y1, x2, y2, cx, cy, scaleX, scaleY, degs) {
	  var w = Math.abs(x2 - x1) * scaleX,
	      h = Math.abs(y2 - y1) * scaleY,
	      degs = Math.abs(degs % 360);

	  if (degs > 90 && degs < 180 || degs > 270 && degs < 360) {
	    degs = 180 - degs;
	  }

	  var radian = degs * Math.PI / 180,
	      sin = Math.sin(radian),
	      cos = Math.cos(radian),
	      dx = sin * h + cos * w,
	      dy = sin * w + cos * h;

	  if (degs >= 0 && degs <= 90) {
	    x1 = cx - dx / 2;
	    y1 = cy - dy / 2;
	    x2 = cx + dx / 2;
	    y2 = cy + dy / 2;
	  } else {
	    x1 = cx + dx / 2;
	    y1 = cy + dy / 2;
	    x2 = cx - dx / 2;
	    y2 = cy - dy / 2;
	  }

	  return {
	    x1: x1,
	    y1: y1,
	    x2: x2,
	    y2: y2
	  };
	}

	/**
	 * 특정 좌표가 원 안에 포함되는지 검사
	 * @param  {number} x             특정 좌표 x
	 * @param  {number} y             특정 좌표 y
	 * @param  {object} shape         도형 특성값들
	 * @param  {object} shape.x1      도형 x1좌표
	 * @param  {object} shape.y1      도형 y1좌표
	 * @param  {object} shape.x2      도형 x2좌표
	 * @param  {object} shape.y2      도형 y2좌표
	 * @param  {object} shape.centerX 도형 중심 x 좌표
	 * @param  {object} shape.centerY 도형 중심 y 좌표
	 * @param  {object} shape.scaleX  도형 x sclae
	 * @param  {object} shape.scaleY  도형 y sclae
	 * @param  {object} shape.rotate  도형 기울기
	 * @return {boolean|object}       좌표가 도형안에 있으면 상대 좌표, 없으면 false
	 */
	function containsCircle(x, y, shape) {
	  var x1 = shape.x1,
	      y1 = shape.y1,
	      x2 = shape.x2,
	      y2 = shape.y2,
	      cx = shape.centerX,
	      cy = shape.centerY,
	      rx = (x2 - x1) / 2,
	      ry = (y2 - y1) / 2,
	      dim = { x: x - rx - x1, y: y - ry - y1 };

	  if (shape.rotate % 360 !== 0) {
	    dim = getRotateCoordinate(dim.x, dim.y, -shape.rotate);
	  }

	  var dx = dim.x / shape.scaleX,
	      dy = dim.y / shape.scaleY;

	  if (dx * dx / (rx * rx) + dy * dy / (ry * ry) > 1) {
	    return false;
	  }

	  var point = { x: x, y: y },
	      minX = Math.min(cx - (cx - x1) * shape.scaleX, cx - (cx - x2) * shape.scaleX),
	      minY = Math.min(cy - (cy - y1) * shape.scaleY, cy - (cy - y2) * shape.scaleY);

	  if (shape.rotate % 360 !== 0) {
	    point = getRotateCoordinate(x, y, -shape.rotate, cx, cy);
	  }

	  return {
	    x: Math.round((point.x - minX) / shape.scaleX),
	    y: Math.round((point.y - minY) / shape.scaleY)
	  };
	}

	/**
	 * circle type 경계 사각형 구하기
	 * @param  {number} x1
	 * @param  {number} y1
	 * @param  {number} x2
	 * @param  {number} y2
	 * @param  {number} cx     중심점 x 좌표
	 * @param  {number} cy     중심점 y 좌표
	 * @param  {number} scaleX
	 * @param  {number} scaleY
	 * @param  {number} degs   기울기 값
	 * @return {object}        경계 사각형 좌표
	 */
	function getCircleBounding(x1, y1, x2, y2, cx, cy, scaleX, scaleY, degs) {
	  var rx = (x2 - x1) / 2 * scaleX,
	      ry = (y2 - y1) / 2 * scaleY;

	  var radian = Math.PI / 180 * degs,
	      sin = Math.sin(radian),
	      cos = Math.cos(radian),
	      x = Math.sqrt(rx * rx * cos * cos + ry * ry * sin * sin),
	      y = Math.sqrt(rx * rx * sin * sin + ry * ry * cos * cos);

	  return {
	    x1: Math.min(cx + x, cx - x),
	    y1: Math.min(cy + y, cy - y),
	    x2: Math.max(cx + x, cx - x),
	    y2: Math.max(cy + y, cy - y)
	  };
	}

	/**
	 * 애니메이션 loop 처리
	 * @param  {object} transition
	 * @param  {object} transition.fromVars   시작값
	 * @param  {object} transition.toVars     변화된 값
	 * @param  {object} transition.duration   전체 애니메이션 시간. duration
	 * @param  {object} transition.startTime  시작 시간 timestamp
	 * @param  {number} now                   현재 시간 timestamp
	 * @return {boolean|object}               duration이 지났으면 false, 변화된 값이 반영된 transition
	 */
	function transitionLoop(transition, now) {
	  var pass = now - transition.startTime;

	  if (pass > transition.duration) {
	    return false;
	  }

	  var keys = Object.keys(transition.fromVars),
	      i = keys.length,
	      dist,
	      currentVars = {};

	  while (i--) {
	    dist = transition.toVars[keys[i]] - transition.fromVars[keys[i]];
	    currentVars[keys[i]] = easingFunc(pass, transition.fromVars[keys[i]], dist, transition.duration);
	  }

	  return currentVars;
	}

	/**
	 * easing Function for animation
	 * @param  {number} t 지나온 시간
	 * @param  {number} b 시작 값
	 * @param  {number} c 최대 변화 값
	 * @param  {number} d duration
	 * @return {number}   변화한 값
	 */
	function easingFunc(t, b, c, d) {
	  // easeOutSine
	  // return c * Math.sin(t/d * (Math.PI/2)) + b;
	  // easeOutCubic
	  return c * ((t = t / d - 1) * t * t + 1) + b;
	}

	/**
	 * shape 값 변경 및 애니메이션 적용
	 * @param {object}   toVars     변경할 값 @see changeableShapeVars
	 * @param {number}   [duration] animation duration. 0 or undefined is no animation
	 * @param {Function} [callback] callback after animation end
	 */
	Shape.prototype.set = function (toVars, duration, callback) {
	  if (Object.keys(toVars).length === 0) {
	    return;
	  }

	  if (duration === false || duration === undefined || this.transition === undefined && (duration === undefined || duration <= 0)) {
	    return this.setValue(toVars);
	  }

	  if (toVars.scale !== undefined) {
	    toVars.scaleX = toVars.scaleY = toVars.scale;
	    delete toVars.scale;
	  }

	  var now = timing.now();
	  duration = duration || 0;

	  var keys = Object.keys(toVars),
	      i = keys.length;

	  while (i--) {
	    if (transitionShapeVars.indexOf(keys[i]) === -1) {
	      delete toVars[keys[i]];
	    }
	  }

	  if (this.transition !== undefined) {
	    keys = Object.keys(this.transition.toVars);
	    i = keys.length;

	    while (i--) {
	      if (toVars[keys[i]] === undefined) {
	        toVars[keys[i]] = this.transition.toVars[keys[i]];
	      }
	    }
	    duration = Math.max(duration, now - this.transition.startTime);
	  }

	  this.transition = {
	    fromVars: this.getValue(Object.keys(toVars)),
	    toVars: toVars,
	    duration: duration,
	    startTime: now,
	    callback: callback
	  };
	};

	/**
	 * update tic 때마다 호출
	 * @param {object} [values] 변경할 값 @see changeableShapeVars
	 * @return {null}
	 */
	Shape.prototype.update = function (values) {
	  if (values !== undefined) {
	    this.setValue(values);
	  }

	  if (this.transition !== undefined) {
	    var now = timing.now(),
	        transitionResult = transitionLoop(this.transition, now);

	    if (transitionResult === false) {
	      if (this.transition.toVars.rotate !== undefined) {
	        this.transition.toVars.rotate = this.transition.toVars.rotate % 360;
	      }
	      this.setValue(this.transition.toVars);
	      // console.log(this.transition.toVars);
	      if (this.transition.callback !== undefined && typeof this.transition.callback === 'function') {
	        this.transition.callback();
	      }
	      this.transitionEnd = true;
	      delete this.transition;
	    } else {
	      this.setValue(transitionResult);
	      this.transitionEnd = false;
	    }
	  } else if (this.transitionEnd !== undefined) {
	    delete this.transitionEnd;
	  }
	  // if (this.transitionEnd === true) {
	  //   console.log('end');
	  // }
	};

	/**
	 * 특정좌표가 도형안에 있는지 검사하고 상대좌표 구하기
	 * @param  {number}         x pointer x coordinate
	 * @param  {number}         y pointer y coordinate
	 * @return {boolean|object}   좌표가 도형안에 있으면 상대 좌표, 없으면 false
	 */
	Shape.prototype.contains = function (x, y) {
	  var vals = this.getValue(['type', 'coordinates', 'scaleX', 'scaleY', 'rotate', 'drawGapX', 'drawGapY']);

	  return containsFunc[vals.type](x, y, {
	    x1: vals.coordinates.x1 + vals.drawGapX,
	    y1: vals.coordinates.y1 + vals.drawGapY,
	    x2: vals.coordinates.x2 + vals.drawGapX,
	    y2: vals.coordinates.y2 + vals.drawGapY,
	    centerX: vals.coordinates.centerX + vals.drawGapX,
	    centerY: vals.coordinates.centerY + vals.drawGapY,
	    scaleX: vals.scaleX,
	    scaleY: vals.scaleY,
	    rotate: vals.rotate
	  });
	};

	/**
	 * 2d canvas context에 그리기.
	 * draw tic마다 호출
	 * @param  {CanvasRenderingContext2D} context
	 * @param  {boolean|HTMLImageElement} [img]          도형안에 그릴 이미지
	 * @param  {boolean}                  [drawBounding] 경계선 표시 여부
	 * @return {null}
	 */
	Shape.prototype.draw = function (context, img, drawBounding) {
	  if (context === undefined || context.drawImage === undefined) {
	    return;
	  }

	  if (img === true && drawBounding === undefined) {
	    drawBounding = true;
	    img = undefined;
	  }

	  //draw bounding for debug
	  if (drawBounding === true && this.bounding !== undefined) {
	    drawToCanvas(context, 'rect', { coordinates: this.bounding }, this.boundingStyle);
	  }

	  drawToCanvas(context, this.getValue('type'), this.getValue(['width', 'height', 'coordinates', 'scaleX', 'scaleY', 'radian', 'drawTranslate', 'drawGapX', 'drawGapY']), this.getValue(['fillStyle', 'lineWidth', 'strokeStyle', 'opacity']), img);
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * rect shape 동시 처리 모듈
	 * @version 1.0
	 * @author  Jeong Heeju
	 * @module  {function} shape/lib/batch
	 * @requires module:shape/lib/shape
	 * @requires module:emitter
	 */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Batch;
	var Shape = __webpack_require__(19),
	    setImmediate = __webpack_require__(21);

	__webpack_require__(11)(Batch.prototype);

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
	function Batch(datas, drawObj) {
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

	  var rects = datas.rects,
	      values = {},
	      x = [],
	      y = [],
	      textureIndex;

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

	  self.centerX = values.centerX = datas.centerX === undefined ? (values.x2 - values.x1) / 2 : datas.centerX;

	  self.centerY = values.centerY = datas.centerY === undefined ? (values.y2 - values.y1) / 2 : datas.centerY;

	  setValue(self, {
	    centerX: self.centerX,
	    centerY: self.centerY
	  });

	  self.drawObj.setupRects(self.rects);
	  self.drawObj.loadTextures(datas.textures, function (result) {
	    setImmediate(function () {
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
	Batch.prototype.getValue = function (vals) {
	  return this.integratedRect.getValue(vals);
	};

	/**
	 * 바꿀 값 일괄 적용
	 * @param {object}   toVars     변경할 값 @see Shape changeableShapeVars
	 * @param {number}   [duration] animation duration. 0 or undefined is no animation
	 * @param {Function} [callback] callback after animation end
	 */
	Batch.prototype.set = function (toVars, duration, callback) {
	  this.integratedRect.set(toVars, duration, callback);
	  for (var i = 0; i < this.rects.length; i++) {
	    this.rects[i].set(toVars, duration, callback);
	  }
	};

	/**
	 * shape 일괄 update
	 * update tic 때마다 호출
	 * @param   {object} [values] 변경할 값 @see Shape changeableShapeVars
	 * @return  {null}
	 */
	Batch.prototype.update = function (values) {
	  this.integratedRect.update(values);
	  for (var i = 0; i < this.rects.length; i++) {
	    this.rects[i].update(values);
	  }
	};

	/**
	 * canvas에 일괄 그리기.
	 * draw tic마다 호출
	 * @return {null}
	 */
	Batch.prototype.draw = function () {
	  // var transformValues = this.integratedRect.getValue(['scaleX', 'rotate', 'drawGapX', 'drawGapY']);
	  this.drawObj.drawRects(this.rects, this.integratedRect.getValue(['scaleX', 'rotate', 'drawGapX', 'drawGapY']));
	};

	/**
	 * 특정 rect에 대한 상대 좌표값 구하기
	 * @param  {number} rectIndex rect shape id
	 * @param  {number}         x  pointer x
	 * @param  {nymber}         y  pointer y
	 * @return {boolean|object}    좌표가 도형안에 있으면 상대 좌표, 없으면 false
	 */
	Batch.prototype.contains = function (rectIndex, x, y) {
	  return this.rects[rectIndex].contains(x, y);
	};

	/**
	 * batch가 바뀔때 다시 설정.
	 * @param  {object} datas @see Batch datas param
	 * @return {null}
	 */
	Batch.prototype.changeRects = function (datas) {
	  this.drawObj.clearRects();
	  this.drawObj.clearTextures();
	  init(this, datas);
	};

	/**
	 * 특정 index의 rect texture를 update
	 * @param  {number} rect index
	 * @return {null}
	 */
	Batch.prototype.updateTexture = function (index) {
	  this.drawObj.refreshTexture(this.rects[index].data.texture);
	};

	/**
	 * @class
	 */

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(22)))

/***/ },
/* 22 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Shape Batch를 canvas에 2d나 webgl로 그려주는 모듈
	 * @version 1.0
	 * @author  Jeong Heeju
	 * @module  {function} shape/lib/draw
	 * @requires module:extend
	 */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Draw;
	var extend = __webpack_require__(24);

	/**
	 * vertex shader 소스
	 * @type {Array}
	 */
	var vertexShaderSrc = ["attribute vec2 a_position;", "attribute vec2 a_texCoord;", "uniform vec2 u_resolution;", "uniform vec2 u_translation;", "uniform float u_angle;", "uniform float u_scale;", "varying vec2 v_texCoord;", "void main() {", "  float rad = -radians(u_angle); // * 0.01745329251;", "  float s = sin(rad);", "  float c = cos(rad);", "  vec2 position = vec2(", "    a_position.x * c + a_position.y * s,", "    a_position.y * c - a_position.x * s", "  );", "  position = ((position * vec2(u_scale, u_scale) + u_translation) / u_resolution) * 2.0 - 1.0;", "  gl_Position = vec4(position * vec2(1, -1), 0, 1);", "  v_texCoord = a_texCoord;", "}"];

	/**
	 * fragmentShader 소스
	 * @type {Array}
	 */
	var fragmentShaderSrc = ["precision mediump float;", "uniform sampler2D u_sampler;", "varying vec2 v_texCoord;", "void main() {", "  gl_FragColor = texture2D(u_sampler, v_texCoord);", "}"];

	var BPE = Float32Array.BYTES_PER_ELEMENT;

	/**
	 * Shape Batch를 canvas에 그리는 객체
	 * @param {canvas} canvas               draw할 canavs
	 * @param {object} option               canvas context options
	 * @param {string} option.context       context type. '2d' or 'webgl'
	 * @param {object} option.contextOption context options for webgl
	 * @constructor
	 */
	function Draw(canvas, option) {
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
	  var self = this,
	      useWebgl = false;

	  var createWebgl = function createWebgl() {
	    try {
	      return !!(window.WebGLRenderingContext && (self.gl = self.canvas.getContext('webgl', self.option.contextOption) || self.canvas.getContext('experimental-webgl', self.option.contextOption)));
	    } catch (e) {
	      return false;
	    }
	  };

	  if (this.option.context === 'webgl') {
	    useWebgl = createWebgl();
	  }

	  // 2d
	  if (useWebgl === false) {
	    this.context = this.canvas.getContext('2d', { 'alpha': this.option.contextOption.alpha });
	    this.contextType = '2d';
	    this.func = {
	      'setupTexture': setup2dTexture,
	      'updateCanvasTexture': update2dCanvasTexture,
	      'deleteTexture': delete2dTexture,
	      'drawRects': draw2dRects
	    };
	  }
	  // webgl
	  else {
	      initWebgl(this);
	      this.contextType = 'webgl';
	      this.func = {
	        'setupTexture': setupWebglTexture,
	        'updateCanvasTexture': updateWebglCanvasTexture,
	        'deleteTexture': deleteWebglTexture,
	        'drawRects': drawWebglRects
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

	  image.onload = function () {
	    texture.texture = image;
	    self.func.setupTexture(self, texture);
	    image = null;
	  };

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
	  var gl = self.gl,
	      program = loadWebglProgram(gl);

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
	  self.u_resolution = gl.getUniformLocation(program, 'u_resolution');
	  self.u_translation = gl.getUniformLocation(program, 'u_translation');
	  self.u_angle = gl.getUniformLocation(program, 'u_angle');
	  self.u_scale = gl.getUniformLocation(program, 'u_scale');
	  self.u_sampler = gl.getUniformLocation(program, 'u_sampler');

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
	  var option, source;

	  if (shaderType === 'vertex') {
	    option = gl.VERTEX_SHADER;
	    source = vertexShaderSrc;
	  } else if (shaderType === 'fragment') {
	    option = gl.FRAGMENT_SHADER;
	    source = fragmentShaderSrc;
	  } else {
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
	  var gl = self.gl,
	      index = rect.index;

	  var width = rect.getValue('width'),
	      height = rect.getValue('height'),
	      x1 = -width / 2,
	      y1 = -height / 2,
	      x2 = width / 2,
	      y2 = height / 2;

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
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, 0.0, 0.0, x1, y2, 0.0, 1.0, x2, y1, 1.0, 0.0, x2, y2, 1.0, 1.0]), bufferUsage);
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
	  var gl = self.gl,
	      index = texture.index;

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
	  var gl = self.gl;
	  var texture = self.textures[textureIndex];
	  gl.bindTexture(gl.TEXTURE_2D, texture);

	  try {
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
	  } catch (e) {
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

	  var drawGapX = transformValues.drawGapX || 0,
	      drawGapY = transformValues.drawGapY || 0;

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

	function update2dCanvasTexture() {}
	// self.textures[index] = texture;


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
	Draw.prototype.setupRects = function (rects) {
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
	Draw.prototype.clearRects = function () {
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
	Draw.prototype.loadTextures = function (textures, callback) {
	  this.textureSetupCount = textures.length;
	  this.loadTextureCallback = callback;
	  for (var i = 0; i < textures.length; i++) {
	    // textures[i].index = i;
	    //image url
	    if (typeof textures[i].img === 'string') {
	      loadTextureImage(this, textures[i]);
	    }

	    //native image or canvas object
	    else if (textures[i].img instanceof HTMLElement && textures[i].img.tagName && (textures[i].img.tagName.toLowerCase() === 'canvas' || textures[i].img.tagName.toLowerCase() === 'img')) {
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
	Draw.prototype.refreshTexture = function (index) {
	  this.func.updateCanvasTexture(this, index);
	};

	/**
	 * 텍스쳐 삭제
	 * @return {null}
	 */
	Draw.prototype.clearTextures = function () {
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
	Draw.prototype.drawRects = function (rects, transformValues) {
	  this.func.drawRects(this, rects, transformValues);
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(12);

	var Laserpointer = function () {
	  function Laserpointer(option) {
	    _classCallCheck(this, Laserpointer);

	    this.emitter = option.emitter;

	    this.scaleWrap = document.querySelector(".scale-wrap");
	    this.screen = document.querySelector("#screen");

	    this.power = false;

	    this.background = document.createElement('div');
	    this.background.className = 'laserpointer';
	    this.background.id = 'laserpointer';
	    this.background.style.width = this.screen.offsetWidth + "px";
	    this.background.style.height = this.screen.offsetHeight + "px";
	    this.background.tabIndex = 0;

	    this.scaleWrap.appendChild(this.background);

	    this.addEvent();
	  }

	  _createClass(Laserpointer, [{
	    key: 'on',
	    value: function on() {
	      this.power = true;
	      $.addClass(this.background, 'show');

	      this.emitter.emit('laserpointerToggle', this.power);
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      this.power = false;
	      $.removeClass(this.background, 'show');

	      this.emitter.emit('laserpointerToggle', this.power);
	    }
	  }, {
	    key: 'start',
	    value: function start(evt) {

	      this.emitter.emit('laserpointerUpdate', 'LaserPointer:Start', {
	        'type': self.type,
	        'x': evt.offsetX,
	        'y': evt.offsetY
	      });
	    }
	  }, {
	    key: 'end',
	    value: function end(evt) {

	      this.emitter.emit('laserpointerUpdate', 'LaserPointer:End');
	    }
	  }, {
	    key: 'pos',
	    value: function pos(evt) {

	      this.emitter.emit('laserpointerUpdate', 'LaserPointer:Pos', {
	        'positions': [{
	          'x': evt.offsetX,
	          'y': evt.offsetY
	        }]
	      });
	    }
	  }, {
	    key: 'addEvent',
	    value: function addEvent() {
	      var _this = this;

	      var self = this;

	      self.background.addEventListener('mousemove', function (evt) {

	        if (evt.buttons == 1) {
	          self.pos(evt);
	        }
	      });

	      self.background.addEventListener('mousedown', function (evt) {

	        self.start(evt);
	      });

	      self.background.addEventListener('mouseup', function (evt) {
	        self.end(evt);
	      });

	      document.getElementById('lp-toggle').addEventListener('click', function () {
	        if (_this.power) {
	          _this.off();
	        } else {
	          _this.on();
	        }
	      });

	      document.getElementById("lp-type").addEventListener("change", function () {
	        self.type = this.value;
	      });
	    }
	  }]);

	  return Laserpointer;
	}();

	exports.default = Laserpointer;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Protocol = __webpack_require__(27),
	    types = __webpack_require__(29).parser.fnTypes,
	    schemaTypes = __webpack_require__(29).protocols.schemaTypes;

	var _exports = module.exports = {};
	_exports.data = new Protocol();
	_exports.screen = new Protocol();

	_exports.data.add('Channel:ListenRequest', {
		payload: 200,
		messageId: 0,
		body: {
			channelId: { type: schemaTypes.number, encoding: types.uint8 }
		}
	}, 'send').add('Channel:ConnectRequest', {
		payload: 200,
		messageId: 4,
		body: {
			channelId: { type: schemaTypes.number, encoding: types.uint8 },
			port: { type: schemaTypes.number, encoding: types.uint32 },
			guid: { type: schemaTypes.string, encoding: types.uint16, size: 32 },
			endOfString: { type: schemaTypes.number, encoding: types.uint16, default: 0 }
		}
	}, 'send').add('Channel:Close', {
		payload: 200,
		messageId: 8,
		body: {
			mode: { type: schemaTypes.number, encoding: types.uint8, default: 2 }
		}
	}, 'both').add('ChannelNop:Request', {
		payload: 201,
		messageId: 0
	}, 'both').add('ChannelNop:Confirm', {
		payload: 201,
		messageId: 1
	}).add('ChannelNop:NoopRequestNoAck', {
		payload: 201,
		messageId: 2
	}, 'send').add('KeyMouseCtrl:Request', {
		payload: 202,
		messageId: 0
	}, 'send').add('KeyMouseCtrl:Confirm', {
		payload: 202,
		messageId: 1,
		body: {
			state: { type: schemaTypes.number, encoding: types.uint32 }
		}
	}).add('KeyMouseCtrl:InputBlock', {
		payload: 202,
		messageId: 7
	}, 'send').add('KeyMouseCtrl:KeyEvent', {
		payload: 202,
		messageId: 20,
		body: {
			down: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
			pad: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
			key: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
			specialkeystate: { type: schemaTypes.number, encoding: types.uint16, default: 0 }
		}
	}, 'send').add('KeyMouseCtrl:MouseEvent', {
		payload: 202,
		messageId: 21,
		body: {
			buttonMask: { type: schemaTypes.number, encoding: types.uint8 },
			x: { type: schemaTypes.number, encoding: types.uint16 },
			y: { type: schemaTypes.number, encoding: types.uint16 }
		}
	}, 'send').add('LaserPointer:Start', {
		payload: 203,
		messageId: 0,
		body: {
			type: { type: schemaTypes.number, encoding: types.uint8 },
			x: { type: schemaTypes.number, encoding: types.uint16 },
			y: { type: schemaTypes.number, encoding: types.uint16 }
		}
	}, 'send').add('LaserPointer:End', {
		payload: 203,
		messageId: 1
	}, 'send').add('LaserPointer:Pos', {
		payload: 203,
		messageId: 2,
		body: {
			positions: { type: schemaTypes.array, nested: {
					x: { type: schemaTypes.number, encoding: types.uint16 },
					y: { type: schemaTypes.number, encoding: types.uint16 }
				} }
		}
	}, 'send').add('Draw:Start', {
		payload: 204,
		messageId: 0
	}, 'send').add('Draw:End', {
		payload: 204,
		messageId: 1
	}, 'send').add('Draw:Info', {
		payload: 204,
		messageId: 2,
		body: {
			type: { type: schemaTypes.number, encoding: types.uint8 },
			color: { type: schemaTypes.number, encoding: types.uint32, default: 255 },
			thickness: { type: schemaTypes.number, encoding: types.uint8 },
			realtime: { type: schemaTypes.number, encoding: types.uint8, default: 0 }
		}
	}, 'send').add('Draw:Data', {
		payload: 204,
		messageId: 3,
		body: {
			positions: { type: schemaTypes.array, nested: {
					x: { type: schemaTypes.number, encoding: types.uint16 },
					y: { type: schemaTypes.number, encoding: types.uint16 }
				} }
		}
	}, 'send').add('Monitors:InfoRequest', {
		payload: 205,
		messageId: 0
	}, 'send').add('Monitors:InfoResponse', {
		payload: 205,
		messageId: 1,
		body: {
			x1: { type: schemaTypes.number, encoding: types.uint32 },
			y1: { type: schemaTypes.number, encoding: types.uint32 },
			x2: { type: schemaTypes.number, encoding: types.uint32 },
			y2: { type: schemaTypes.number, encoding: types.uint32 },
			monitors: { type: schemaTypes.array, vary: { encoding: types.uint32 }, nested: {
					index: { type: schemaTypes.number, encoding: types.uint32 },
					x1: { type: schemaTypes.number, encoding: types.uint32 },
					y1: { type: schemaTypes.number, encoding: types.uint32 },
					x2: { type: schemaTypes.number, encoding: types.uint32 },
					y2: { type: schemaTypes.number, encoding: types.uint32 }
				} }
		}
	}).add('Monitors:Select', {
		payload: 205,
		messageId: 2,
		body: {
			index: { type: schemaTypes.number, encoding: types.uint32 }
		}
	}, 'send').add('Favorite:HotKeyCtrlAltDel', {
		payload: 206,
		messageId: 150
	}, 'send')

	// .add('Favorite:Url', {
	// 	payload: 206
	// 	messageId: 0,
	// 	body: {
	// 		urls: {type: schemaTypes.array, vary: {encoding: types.uint32}, nested:{
	// 			url: {type: schemaTypes.string, encoding: types.uint16}
	// 		}}
	// 	}
	// })
	// .add('SysInfo:CpuMemInfoRequest', {
	// 	payload: 207,
	// 	messageId: 0
	// })
	// .add('Process:ListRequest', {
	// 	payload: 208,
	// 	messageId: 0
	// })
	// .add('RebootConnect:Request', {
	// 	payload: 212,
	// 	messageId: 0
	// })
	// .add('Clipboard:DataInfo', {
	// 	payload: 215,
	// 	messageId: 1,
	// 	body: {
	// 		clipboardType: {type: schemaTypes.number, encoding: types.uint8}
	// 	}
	// })
	.add('Options:rcOption', {
		payload: 217,
		messageId: 0,
		body: {
			nFunction: { type: schemaTypes.number, encoding: types.uint32, default: 147308355 },
			nOption: { type: schemaTypes.number, encoding: types.uint32, default: 537919488 },
			ftpSize: { type: schemaTypes.number, encoding: types.uint32, default: 1000000000 }
		}
	}, 'send').add('Options:Setting', {
		payload: 217,
		messageId: 6,
		body: {
			info: { type: schemaTypes.number, encoding: types.uint64, default: 9 }
		}
	}, 'send').add('Options:KeyboardLang', {
		payload: 217,
		messageId: 7,
		body: {
			keyLang: { type: schemaTypes.number, encoding: types.uint32 }
		}
	}, 'both').add('RemoteInfo:Request', {
		payload: 220,
		messageId: 0,
		body: {
			userId: { type: schemaTypes.string, encoding: types.uint16, default: '4028ad344e84fb54014ecd5e205f6a39' },
			endOfString: { type: schemaTypes.number, encoding: types.uint16, default: 0 }
		}
	}, 'send').add('RemoteInfo:Data', {
		payload: 220,
		messageId: 1,
		body: {
			platform: { type: schemaTypes.number, encoding: types.uint8 },
			account: { type: schemaTypes.number, encoding: types.uint8 },
			appMode: { type: schemaTypes.number, encoding: types.uint8 },
			major: { type: schemaTypes.number, encoding: types.uint32 },
			minor: { type: schemaTypes.number, encoding: types.uint32 },
			pcName: { type: schemaTypes.string, encoding: types.uint16, vary: { encoding: types.uint32 } },
			ip: { type: schemaTypes.string, encoding: types.uint16, vary: { encoding: types.uint32 } },
			osName: { type: schemaTypes.string, encoding: types.uint16, vary: { encoding: types.uint32 } },
			osLang: { type: schemaTypes.number, encoding: types.uint32 },
			mac: { type: schemaTypes.string, encoding: types.uint16, vary: { encoding: types.uint32 } },
			priorConsent: { type: schemaTypes.number, encoding: types.uint16 }
		}
	}).add('Resolution:CurrentMode', {
		payload: 223,
		messageId: 0,
		body: {
			width: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
			height: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
			colorBit: { type: schemaTypes.number, encoding: types.uint8, default: 0 }
		}
	}, 'both').add('Resolution:EnumMode', {
		payload: 223,
		messageId: 1,
		body: {
			counts: { type: schemaTypes.number, encoding: types.uint8 },
			indexMode: { type: schemaTypes.number, encoding: types.uint8 },
			info: { type: schemaTypes.array, vary: { ref: 'counts' }, nested: {
					width: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
					height: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
					colorBit: { type: schemaTypes.number, encoding: types.uint8, default: 0 }
				} }
		}
	}, 'both').add('DateTime:Sync', {
		payload: 227,
		messageId: 0
	}, 'both').add('TerminalInfo:Request', {
		payload: 239,
		messageId: 0
	}, 'send').add('TerminalInfo:Response', {
		payload: 239,
		messageId: 1,
		body: {
			platform: { type: schemaTypes.enums, encoding: types.uint16, enums: {
					'1': 'windows', '2': 'mac', '3': 'linux', '4': 'android', '5': 'iphone'
				} },
			host: { type: schemaTypes.enums, encoding: types.uint16, enums: {
					'0': 'pc', '1': 'rcmp', '2': 'rcvp', '3': 'rvmp'
				} },
			flags: { type: schemaTypes.flags, encoding: types.uint32, enums: {
					voicChat: 0x01, videoChat: 0x02, vdo: 0x04, vpChat: 0x08, atomJpeg: 0x10
				} }
		}
	});

	_exports.screen.add('ChannelNop:Request', {
		payload: 201,
		messageId: 0
	}, 'both').add('ChannelNop:Confirm', {
		payload: 201,
		messageId: 1
	}, 'both').add('ChannelNop:NoopRequestNoAck', {
		payload: 201,
		messageId: 2
	}, 'send').add('SCap:Options2', {
		type: 4,
		body: {
			subtype: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
			flags: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
			hook: { type: schemaTypes.object, nested: {
					type: { type: schemaTypes.number, encoding: types.uint8, default: 68 },
					monitor: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
					localPxlCnt: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
					rotate: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
					flags: { type: schemaTypes.number, encoding: types.uint32, default: 8 },
					triggingTime: { type: schemaTypes.number, encoding: types.uint16, default: 40 },
					pad: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
					xRatio: { type: schemaTypes.object, nested: {
							numerator: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
							denominator: { type: schemaTypes.number, encoding: types.uint16, default: 0 } }
					},
					yRatio: { type: schemaTypes.object, nested: {
							numerator: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
							denominator: { type: schemaTypes.number, encoding: types.uint16, default: 0 } }
					},
					bitrate: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
					FPS: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
					positions: { type: schemaTypes.object, nested: {
							left: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
							top: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
							right: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
							bottom: { type: schemaTypes.number, encoding: types.uint32, default: 0 } }
					},
					encoder: { type: schemaTypes.object, nested: {
							flags: { type: schemaTypes.number, encoding: types.uint32, default: 8 },
							type: { type: schemaTypes.string, encoding: types.uint8, size: 1, default: 'j' },
							valid: { type: schemaTypes.number, encoding: types.uint8, default: 255 },
							hostPxlCnt: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
							remoteBpp: { type: schemaTypes.number, encoding: types.uint8, default: 24 },
							jpgLowQuality: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
							jpgHighQuality: { type: schemaTypes.number, encoding: types.uint8, default: 80 },
							remoteBpp3G: { type: schemaTypes.number, encoding: types.uint8, default: 2 },
							remoteBppWifi: { type: schemaTypes.number, encoding: types.uint8, default: 8 },
							tileCacheCount: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
							dimensions: { type: schemaTypes.object, nested: {
									width: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
									height: { type: schemaTypes.number, encoding: types.uint16, default: 0 } }
							},
							ratio: { type: schemaTypes.object, nested: {
									width: { type: schemaTypes.number, encoding: types.uint16, default: 0 },
									height: { type: schemaTypes.number, encoding: types.uint16, default: 0 } }
							},
							bitrate: { type: schemaTypes.number, encoding: types.uint32, default: 0 },
							FPS: { type: schemaTypes.number, encoding: types.uint32, default: 0 }
						} }
				} }
		}
	}, 'both').add('SCap:Update', {
		type: 13,
		body: {
			frame: { type: schemaTypes.images, nested: {
					subtype: { type: schemaTypes.number, encoding: types.uint8, default: 0 },
					rects: { type: schemaTypes.array, vary: { encoding: types.uint16 }, nested: {
							left: { type: schemaTypes.number, encoding: types.uint16 },
							top: { type: schemaTypes.number, encoding: types.uint16 },
							right: { type: schemaTypes.number, encoding: types.uint16 },
							bottom: { type: schemaTypes.number, encoding: types.uint16 },
							bytes: { type: schemaTypes.bytes, vary: { encoding: types.uint32 } }
						} }
				} }
		}
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Schema = __webpack_require__(28);
	module.exports = Protocol;

	function Protocol() {
		this.schemas = {};
		this.indexes = {};
	}

	Protocol.prototype.add = function (topic, options, direction) {
		direction = direction || 'receive';
		var schema = new Schema(topic, options);
		if (!this.schemas[schema.key]) this.schemas[schema.key] = schema;

		if (direction == 'send' || direction == 'both') {
			if (!this.indexes[topic]) this.indexes[topic] = schema.key;
		}
		return this;
	};

	Protocol.prototype.get = function (topic) {
		var key = this.indexes[topic],
		    schema = this.schemas[key];

		// if(!key) return throw new Error('topic has not found');
		// if(!schema) return throw new Error('schema has not found');
		return schema;
	};

	Protocol.prototype.from = function (bytes) {
		var payload = bytes[0],
		    messageId = bytes[5],
		    subtype = bytes[10];

		var schema = this.schemas[payload] || this.schemas[payload + ':' + messageId] || this.schemas[payload + ':' + messageId + ':' + subtype];
		// if(!schema) throw new Error('schema has not found');
		return schema;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	module.exports = Schema;

	function has(source, dest, prop) {
		var result = source.hasOwnProperty(prop);
		if (result) dest[prop] = source[prop];
		return result;
	}

	function Schema(topic, options) {
		if (!(this instanceof Schema)) return new Schema(topic, options);

		var keys = [];
		this.hasBody = options.hasOwnProperty('body');
		if (this.hasBody) this.body = options.body;

		if (has(options, this, 'payload')) keys.push(options.payload);
		if (has(options, this, 'messageId')) keys.push(options.messageId);
		if (has(options, this, 'subtype')) keys.push(options.subtype);
		if (has(options, this, 'type')) keys.push(options.type);

		this.topic = topic;
		this.key = keys.join(':');
	}

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		channelEnums: { data: 0, screen: 1 },
		connectionTypeEnums: { relay: 0, host: 1 },
		productModeEnums: { view: 0xc80, host: 0x1068 },
		protocols: {
			schemaTypes: {
				number: 'Number',
				string: 'String',
				enums: 'Enums',
				flags: 'Flags',
				array: 'Array',
				object: 'object',
				bytes: 'bytes',
				images: 'images'
			}
		},
		parser: {
			fnTypes: {
				uint8: 'Uint8',
				uint16: 'Uint16',
				uint32: 'Uint32',
				uint64: 'Uint64'
			},
			fnSize: {
				'Uint8': 1,
				'Uint16': 2,
				'Uint32': 4,
				'Uint64': 8
			}
		}
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		BinaryWriter: __webpack_require__(31),
		BinaryReader: __webpack_require__(32),
		Encoder: __webpack_require__(33),
		Decoder: __webpack_require__(36)
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	module.exports = BinaryWriter;

	function BinaryWriter(buffer, offset) {
		this.defaultType = 'setUint8';
		this.bytes = buffer || [];
		this.offset = offset || this.bytes.length;

		Object.defineProperty(this, "buffer", {
			get: function get() {
				return new Uint8Array(this.bytes).buffer;
			}
		});
	}

	BinaryWriter.prototype.setUint8 = function (value, endianess, offset) {
		this.bytes[this.offset++] = value;
	};

	BinaryWriter.prototype.setUint16 = function (value, endianess, offset) {
		if (offset != null && offset > 0) this.offset = offset;
		if (false !== endianess) {
			this.bytes[this.offset++] = value & 255;
			this.bytes[this.offset++] = value >> 8 & 255;
		} else {
			this.bytes[this.offset++] = value >> 8 & 255;
			this.bytes[this.offset++] = value & 255;
		}
	};

	BinaryWriter.prototype.setUint32 = function (value, endianess, offset) {
		if (offset != null && offset > 0) this.offset = offset;
		if (false !== endianess) {
			this.bytes[this.offset++] = value & 255;
			this.bytes[this.offset++] = value >> 8 & 255;
			this.bytes[this.offset++] = value >> 16 & 255;
			this.bytes[this.offset++] = value >> 24 & 255;
		} else {
			this.bytes[this.offset++] = value >> 24 & 255;
			this.bytes[this.offset++] = value >> 16 & 255;
			this.bytes[this.offset++] = value >> 8 & 255;
			this.bytes[this.offset++] = value & 255;
		}
	};

	BinaryWriter.prototype.setUint64 = function (value, endianess, offset) {
		var max = Math.pow(2, 32) - 1,
		    hi = Math.floor(value / max),
		    lo = hi > 0 ? hi * max - value : value;

		if (false !== endianess) {
			this.setUint32(lo, true, offset);
			this.setUint32(hi, true, offset);
		} else {
			this.setUint32(hi, false, offset);
			this.setUint32(lo, false, offset);
		}
	};

	BinaryWriter.prototype.setCharCodes = function (str, type) {
		var setType = type || this.defaultType;
		for (var i = 0, n = str.length; i < n; i++) {
			this[setType](str.charCodeAt(i));
		}
	};

	BinaryWriter.prototype.push = function (value, type, endianess) {
		var setType = type || this.defaultType;
		this[setType](value, endianess);
	};

	BinaryWriter.prototype.unshiftU8 = function (value) {
		this.bytes.unshift(value);
		this.offset = 1;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	module.exports = BinaryReader;

	function BinaryReader(buffer, offset) {
		this.bytes = new Uint8Array(buffer);
		this.offset = offset || 0;

		Object.defineProperty(this, "buffer", {
			get: function get() {
				this.bytes.buffer;
			}
		});
	}

	BinaryReader.prototype.getUint8 = function (offset) {
		return this.bytes[this.offset++];
	};

	BinaryReader.prototype.getBytes = function (len, offset) {
		if (offset != null && offset > 0) this.offset = offset;
		return this.bytes.subarray(this.offset, this.offset = this.offset + len);
	};

	BinaryReader.prototype.getUint16 = function (le, offset) {
		if (offset != null && offset > 0) this.offset = offset;
		if (le) return this.bytes[this.offset++] | this.bytes[this.offset++] << 8;
		return this.bytes[this.offset++] << 8 | this.bytes[this.offset++];
	};

	BinaryReader.prototype.getUint32 = function (le, offset) {
		if (offset != null && offset > 0) this.offset = offset;
		if (le) {
			return (this.bytes[this.offset++] | this.bytes[this.offset++] << 8 | this.bytes[this.offset++] << 16 | this.bytes[this.offset++] << 24) >>> 0;
		}
		return (this.bytes[this.offset++] << 24 | this.bytes[this.offset++] << 16 | this.bytes[this.offset++] << 8 | this.bytes[this.offset++]) >>> 0;
	};

	BinaryReader.prototype.getUint64 = function (le, offset) {
		var lo = 0,
		    hi = 0;
		if (le) {
			lo = this.getUint32(le, offset);
			hi = this.getUint32(le, offset);
		} else {
			hi = this.getUint32(false, offset);
			lo = this.getUint32(false, offset);
		}
		return (Math.pow(2, 32) - 1) * hi + lo;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clone = __webpack_require__(34),
	    types = __webpack_require__(29).parser.fnTypes,
	    sizes = __webpack_require__(29).parser.fnSize,
	    Writer = __webpack_require__(31);

	module.exports = Encoder;

	function Encoder(schema, obj) {
		this.schema = clone(schema);
		this.data = clone(obj);

		this.view = new Writer();
		this.messageSize = this.schema.hasBody ? 5 : 1;
		this.dataSize = 0;

		if (this.schema.payload != null) {
			this['Number']({ encoding: types.uint8 }, this.schema.payload);
			if (this.messageSize) this['Number']({ encoding: types.uint32 }, this.messageSize);
			if (this.schema.messageId != null) this['Number']({ encoding: types.uint8 }, this.schema.messageId);
			if (this.dataSize > 0 || this.schema.hasBody) this['Number']({ encoding: types.uint32 }, this.dataSize || 0);
		} else if (this.schema.type != null) {
			this['Number']({ encoding: types.uint8 }, this.schema.type);
		}

		console.log("--------", this.view.bytes);
	}

	Encoder.prototype.setHeader = function () {
		if (this.schema.payload != null) {

			var byteLength = this.view.bytes.length;
			if (byteLength > 5) {
				this.set(types.uint32, byteLength - 5, true, 1);
				if (byteLength > 10) this.set(types.uint32, byteLength - 10, true, 6);
			}
		}
	};

	Encoder.prototype.pack = function () {
		if (!this.schema.hasBody) return this.view;
		this.dataBind(this.schema.body, this.data);
		this.setHeader();
		return this.view;
	};

	Encoder.prototype.dataBind = function (structs, obj) {
		var keys = Object.keys(structs);
		for (var i = 0, n = keys.length; i < n; i++) {
			var name = keys[i],
			    struct = structs[name],
			    value = typeof obj[name] === 'number' ? obj[name] : obj[name] || struct.default;
			console.log(struct.type, struct, value);
			this[struct.type](struct, value);
		}
	};

	Encoder.prototype.set = function (type, value, le, offset) {
		this.view['set' + type](value, false !== le, offset);
	};

	Encoder.prototype.String = function (struct, value) {
		if (struct.vary) this.set(struct.vary.encoding, value.length);

		for (var i = 0, n = value.length; i < n; i++) {
			this.set(struct.encoding, value.charCodeAt(i));
		}
	};

	Encoder.prototype.Number = function (struct, value) {
		this.set(struct.encoding, value, struct.le);
	};

	Encoder.prototype.object = function (structs, obj) {
		this.dataBind(structs.nested, obj || {});
	};

	Encoder.prototype.Array = function (structs, obj) {
		if (!obj || !obj.hasOwnProperty('length')) return;
		for (var i = 0, n = obj.length; i < n; i++) {
			this.dataBind(structs.nested, obj.shift());
		}
		//this.dataBind(structs.nested, obj || {})
		//this.flatten(structs.nested, obj);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var type;
	try {
	  type = __webpack_require__(35);
	} catch (_) {
	  type = __webpack_require__(35);
	}

	/**
	 * Module exports.
	 */

	module.exports = clone;

	/**
	 * Clones objects.
	 *
	 * @param {Mixed} any object
	 * @api public
	 */

	function clone(obj){
	  switch (type(obj)) {
	    case 'object':
	      var copy = {};
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	          copy[key] = clone(obj[key]);
	        }
	      }
	      return copy;

	    case 'array':
	      var copy = new Array(obj.length);
	      for (var i = 0, l = obj.length; i < l; i++) {
	        copy[i] = clone(obj[i]);
	      }
	      return copy;

	    case 'regexp':
	      // from millermedeiros/amd-utils - MIT
	      var flags = '';
	      flags += obj.multiline ? 'm' : '';
	      flags += obj.global ? 'g' : '';
	      flags += obj.ignoreCase ? 'i' : '';
	      return new RegExp(obj.source, flags);

	    case 'date':
	      return new Date(obj.getTime());

	    default: // string, number, boolean, …
	      return obj;
	  }
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  if (isBuffer(val)) return 'buffer';

	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val);

	  return typeof val;
	};

	// code borrowed from https://github.com/feross/is-buffer/blob/master/index.js
	function isBuffer(obj) {
	  return !!(obj != null &&
	    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
	      (obj.constructor &&
	      typeof obj.constructor.isBuffer === 'function' &&
	      obj.constructor.isBuffer(obj))
	    ))
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clone = __webpack_require__(34),
	    types = __webpack_require__(29).parser.fnTypes,
	    sizes = __webpack_require__(29).parser.fnSize,
	    Reader = __webpack_require__(32),
	    URL = __webpack_require__(37).URL,
	    jpeg = __webpack_require__(38);

	module.exports = Decoder;

	function Decoder(schema, buffer) {
		this.schema = clone(schema);
		this.view = new Reader(buffer, schema.hasBody ? 10 : 0);
		if (schema.type) this.view.offset = 1;
		this.data = {};
	}

	Decoder.prototype.unpack = function () {
		if (!this.schema.hasBody) return null;
		this.dataBind(this.schema.body, this.data);
		return this.data;
	};

	Decoder.prototype.dataBind = function (structs, obj) {
		var keys = Object.keys(structs);
		for (var i = 0, n = keys.length; i < n; i++) {
			var name = keys[i],
			    struct = structs[name];
			this[struct.type](struct, obj, name);
		}
	};

	Decoder.prototype.get = function (type, le, offset) {
		return this.view['get' + type](false !== le, offset);
	};

	Decoder.prototype.Number = function (struct, obj, name) {
		obj[name] = this.get(struct.encoding, struct.le);
	};

	Decoder.prototype.Enums = function (struct, obj, name) {
		var num = this.get(struct.encoding, struct.le);
		obj[name] = struct.enums[num];
	};

	Decoder.prototype.Flags = function (struct, obj, name) {
		var num = this.get(struct.encoding, struct.le);
		var array = [],
		    keys = Object.keys(struct.enums);

		for (var i = 0, n = keys.length; i < n; i++) {
			var key = keys[i];
			if (num & struct.enums[key] === struct.enums[key]) array.push(key);
		}
		obj[name] = array.join('|');
	};

	Decoder.prototype.String = function (struct, obj, name) {
		var len = struct.size || 0,
		    str = '';
		if (struct.vary) len = this.get(struct.vary.encoding, struct.le);

		if (struct.encoding == 'Uint16') {
			for (var i = 0; i < len / 2; i++) {
				str += String.fromCharCode(this.get(struct.encoding, struct.le));
			}
		} else if (struct.encoding == 'Uint8') {
			for (var i = 0; i < len; i++) {
				str += String.fromCharCode(this.get(struct.encoding, struct.le));
			}
		}
		obj[name] = str;
	};

	Decoder.prototype.images = function (struct, obj, name) {
		var subtype = this.get(types.uint8),
		    len = this.get(types.uint16),
		    promises = [],
		    self = this;

		for (var i = 0; i < len; i++) {
			var promise = new Promise(function (resolve, reject) {
				var rect = jpeg.pool.get();
				rect.x = self.get(types.uint16);
				rect.y = self.get(types.uint16);
				rect.w = self.get(types.uint16) - rect.x;
				rect.h = self.get(types.uint16) - rect.y;
				rect.img.onload = function () {
					resolve(rect);
				};
				rect.img.onerror = function (e) {
					reject(e);
				};
				rect.img.src = jpeg.createImgSrc(subtype, self.bytes2(), rect.w, rect.h);
				//if(rect.img.complete) resolve(rect);
			});
			promises.push(promise);
		}

		obj[name] = { subtype: subtype, rects: promises };
	};

	Decoder.prototype.bytes2 = function () {
		var len = this.get(types.uint32);
		return this.view.getBytes(len);
	};

	Decoder.prototype.bytes = function (struct, obj, name) {
		var len = this.get(struct.vary.encoding);
		obj[name] = this.view.getBytes(len);
	};

	Decoder.prototype.object = function (struct, obj, name) {
		obj[name] = {};
		this.dataBind(struct.nested, obj[name]);
	};

	Decoder.prototype.Array = function (struct, obj, name) {
		var array = obj[name] = [];
		var len = 0;
		if (struct.vary.ref) {
			len = obj[struct.vary.ref];
		} else {
			len = this.get(struct.vary.encoding);
		}

		for (var i = 0; i < len; i++) {
			var data = {};
			this.dataBind(struct.nested, data);
			array.push(data);
		}
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		URL: window.URL,
		btoa: window.btoa
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		pool: __webpack_require__(39),
		createImgSrc: __webpack_require__(40)(false)
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var URL = __webpack_require__(37).URL;

	var cacheBlobImg = URL.createObjectURL(new Blob([new Uint8Array([255, 216, 255, 219, 0, 67, 0, 3, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 4, 6, 4, 4, 4, 4, 4, 8, 6, 6, 5, 6, 9, 8, 10, 10, 9, 8, 9, 9, 10, 12, 15, 12, 10, 11, 14, 11, 9, 9, 13, 17, 13, 14, 15, 16, 16, 17, 16, 10, 12, 18, 19, 18, 16, 19, 15, 16, 16, 16, 255, 201, 0, 11, 8, 0, 1, 0, 1, 1, 1, 17, 0, 255, 204, 0, 6, 0, 16, 16, 5, 255, 218, 0, 8, 1, 1, 0, 0, 63, 0, 210, 207, 32, 255, 217])], { type: 'image/jpeg' }));
	var cacheDataImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

	var rectPool = [];

	function get() {
		if (rectPool.length) return rectPool.pop();
		return { x: 0, y: 0, w: 0, h: 0, img: new Image() };
	}

	function addPool(rect) {
		rect.img.src = cacheDataImg;
		rectPool.push(rect);
	}

	function dispose(rects) {
		var n = rects.length,
		    rect;
		if (!n && rects.img) return addPool(rects);

		for (var i = 0; i < n; i++) {
			addPool(rects.pop());
		}
		rects = null;
	}

	var _exports = module.exports = {};
	_exports.get = get;
	_exports.dispose = dispose;
	window.imagepool = _exports;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var base64Decoder = __webpack_require__(41),
	    blobDecoder = __webpack_require__(42);

	module.exports = function (useBlob) {
		var IDecoder = useBlob ? blobDecoder : base64Decoder;
		return function (subtype, bytes, w, h) {
			if (!subtype) return IDecoder.createHeader(bytes);
			return IDecoder.createBody(bytes, w, h);
		};
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	//var btoa = require('rc.utils-client').btoa;
	var mimeType = 'data:image/jpg;base64,';
	var header = ['', ''];

	function createHeader(bytes) {
	  var src = createBase64([bytes2String(bytes)]);
	  header[0] = bytes2String(bytes.subarray(0, 163));
	  header[1] = bytes2String(bytes.subarray(167, 623));
	  return src;
	}

	function createBody(bytes, w, h) {
	  return createBase64([header[0], String.fromCharCode.apply(null, [h >> 8, h & 255, w >> 8, w & 255]), header[1], bytes2String(bytes)]);
	}

	function bytes2String(bytes) {
	  var codes = '',
	      length = bytes.length,
	      n = parseInt(length / 8),
	      index = 0;

	  // Unrolling loops
	  while (n--) {
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	    codes += String.fromCharCode(bytes[index++]);
	  }

	  n = length % 8;

	  while (n--) {
	    codes += String.fromCharCode(bytes[index++]);
	  }
	  return codes;
	}

	function createBase64(bytes) {
	  return mimeType + window.btoa(bytes.join(''));
	}

	module.exports = {
	  createHeader: createHeader,
	  createBody: createBody
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var URL = __webpack_require__(37).URL;
	var mimeType = { type: "image/jpeg" };
	var header;

	function createImgSrc(subtype, bytes, w, h) {
		if (subtype) return createHeader(bytes);
		return createBody(bytes, w, h);
	}

	function createHeader(bytes) {
		var src = createBlob([bytes]);
		header = bytes.subarray(0, 623);
		return src;
	}

	function createBody(bytes, w, h) {
		setImageSize(header, w, h);
		return createBlob([header, bytes]);
	}

	function setImageSize(bytes, w, h) {
		bytes[163] = h >> 8;
		bytes[164] = h & 255;
		bytes[165] = w >> 8;
		bytes[166] = w & 255;
	}

	function createBlob(bytes) {
		return URL.createObjectURL(new Blob(bytes, mimeType));
	}

	module.exports = {
		createHeader: createHeader,
		createBody: createBody
	};

/***/ }
/******/ ])
});
;