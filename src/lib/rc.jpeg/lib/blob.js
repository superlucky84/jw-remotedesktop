
var URL = require('../../rc.utils-client').URL;
var mimeType = {type: "image/jpeg"};
var header;

function createImgSrc(subtype, bytes, w, h){
	if(subtype) return createHeader(bytes);
	return createBody(bytes, w, h);
}

function createHeader(bytes){
	var src = createBlob([bytes]);
	header = bytes.subarray(0, 623);
	return src;
}

function createBody(bytes, w, h){
	setImageSize(header, w, h);
	return createBlob([header, bytes]);
}

function setImageSize(bytes, w, h){
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
