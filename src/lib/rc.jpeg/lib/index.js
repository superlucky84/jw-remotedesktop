
var base64Decoder = require('./base64'),
		blobDecoder = require('./blob');

module.exports = function(useBlob){
	var IDecoder = useBlob? blobDecoder: base64Decoder;
	return function (subtype, bytes, w, h){
		if(!subtype) return IDecoder.createHeader(bytes);
		return IDecoder.createBody(bytes, w, h);
	}
}
