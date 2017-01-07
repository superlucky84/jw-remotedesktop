
//var btoa = require('rc.utils-client').btoa;
var mimeType = 'data:image/jpg;base64,';
var header = ['', ''];

function createHeader(bytes){
	var src = createBase64([bytes2String(bytes)]);
	header[0] = bytes2String(bytes.subarray(0, 163));
	header[1] = bytes2String(bytes.subarray(167, 623));
	return src;
}

function createBody(bytes, w, h){
	return createBase64([
		header[0],
		String.fromCharCode.apply(null, [h >> 8, h & 255, w >> 8, w & 255]),
		header[1],
		bytes2String(bytes)
	]);
}

function bytes2String(bytes) {
  var codes = ''
    , length = bytes.length
    , n = parseInt(length / 8)
    , index = 0;

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
