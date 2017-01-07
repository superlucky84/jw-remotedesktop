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
  return str.replace(/[\s_-](\w)/gi, function(r, l) {
    return l.toUpperCase();
  });
}

/**
 * @param   {*}       element
 * @returns {boolean}
 */
function isHTMLElement(el) {
  return (el) instanceof HTMLElement;
}

/**
 * @param   {*}       elemnt
 * @returns {Boolean}
 */
function isHTMLCollection(el) {
  return (el) instanceof HTMLCollection;
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
    '#'            : 'getElementById',
    '.'            : 'getElementsByClassName',
    'undefined'    : 'getElementsByTagName',
    'querySelector': 'querySelectorAll'
  }[matches[1]];

  if (context === undefined || isHTMLElement(context) === false) {
    context = document;
  }

  var el;
  try {
    el = context[method](matches[2]);
  }
  catch (e) {
    el = null
  }

  if (el && el.length !== undefined) {
    if (el.length === 0) {
      el = null;
    }
    else if (el.length === 1) {
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
  }
  else {
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
  }
  else {
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
  }
  else if (state === false) {
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
    }
    else if (Array.isArray(name)) {
      var result = {};
      for (var i = 0; i < name.length; i++) {
        result[name[i]] = styles[toCamelCase(name[i])];
      }
      return result;
    }
    else {
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

  var style = getComputedStyle(el)
    , width = el.offsetWidth
      - parseInt(style.borderLeftWidth)
      - parseInt(style.borderRightWidth);

  // include padding
  if (value === true) {
    return width;
  }

  return width
    - parseInt(style.paddingLeft)
    - parseInt(style.paddingRight);
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

  var style  = getComputedStyle(el)
    , height = el.offsetHeight - parseInt(style.borderTopWidth) - parseInt(style.borderBottomWidth);

  // include padding
  if (value === true) {
    return height;
  }

  return height
    - parseInt(style.paddingTop)
    - parseInt(style.paddingBottom);
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
    }
  }

  return {
    'top': rect.top + document.body.scrollTop,
    'left': rect.left + document.body.scrollLeft
  }
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
  }
}

/**
 * insert element to target element head
 * @param   {HTMLElement}       el      child element
 * @param   {HTMLElement}       parent  parent element (target)
 * @returns {HTMLElement|null}          inserted child element
 */
function appendTo(el, parent) {
  if (el === undefined || isHTMLElement(el) === false ||
      parent === undefined || isHTMLElement(parent) === false) {
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
  }
  else {
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
  if (el === undefined || isHTMLElement(el) === false ||
      target === undefined || isHTMLElement(target) === false) {
    return;
  }

  if (target.insertAdjacentElement) {
    target.insertAdjacentElement('afterend', el);
  }
  else {
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
  'isHTMLElement'   : isHTMLElement,
  'isHTMLCollection': isHTMLCollection,
  'isDocument'      : isDocument,
  'isWindow'        : isWindow,
  'isDOMElement'    : isDOMElement,
  'isContains'      : isContains,
  'is'              : equals,
  'equals'          : equals,
  'contains'        : isContains,
  'clone'           : clone,

  //selection
  'domSelect' : domSelect,
  'select'    : domSelect,

  //class control
  'hasClass'    : hasClass,
  'addClass'    : addClass,
  'removeClass' : removeClass,
  'toggleClass' : toggleClass,

  //attribute control
  'attr'      : attr,
  'removeAttr': removeAttr,

  //style control
  'css'       : css,
  'getBgColor': getBgColor,

  //dimensions
  'width'       : width,
  'innerWidth'  : innerWidth,
  'outerWidth'  : outerWidth,
  'height'      : height,
  'innerHeight' : innerHeight,
  'outerHeight' : outerHeight,
  'getRect'     : getRect,

  //offset
  'offset'  : offset,
  'position': position,

  //DOM insertions & removals
  'appendTo'    : appendTo,
  'prependTo'   : prependTo,
  'append'      : append,
  'prepend'     : prepend,
  'insertBefore': insertBefore,
  'insertAfter' : insertAfter,
  'before'      : before,
  'after'       : after,
  'remove'      : remove,
  'empty'       : empty,

  //etc
  'isFocused': isFocused
};
