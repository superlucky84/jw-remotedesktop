
var URL = require('../rc.utils-client').URL;

var cacheBlobImg = URL.createObjectURL(new Blob([new Uint8Array([
	255,216,255,219,0,67,0,3,2,2,2,2,2,3,2,2,2,3,3,3,3,4,6,4,4,4,4,4,8,6,6,5,6,9,8,10,10,9,8,9,9,10,12,15,12,10,11,14,11,9,9,13,
	17,13,14,15,16,16,17,16,10,12,18,19,18,16,19,15,16,16,16,255,201,0,11,8,0,1,0,1,1,1,17,0,255,204,0,6,0,16,16,5,255,218,0,8,
	1,1,0,0,63,0,210,207,32,255,217
])], {type: 'image/jpeg'}));
var cacheDataImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

var rectPool = [];

function get(){
	if(rectPool.length) return rectPool.pop();
	return { x:0, y:0, w:0, h:0, img: new Image() };
}

function addPool(rect){
	rect.img.src = cacheDataImg;
	rectPool.push(rect);
}

function dispose(rects){
	var n = rects.length,
			rect;
	if(!n && rects.img) return addPool(rects);

	for(var i=0; i<n; i++){
		addPool(rects.pop());
	}
	rects = null;
}

var exports = module.exports = {};
exports.get = get;
exports.dispose = dispose;
window.imagepool = exports;

