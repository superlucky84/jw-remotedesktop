module.exports = BinaryReader;

function BinaryReader(buffer, offset){
	this.bytes = new Uint8Array(buffer);
	this.offset = offset || 0;

  Object.defineProperty(this, "buffer", {
	  get: function () {
	  	this.bytes.buffer; 
	  }
	});
}

BinaryReader.prototype.getUint8 = function(offset){
	return this.bytes[this.offset++];
}

BinaryReader.prototype.getBytes = function(len, offset){
	if(offset != null && offset > 0) this.offset = offset;
	return this.bytes.subarray(this.offset, this.offset = this.offset+len);
}

BinaryReader.prototype.getUint16 = function(le, offset){
	if(offset != null && offset > 0) this.offset = offset;
	if(le) return this.bytes[this.offset++] | this.bytes[this.offset++] << 8;
	return this.bytes[this.offset++] << 8 | this.bytes[this.offset++];
}

BinaryReader.prototype.getUint32 = function(le, offset){
	if(offset != null && offset > 0) this.offset = offset;
	if(le){
		return (this.bytes[this.offset++] | (this.bytes[this.offset++] << 8) |
			(this.bytes[this.offset++] << 16) | (this.bytes[this.offset++])<<24) >>> 0;
	} 
	return ((this.bytes[this.offset++] << 24) | (this.bytes[this.offset++] << 16) |
		(this.bytes[this.offset++] << 8) | this.bytes[this.offset++]) >>> 0;
}

BinaryReader.prototype.getUint64 = function(le, offset){
	var lo = 0, hi = 0;
	if(le){
		lo = this.getUint32(le, offset);
		hi = this.getUint32(le, offset);
	} else {
		hi = this.getUint32(false, offset);
		lo = this.getUint32(false, offset);
	}
	return (Math.pow(2, 32)-1) * hi + lo;
}
