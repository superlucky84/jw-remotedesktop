
var Schema = require('./schema');
module.exports = Protocol;

function Protocol(){
	this.schemas = {};
	this.indexes = {};
}

Protocol.prototype.add = function(topic, options, direction){
	direction = direction || 'receive';
	var schema = new Schema(topic, options);
	if(!this.schemas[schema.key]) this.schemas[schema.key] = schema;

	if(direction == 'send' || direction == 'both') {
		if(!this.indexes[topic]) this.indexes[topic] = schema.key
	}
	return this;
}

Protocol.prototype.get = function(topic){
	var key = this.indexes[topic],
			schema = this.schemas[key];

	// if(!key) return throw new Error('topic has not found');
	// if(!schema) return throw new Error('schema has not found');
	return schema;
}

Protocol.prototype.from = function(bytes){
	var payload = bytes[0],
			messageId = bytes[5],
			subtype = bytes[10];

	var schema = this.schemas[payload] || this.schemas[payload +':'+ messageId] || this.schemas[payload +':'+ messageId +':'+ subtype];
	// if(!schema) throw new Error('schema has not found');
	return schema;
}