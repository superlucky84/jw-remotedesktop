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
  var events = []
    , isStore = (store !== undefined && Array.isArray(store) === true);

  if (Array.isArray(name) === true) {
    events = name;
  } else {
    events = name.split(' ');
  }

  for (var i = 0; i < events.length; i++) {
    el.addEventListener(events[i], listener, false);
    if (isStore === true) {
      store.push({
        'el'      : el,
        'name'    : events[i],
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
    el.addEventListener(events[i], function(event){
      event.target.removeEventListener(event.type, arguments.callee);
      listener.call(this, event);
    }, false);
  }
}


module.exports = {
  'add'      : addListeners,
  'removeAll': removeAllListeners,
  'once'     : once
};
