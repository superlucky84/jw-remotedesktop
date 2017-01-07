
module.exports = Schema;

function has(source, dest, prop){
	var result = source.hasOwnProperty(prop);
	if(result) dest[prop] = source[prop];
	return result;
}

function Schema(topic, options){
	if(!(this instanceof Schema)) return new Schema(topic, options);

	var keys = [];
	this.hasBody = options.hasOwnProperty('body');
	if(this.hasBody) this.body = options.body;

	if(has(options, this, 'payload')) keys.push(options.payload);
	if(has(options, this, 'messageId')) keys.push(options.messageId);
	if(has(options, this, 'subtype')) keys.push(options.subtype);
	if(has(options, this, 'type')) keys.push(options.type);

 	this.topic = topic;
 	this.key = keys.join(':');
}
