
var clone = require('component-clone'),
		types = require('../../rc.types').parser.fnTypes,
		sizes = require('../../rc.types').parser.fnSize,
		Writer = require('./writer');

module.exports = Encoder;

function Encoder(schema, obj){
	this.schema = clone(schema);
	this.data = clone(obj);
	
	this.view = new Writer();
	this.messageSize = this.schema.hasBody? 5: 1;
	this.dataSize = 0;
	
	if(this.schema.payload != null){
		this['Number']({encoding: types.uint8}, this.schema.payload);
		if(this.messageSize) this['Number']({encoding: types.uint32}, this.messageSize);
		if(this.schema.messageId != null) this['Number']({encoding: types.uint8}, this.schema.messageId);
		if(this.dataSize > 0 || this.schema.hasBody) this['Number']({encoding: types.uint32}, this.dataSize || 0);
	} else if(this.schema.type != null){
		this['Number']({encoding: types.uint8}, this.schema.type);
	}

    console.log("--------",this.view.bytes);
}

Encoder.prototype.setHeader = function(){
	if(this.schema.payload != null){

		var byteLength = this.view.bytes.length;
		if(byteLength > 5){
			this.set(types.uint32, byteLength -5, true, 1);
			if(byteLength > 10) this.set(types.uint32, byteLength -10, true, 6);
		}
	}
}

Encoder.prototype.pack = function(){
	if(!this.schema.hasBody) return this.view;
	this.dataBind(this.schema.body, this.data);
	this.setHeader();
	return this.view;
}

Encoder.prototype.dataBind = function(structs, obj){
	var keys = Object.keys(structs);
	for(var i=0, n=keys.length; i<n; i++){
		var name = keys[i],
				struct = structs[name],
				value = typeof(obj[name]) === 'number'? obj[name]: obj[name] || struct.default;
    console.log(struct.type, struct, value);
		this[struct.type](struct, value);
	}
}

Encoder.prototype.set = function(type, value, le, offset){
	this.view['set'+type](value, false !== le, offset);
}

Encoder.prototype.String = function(struct, value){
	if(struct.vary) this.set(struct.vary.encoding, value.length);

	for(var i=0, n=value.length; i<n; i++){
		this.set(struct.encoding, value.charCodeAt(i));
	}
}

Encoder.prototype.Number = function(struct, value){
	this.set(struct.encoding, value, struct.le);
}

Encoder.prototype.object = function(structs, obj){
	this.dataBind(structs.nested, obj || {})
}

Encoder.prototype.Array = function(structs, obj){
	if(!obj ||! obj.hasOwnProperty('length')) return;
	for(var i=0, n=obj.length; i<n; i++){
		this.dataBind(structs.nested, obj.shift());
	}
	//this.dataBind(structs.nested, obj || {})
	//this.flatten(structs.nested, obj);
}
