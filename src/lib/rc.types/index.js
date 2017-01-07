
module.exports = {
	channelEnums: {data:0, screen: 1},
	connectionTypeEnums: {relay:0, host:1},
	productModeEnums: {view: 0xc80, host: 0x1068},
	protocols:{
		schemaTypes: {
			number: 'Number',
			string: 'String',
			enums: 'Enums',
			flags: 'Flags',
			array: 'Array',
			object: 'object',
			bytes: 'bytes',
			images: 'images'
		}
	},
	parser: {
		fnTypes: {
			uint8: 'Uint8',
			uint16: 'Uint16',
			uint32: 'Uint32',
			uint64: 'Uint64'
		},
		fnSize: {
			'Uint8': 1, 
			'Uint16': 2,
			'Uint32': 4,
			'Uint64': 8
		}
	}	
}
