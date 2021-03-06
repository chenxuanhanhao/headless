

module.exports = [{
	name: 'page',
	types: [
		{
			name: 'evaluate',
			desc: '函数evaluate',
			requireds: [{
				name: 'string',
				type: String,
				inputType: 'textarea',
				desc: '执行的字符串'
			}]
		},
		{
			name: 'exposeFunction',
			desc: '函数注入',
			requireds: [{
				name: 'name',
				type: String,
				desc: '注入到window对象项的函数名'
			}, {
				name: 'value',
				type: String,
				desc: '返回值，注意返回值是以promise的形式返回'
			}]
		},
		{
			name: 'waitFor',
			desc: '等待事件',
			requireds: [
				{
					name: 'timeoutOrSelector',
					type: String,
					desc: '等待操作-超时或选择符'
				}
			],
			optionals: [{
				name: 'options',
				type: Object,
				desc: '选项，用于等待selector，timeout超时时间，visible表示显示',
				keys: ["visible", "timeout"]
			}]
		},
		{
			name: 'click',
			desc: '点击事件',
			requireds: [{
				name: 'selector',
				type: String,
				desc: 'dom选择器，用于$'
			}],
			optionals: [{
				name: 'options',
				type: Object,
				desc: '选项，用于click函数',
				keys: ["button", "clickCount", "delay"]
			}]
		},
		{
			name: 'type',
			desc: '输入事件',
			requireds: [{
				name: 'text',
				type: String,
				desc: '输入的文字'
			}],
			optionals: [{
				name: 'options',
				type: Object,
				desc: '选项，用于type函数',
				keys: ["delay"]
			}]
		},
		{
			name: 'press',
			desc: '输入事件',
			requireds: [{
				name: 'key',
				type: String,
				desc: '输入的keyCode'
			}],
			optionals: [{
				name: 'options',
				keys: ['text', 'delay']
			}]
		},
		{
			name: 'focus',
			desc: '激活一个元素',
			requireds: [{
				name: 'selector',
				type: String,
				desc: 'dom选择器，用于$'
			}]
		},
		{
			name: 'hover',
			desc: 'hover函数',
			requireds: [{
				name: 'selector',
				type: String,
				desc: 'dom选择器，用于$'
			}]
		}, 
		{
			name: 'tap',
			desc: 'tap函数',
			requireds: [{
				name: 'selector',
				type: String,
				desc: 'dom选择器，用于$'
			}]
		}, 
		{
			name: 'keyboard',
			desc: '键盘事件',
			requireds: [
				{
					name: 'down',
					type: String,
					desc: '按下键盘上的键',
					requireds: [{
						name: 'key',
						type: String,
						desc: '按下的键的keyCode'
					}],
					optionals: [{
						name: 'text',
						desc: '附带的字符',
						type: String
					}]
				}, 
				{
					name: 'sendCharacter',
					type: String,
					desc: '发送字符',
					requireds: [{
						name: 'char',
						type: String,
						desc: '发送的字符'
					}]
				}, 
				{
					name: 'up',
					type: String,
					desc: '按上的键盘的键',
					requireds: [{
						name: 'key',
						type: String,
						desc: '键值keycode'
					}]
				}
			]
		}, 
		{
			name: 'mouse',
			desc: '鼠标事件',
			requireds: [
				{
					name: 'click',
					type: String,
					desc: '鼠标点击事件',
					requireds: [{
						name: 'x',
						type: Number,
						desc: '鼠标坐标的x值'
					}, {
						name: 'y',
						type: Number,
						desc: '鼠标坐标的y值'
					}],
					optionals: [{
						name: 'options',
						keys: ["button", "clickCount", "delay"]
					}]
				}, 
				{
					name: 'down',
					type: String,
					desc: '鼠标按下事件',
					optionals: [{
						name: 'options',
						keys: ["button", "clickCount"]
					}]
				},
				{
					name: 'up',
					type: String,
					desc: '鼠标抬起事件',
					optionals: [{
						name: 'options',
						keys: ["button", "clickCount"]
					}]
				},
				{
					name: 'move',
					type: String,
					desc: '鼠标移动事件',
					requireds: [{
						name: 'x',
						type: Number,
						desc: '鼠标坐标的x值'
					}, {
						name: 'y',
						type: Number,
						desc: '鼠标坐标的y值'
					}],
					optionals: [{
						name: 'options',
						keys: ["steps"]
					}]
				},
			]
		},
		{
			name: 'touchscreen',
			desc: '触摸屏',
			requireds: [{
				name: 'tap',
				type: String,
				desc: '触摸点击事件',
				requireds: [{
					name: 'x',
					desc: '触摸点击坐标x',
					type: Number
				},{
					name: 'y',
					desc: '触摸点击坐标y',
					type: Number
				}]
			}]
		}, 
	]
},{
	name: 'element',
	requireds: [{
		name: 'selector',
		desc: 'dom选择符',
		type: String
	}],
	types: [
		{
			name: 'click',
			type: String,
			desc: '元素点击事件',
			optionals: [{
				name: 'options',
				keys: ['button', 'clickCount', 'delay']
			}]
		},
		{
			name: 'tap',
			desc: '触摸点击事件'
		},
		{
			name: 'hover',
			desc: 'hover事件'
		},
		{
			name: 'uploadFile',
			desc: '选择文件上传',
			requireds: [{
				name: 'filePaths',
				type: Array,
				desc: '上传的文件路径'
			}]
		}
	]
}]