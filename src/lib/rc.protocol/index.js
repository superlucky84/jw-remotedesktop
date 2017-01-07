
var Protocol = require('./lib/protocol'),
		types = require('../rc.types').parser.fnTypes,
		schemaTypes = require('../rc.types').protocols.schemaTypes;

var exports = module.exports = {};
exports.data = new Protocol();
exports.screen = new Protocol();

exports.data
	.add('Channel:ListenRequest', {
		payload: 200,
		messageId: 0,
		body:{
			channelId: {type: schemaTypes.number, encoding: types.uint8}
		}
	}, 'send')
	.add('Channel:ConnectRequest',{
		payload: 200,
		messageId: 4,
		body:{
			channelId: {type: schemaTypes.number, encoding: types.uint8},
			port: {type: schemaTypes.number, encoding: types.uint32},
			guid: {type: schemaTypes.string, encoding: types.uint16, size: 32},
			endOfString: {type: schemaTypes.number, encoding: types.uint16, default:0}	
		}
	}, 'send')
	.add('Channel:Close', {
		payload: 200,
		messageId: 8,
		body:{
			mode : {type: schemaTypes.number, encoding: types.uint8, default: 2}
		}
	}, 'both')
	.add('ChannelNop:Request', {
		payload: 201,
		messageId: 0
	}, 'both')
	.add('ChannelNop:Confirm', {
		payload: 201,
		messageId: 1
	})
	.add('ChannelNop:NoopRequestNoAck', {
		payload: 201,
		messageId: 2
	}, 'send')
	.add('KeyMouseCtrl:Request', {
		payload: 202,
		messageId: 0
	}, 'send')
	.add('KeyMouseCtrl:Confirm', {
		payload: 202,
		messageId: 1,
		body: {
			state: {type: schemaTypes.number, encoding: types.uint32},
		}
	})
	.add('KeyMouseCtrl:InputBlock', {
		payload: 202,
		messageId: 7
	}, 'send')
	.add('KeyMouseCtrl:KeyEvent', {
		payload: 202,
		messageId: 20,
		body:{
			down: {type: schemaTypes.number, encoding: types.uint8, default: 0},
			pad: {type: schemaTypes.number, encoding: types.uint16, default: 0},
			key: {type: schemaTypes.number, encoding: types.uint32, default: 0},
			specialkeystate: {type: schemaTypes.number, encoding: types.uint16, default: 0},
		}
	}, 'send')
	.add('KeyMouseCtrl:MouseEvent', {
		payload: 202,
		messageId: 21,
		body:{
			buttonMask: {type: schemaTypes.number, encoding: types.uint8},
			x: {type: schemaTypes.number, encoding: types.uint16},
			y: {type: schemaTypes.number, encoding: types.uint16},
		}
	}, 'send')
	.add('LaserPointer:Start', {
		payload: 203,
		messageId: 0,
		body:{
			type: {type: schemaTypes.number, encoding: types.uint8},
			x: {type: schemaTypes.number, encoding: types.uint16},
			y: {type: schemaTypes.number, encoding: types.uint16},
		}
	}, 'send')
	.add('LaserPointer:End', {
		payload: 203,
		messageId: 1
	}, 'send')
	.add('LaserPointer:Pos', {
		payload: 203,
		messageId: 2,
		body:{
			positions: { type: schemaTypes.array, nested:{
				x: {type:schemaTypes.number, encoding: types.uint16},
				y: {type:schemaTypes.number, encoding: types.uint16}
			}}
		}
	}, 'send')
	.add('Draw:Start', {
		payload: 204,
		messageId: 0
	}, 'send')
	.add('Draw:End', {
		payload: 204,
		messageId: 1
	}, 'send')
	.add('Draw:Info', {
		payload: 204,
		messageId: 2,
		body:{
			type: {type: schemaTypes.number, encoding: types.uint8},
			color: {type: schemaTypes.number, encoding: types.uint32, default: 255},
			thickness: {type: schemaTypes.number, encoding: types.uint8},
			realtime: {type: schemaTypes.number, encoding: types.uint8, default: 0}
		}
	}, 'send')
	.add('Draw:Data', {
		payload: 204,
		messageId: 3,
		body:{
			positions: { type: schemaTypes.array, nested:{
				x: {type:schemaTypes.number, encoding: types.uint16},
				y: {type:schemaTypes.number, encoding: types.uint16}
			}}
		}
	}, 'send')
	.add('Monitors:InfoRequest', {
		payload: 205,
		messageId: 0
	}, 'send')
	.add('Monitors:InfoResponse', {
		payload: 205,
		messageId: 1,
		body: {
			x1: {type: schemaTypes.number, encoding: types.uint32},
			y1: {type: schemaTypes.number, encoding: types.uint32},
			x2: {type: schemaTypes.number, encoding: types.uint32},
			y2: {type: schemaTypes.number, encoding: types.uint32},
			monitors: { type: schemaTypes.array, vary:{encoding: types.uint32}, nested:{
				index: {type:schemaTypes.number, encoding: types.uint32},
				x1: {type: schemaTypes.number, encoding: types.uint32},
				y1: {type: schemaTypes.number, encoding: types.uint32},
				x2: {type: schemaTypes.number, encoding: types.uint32},
				y2: {type: schemaTypes.number, encoding: types.uint32}
			}}
		}
	})
	.add('Monitors:Select', {
		payload: 205,
		messageId: 2,
		body: {
			index: {type: schemaTypes.number, encoding: types.uint32}
		}
	}, 'send')
	.add('Favorite:HotKeyCtrlAltDel', {
		payload: 206,
		messageId: 150
	}, 'send')

	// .add('Favorite:Url', {
	// 	payload: 206
	// 	messageId: 0,
	// 	body: {
	// 		urls: {type: schemaTypes.array, vary: {encoding: types.uint32}, nested:{
	// 			url: {type: schemaTypes.string, encoding: types.uint16}
	// 		}}
	// 	}
	// })
	// .add('SysInfo:CpuMemInfoRequest', {
	// 	payload: 207,
	// 	messageId: 0
	// })
	// .add('Process:ListRequest', {
	// 	payload: 208,
	// 	messageId: 0
	// })
	// .add('RebootConnect:Request', {
	// 	payload: 212,
	// 	messageId: 0
	// })
	// .add('Clipboard:DataInfo', {
	// 	payload: 215,
	// 	messageId: 1,
	// 	body: {
	// 		clipboardType: {type: schemaTypes.number, encoding: types.uint8}
	// 	}
	// })
	.add('Options:rcOption', {
		payload: 217,
		messageId: 0,
		body: {
			nFunction: {type: schemaTypes.number, encoding: types.uint32, default: 147308355},
			nOption: {type: schemaTypes.number, encoding: types.uint32, default: 537919488},
			ftpSize: {type: schemaTypes.number, encoding: types.uint32, default: 1000000000},
		}
	}, 'send')
	.add('Options:Setting', {
		payload: 217,
		messageId: 6,
		body: {
			info: {type: schemaTypes.number, encoding: types.uint64, default: 9}
		}
	}, 'send')
	.add('Options:KeyboardLang', {
		payload: 217,
		messageId: 7,
		body: {
			keyLang: {type: schemaTypes.number, encoding: types.uint32}
		}
	}, 'both')
	.add('RemoteInfo:Request', {
		payload: 220,
		messageId: 0,
		body: {
			userId: { type: schemaTypes.string, encoding: types.uint16, default: '4028ad344e84fb54014ecd5e205f6a39'},
			endOfString: {type: schemaTypes.number, encoding: types.uint16, default:0}
		}
	}, 'send')
	.add('RemoteInfo:Data', {
		payload: 220,
		messageId: 1,
		body: {
			platform: {type: schemaTypes.number, encoding: types.uint8},
			account: {type: schemaTypes.number, encoding: types.uint8},
			appMode: {type: schemaTypes.number, encoding: types.uint8},
			major: {type: schemaTypes.number, encoding: types.uint32},
			minor: {type: schemaTypes.number, encoding: types.uint32},
			pcName: {type: schemaTypes.string, encoding: types.uint16, vary: {encoding: types.uint32}},
			ip: {type: schemaTypes.string, encoding: types.uint16, vary: {encoding: types.uint32}},
			osName: {type: schemaTypes.string, encoding: types.uint16, vary: {encoding: types.uint32}},
			osLang: {type: schemaTypes.number, encoding: types.uint32},
			mac: {type: schemaTypes.string, encoding: types.uint16, vary: {encoding: types.uint32}},
			priorConsent: {type: schemaTypes.number, encoding: types.uint16}
		}
	})
	.add('Resolution:CurrentMode', {
		payload: 223,
		messageId: 0,
		body: {
			width: {type: schemaTypes.number, encoding: types.uint16, default: 0},
			height: {type: schemaTypes.number, encoding: types.uint16, default: 0},
			colorBit: {type: schemaTypes.number, encoding: types.uint8, default: 0}
		}
	}, 'both')
	.add('Resolution:EnumMode', {
		payload: 223,
		messageId: 1,
		body: {
			counts: {type: schemaTypes.number, encoding: types.uint8},
			indexMode: {type: schemaTypes.number, encoding: types.uint8},
			info: {type: schemaTypes.array, vary: {ref:'counts'}, nested: {
				width: {type: schemaTypes.number, encoding: types.uint16, default: 0},
				height: {type: schemaTypes.number, encoding: types.uint16, default: 0},
				colorBit: {type: schemaTypes.number, encoding: types.uint8, default: 0}
			}}
		}
	}, 'both')
	.add('DateTime:Sync', {
		payload: 227,
		messageId: 0
	}, 'both')
	.add('TerminalInfo:Request', {
		payload: 239,
		messageId: 0
	}, 'send')
	.add('TerminalInfo:Response', {
		payload: 239,
		messageId: 1,
		body: {
			platform: {type: schemaTypes.enums, encoding: types.uint16, enums: {
				'1': 'windows', '2': 'mac', '3': 'linux', '4': 'android', '5': 'iphone'
			}},
			host: { type: schemaTypes.enums, encoding: types.uint16, enums: {
				'0': 'pc', '1':'rcmp', '2':'rcvp', '3':'rvmp'
			}},
			flags: { type: schemaTypes.flags, encoding: types.uint32, enums: {
				voicChat: 0x01, videoChat: 0x02, vdo: 0x04, vpChat: 0x08, atomJpeg: 0x10
			}}
		}
	});

exports.screen
	.add('ChannelNop:Request', {
		payload: 201,
		messageId: 0
	}, 'both')
	.add('ChannelNop:Confirm', {
		payload: 201,
		messageId: 1
	}, 'both')
	.add('ChannelNop:NoopRequestNoAck', {
		payload: 201,
		messageId: 2
	}, 'send')
	.add('SCap:Options2', {
		type: 4,
		body: {
			subtype: {type: schemaTypes.number, encoding: types.uint8, default: 0},
			flags: {type: schemaTypes.number, encoding: types.uint16, default: 0},
			hook: {type: schemaTypes.object, nested:{ 
				type: {type: schemaTypes.number, encoding: types.uint8, default: 68},
				monitor: {type: schemaTypes.number, encoding: types.uint8, default: 0},
				localPxlCnt: {type: schemaTypes.number, encoding: types.uint8, default: 0},
				rotate: {type: schemaTypes.number, encoding: types.uint8, default: 0},
				flags: {type: schemaTypes.number, encoding: types.uint32, default: 8},
				triggingTime: {type: schemaTypes.number, encoding: types.uint16, default: 40},
				pad: {type: schemaTypes.number, encoding: types.uint16, default: 0},
				xRatio:{ type: schemaTypes.object, nested: {
					numerator: {type: schemaTypes.number, encoding: types.uint16, default: 0},
					denominator: {type: schemaTypes.number, encoding: types.uint16, default: 0} }
				},
				yRatio: {type: schemaTypes.object, nested: {
					numerator: {type: schemaTypes.number, encoding: types.uint16, default: 0},
					denominator: {type: schemaTypes.number, encoding: types.uint16, default: 0} }
				},
				bitrate: {type: schemaTypes.number, encoding: types.uint32, default: 0},
				FPS: {type: schemaTypes.number, encoding: types.uint32, default: 0},
				positions: {type: schemaTypes.object, nested: {
					left: {type: schemaTypes.number, encoding: types.uint32, default: 0},
					top: {type: schemaTypes.number, encoding: types.uint32, default: 0},
					right: {type: schemaTypes.number, encoding: types.uint32, default: 0},
					bottom: {type: schemaTypes.number, encoding: types.uint32, default: 0} }
				},
				encoder: {type: schemaTypes.object, nested: {
					flags: {type: schemaTypes.number, encoding: types.uint32, default: 8},
					type: {type: schemaTypes.string, encoding: types.uint8, size: 1, default: 'j'},
					valid: {type: schemaTypes.number, encoding: types.uint8, default: 255},
					hostPxlCnt: {type: schemaTypes.number, encoding: types.uint8, default: 0},
					remoteBpp: {type: schemaTypes.number, encoding: types.uint8, default: 24},
					jpgLowQuality: {type: schemaTypes.number, encoding: types.uint8, default: 0},
					jpgHighQuality: {type: schemaTypes.number, encoding: types.uint8, default: 80},
					remoteBpp3G: {type: schemaTypes.number, encoding: types.uint8, default: 2},
					remoteBppWifi: {type: schemaTypes.number, encoding: types.uint8, default: 8},
					tileCacheCount: {type: schemaTypes.number, encoding: types.uint32, default: 0},
					dimensions: {type: schemaTypes.object, nested: {
						width: {type: schemaTypes.number, encoding: types.uint16, default: 0},
						height: {type: schemaTypes.number, encoding: types.uint16, default: 0} }
					},
					ratio: {type: schemaTypes.object, nested: {
						width: {type: schemaTypes.number, encoding: types.uint16, default: 0},
						height: {type: schemaTypes.number, encoding: types.uint16, default: 0} }
					},
					bitrate: {type: schemaTypes.number, encoding: types.uint32, default: 0},
					FPS: {type: schemaTypes.number, encoding: types.uint32, default: 0}
				}}
			}}
		}
	}, 'both')
	.add('SCap:Update', {
		type: 13,
		body: {
			frame: {type: schemaTypes.images, nested: {
				subtype: {type: schemaTypes.number, encoding: types.uint8, default: 0},
				rects: {type: schemaTypes.array, vary: {encoding: types.uint16 }, nested: {
					left: {type: schemaTypes.number, encoding: types.uint16},
					top: {type: schemaTypes.number, encoding: types.uint16},
					right: {type: schemaTypes.number, encoding: types.uint16},
					bottom: {type: schemaTypes.number, encoding: types.uint16},
					bytes: {type: schemaTypes.bytes, vary: {encoding: types.uint32}}
				}}
			}}
		}
	});

