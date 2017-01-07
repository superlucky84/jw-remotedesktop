/**
 * merge object
 * @version 1.0
 * @author  Jeong Heeju
 * @module  extend
 */
'use strict';

/**
 * extend object
 * @param  {Object}  origin 원본 Object
 * @param  {Object}  add    합칠 Object
 * @param  {Boolean} deep   deep merge flag
 * @return {Object}         합쳐진 object
 * @method
 */
function extend(origin, add, deep) {
  if (!add || origin.constructor !== Object) {
    return origin;
  }

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    if (deep === true &&
      origin[keys[i]] &&
      origin[keys[i]].constructor === Object &&
      add[keys[i]].constructor === Object
    ) {
      origin[keys[i]] = extend(origin[keys[i]], add[keys[i]], deep);
    } else {
      origin[keys[i]] = add[keys[i]];
    }
  }
  return origin;
}

module.exports = extend;
