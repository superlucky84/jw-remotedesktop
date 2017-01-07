
module.exports = BinaryWriter;

function BinaryWriter(buffer, offset){
	this.defaultType = 'setUint8';
	this.bytes = buffer || [];
	this.offset = offset || this.bytes.length;

	Object.defineProperty(this, "buffer", {
	  get: function () {
	  	return new Uint8Array(this.bytes).buffer;
	  }
	});
}

BinaryWriter.prototype.setUint8 = function(value, endianess, offset){
	this.bytes[this.offset++] = value;
}

BinaryWriter.prototype.setUint16 = function(value, endianess, offset){
	if(offset != null && offset > 0) this.offset = offset;
	if(false !== endianess){
		this.bytes[this.offset++] = value & 255;
		this.bytes[this.offset++] = (value >> 8) & 255;
	} else{
		this.bytes[this.offset++] = (value >> 8) & 255;
		this.bytes[this.offset++] = value & 255;
	}
}

BinaryWriter.prototype.setUint32 = function(value, endianess, offset){
	if(offset != null && offset > 0) this.offset = offset;
	if(false !== endianess){
		this.bytes[this.offset++] = value & 255;
		this.bytes[this.offset++] = (value >> 8) & 255;
		this.bytes[this.offset++] = (value >> 16) & 255;
		this.bytes[this.offset++] = (value >> 24) & 255;
	} else{
		this.bytes[this.offset++] = (value >> 24) & 255;
		this.bytes[this.offset++] = (value >> 16) & 255;
		this.bytes[this.offset++] = (value >> 8) & 255;
		this.bytes[this.offset++] = value & 255;
	}
}

BinaryWriter.prototype.setUint64 = function(value, endianess, offset){
	var max = Math.pow(2, 32) -1,
			hi = Math.floor(value / max),
			lo = hi > 0? hi * max - value : value;

	if(false !== endianess){
		this.setUint32(lo, true, offset);
		this.setUint32(hi, true, offset);
	} else {
		this.setUint32(hi, false, offset);
		this.setUint32(lo, false, offset);
	}
}

BinaryWriter.prototype.setCharCodes = function(str, type){
	var setType = type || this.defaultType;
	for(var i=0, n=str.length; i<n; i++){
		this[setType](str.charCodeAt(i));
	}
}

BinaryWriter.prototype.push = function(value, type, endianess){
	var setType = type || this.defaultType;
	this[setType](value, endianess);
}

BinaryWriter.prototype.unshiftU8 = function(value){
	this.bytes.unshift(value);
	this.offset = 1;
}




