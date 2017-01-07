
var clone = require('component-clone'),
		types = require('../../rc.types').parser.fnTypes,
		sizes = require('../../rc.types').parser.fnSize,
		Reader = require('./reader'),
		URL = require('../../rc.utils-client').URL,
		jpeg = require('../../rc.jpeg');

module.exports = Decoder;

function Decoder(schema, buffer){
	this.schema = clone(schema);
	this.view = new Reader(buffer, schema.hasBody? 10: 0);
	if(schema.type) this.view.offset = 1;
	this.data = {};
}

Decoder.prototype.unpack = function(){
	if(!this.schema.hasBody) return null;
	this.dataBind(this.schema.body, this.data);
	return this.data;
}

Decoder.prototype.dataBind = function(structs, obj){
	var keys = Object.keys(structs);
	for(var i=0, n=keys.length; i<n; i++){
		var name = keys[i],
				struct = structs[name];
		this[struct.type](struct, obj, name);
	}
}

Decoder.prototype.get = function(type, le, offset){
	return this.view['get'+type](false !== le, offset);
}

Decoder.prototype.Number = function(struct, obj, name){
	obj[name] = this.get(struct.encoding, struct.le);
}

Decoder.prototype.Enums = function(struct, obj, name){
	var num = this.get(struct.encoding, struct.le);
	obj[name] = struct.enums[num];
}

Decoder.prototype.Flags = function(struct, obj, name){
	var num = this.get(struct.encoding, struct.le);
	var array = [], keys = Object.keys(struct.enums);

	for(var i=0, n=keys.length; i<n; i++){
		var key = keys[i];
		if(num & struct.enums[key] === struct.enums[key]) array.push(key);
	}
	obj[name] = array.join('|');
}

Decoder.prototype.String = function(struct, obj, name){
	var len = struct.size || 0,
			str = '';
	if(struct.vary) len = this.get(struct.vary.encoding, struct.le);

	if(struct.encoding == 'Uint16'){
		for(var i=0; i<len/2; i++){ 
			str += String.fromCharCode(this.get(struct.encoding, struct.le));
		}
	} else if(struct.encoding == 'Uint8'){
		for(var i=0; i<len; i++){ 
			str += String.fromCharCode(this.get(struct.encoding, struct.le));
		}
	}
	obj[name] = str;
}

Decoder.prototype.images = function(struct, obj, name){
	var subtype = this.get(types.uint8),
			len = this.get(types.uint16),
			promises = [],
			self = this;

	for(var i=0; i<len; i++){
		var promise = new Promise(function(resolve, reject){
			var rect = jpeg.pool.get();
			rect.x = self.get(types.uint16);
			rect.y = self.get(types.uint16);
			rect.w = self.get(types.uint16) - rect.x;
			rect.h = self.get(types.uint16) - rect.y;
			rect.img.onload = function(){
				resolve(rect);
			};
			rect.img.onerror = function(e){
				reject(e);
			};
			rect.img.src = jpeg.createImgSrc(subtype, self.bytes2(), rect.w, rect.h);
			//if(rect.img.complete) resolve(rect);
		});
		promises.push(promise);
	}

	obj[name] = { subtype: subtype, rects: promises};
}

Decoder.prototype.bytes2 = function(){
	var len = this.get(types.uint32)
	return this.view.getBytes(len);
}

Decoder.prototype.bytes = function(struct, obj, name){
	var len = this.get(struct.vary.encoding)
	obj[name] = this.view.getBytes(len);
}

Decoder.prototype.object = function(struct, obj, name){
	obj[name] = {};
	this.dataBind(struct.nested, obj[name])
}

Decoder.prototype.Array = function(struct, obj, name){
	var array = obj[name] = [];
	var len = 0;
	if(struct.vary.ref){
		len = obj[struct.vary.ref];
	} else {
		len = this.get(struct.vary.encoding);
	}

	for(var i=0; i<len; i++){
		var data = {};
		this.dataBind(struct.nested, data);
		array.push(data);
	}
}
