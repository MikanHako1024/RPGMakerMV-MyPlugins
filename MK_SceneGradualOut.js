//=============================================================================
// MK_SceneGradualOut.js
// 
//=============================================================================
//  author : Mikan 
//  plugin : MK_SceneGradualOut.js 场景渐出
// version : v1.0.01 2019/12/11 修复了图片能覆盖在效果上的问题
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/_MikanHako/
//  [GitHub] https://github.com/MikanHako1024/
//    [Blog] NONE
//=============================================================================






/*:
 * @plugindesc 场景渐出 <MK_SceneGradualOut>
 * @author Mikan 
 * @version v1.0.01 2019/12/11 修复了图片能覆盖在效果上的问题
 * v1.0.00 2019/12/08 最初的可用版本
 * v0.1.05 2019/12/08 改用自带的拍摄逻辑
 * v0.1.04 2019/12/08 实现了基本功能
 * v0.1.00 2019/11/21 最初的构架
 * 
 * 
 * @param ==== 参数配置 ====
 * 
 * @param ==== 插件指令配置 ====
 * 
 * @param ==== under ====
 * 
 * @help
 * ---- 插件指令 ----
 * 
 *   # 设置下一次转场需要的渐变效果.
 *   SceneGradualOut (effectName) [...arguments]
 * 
 *     # 整个场景渐变.
 *     SceneGradualOut whole time
 *         time : 总时间
 * 
 *     # 移动剪切渐变.
 *     SceneGradualOut move time angle [fadeWidth]
 *         time      : 总时间
 *         angle     : 角度 (角度制，横向右方向为0，顺时针转动)
 *             0   : 右
 *             45  : 右下
 *             90  : 下
 *             135 : 左下
 *             180 : 左
 *             225 : 左上
 *             270 : 上
 *             315 : 右上
 *             等
 *         fadeWidth : 渐变宽 (可选 默认60)
 *   
 *     # 圆形扩散/汇聚渐变.
 *     SceneGradualOut round time mode target [fadeWidth] [offsetX] [offsetY]
 *         time      : 总时间
 *         mode      : 方式
 *             true  : 扩散
 *             false : 汇聚
 *             other : 汇聚
 *         target    : 目标
 *             -1    : 场景中央
 *              0    : 人物中央
 *             >0    : id为target的事件的中央
 *         fadeWidth : 渐变宽 (可选 默认60)
 *         offsetX   : 偏移X  (可选 默认 0)
 *         offsetY   : 偏移Y  (可选 默认 0)
 * 
 * ---- 用语说明 ----
 * 
 * NONE
 * 
 * 
 * 
 * ---- 参数描述 ----
 * 
 * NONE
 * 
 * 
 * 
 * ---- 标签设置 ----
 * 
 * NONE
 * 
 * 
 * 
 * ---- 使用方法 ----
 * 
 * # 以人物为中心圆形扩散.
 *     # 在转场前使用插件指令 SceneGradualOut (effectName) [...arguments].
 *         某场景 触发 事件 
 *             ◆插件指令：SceneGradualOut round 300 true 0 60
 *             ◆场所移动：民居 (17,13) (淡入淡出: 无)
 * 
 *     # 目标场景先进行初始操作 然后等待.
 *         目标场景 自动执行 事件 
 *             ◆插件指令：ScreenEffect dropColor ON
 *             ◆插件指令：ScreenEffect dropColorPlayer OFF
 *             ◆等待：300帧
 *             ◆暂时消除事件
 * 
 * # 整个场景渐变 共300帧.
 *     ◆插件指令：SceneGradualOut whole 300
 * 
 * # 移动剪切渐变 共300帧 方向从左上到右下 渐变宽60.
 *     ◆插件指令：SceneGradualOut move 300 45 60
 * 
 * # 以人物为中心圆形扩散 共300帧 渐变宽60.
 *     ◆插件指令：SceneGradualOut round 300 true 0 60
 * 
 * # 以人物为中心圆形汇聚 共300帧 渐变宽60.
 *     ◆插件指令：SceneGradualOut round 300 false 0 60
 * 
 * # 以id=15的事件为中心圆形扩散 共300帧 渐变宽60.
 *     ◆插件指令：SceneGradualOut round 300 true 15 60
 * 
 * # 以人物的上一格为中心圆形汇聚 共300帧 渐变宽60.
 *     ◆插件指令：SceneGradualOut round 300 false 0 60 0 -48
 * 
 * 
 * TODO
 * 
 * 
 * 
 * ---- 开发方法 ----
 * 
 * TODO
 * 
 * 
 * 
 * ---- 使用规约 ----
 * 
 * TODO
 * 
 * 
 */





var MK_Data = MK_Data || {};
MK_Data.paramGet = MK_Data.paramGet || {};
MK_Data.param = MK_Data.param || {};



(function() {


class MK_Filter_GradualOut_Whole extends PIXI.Filter {
	constructor(options) {

		var vertex = 'attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}';
		var fragment = 'varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\n\r\nuniform float totalTime;\r\nuniform float time;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * (1. - smoothstep(0., totalTime, time));\r\n}\r\n';


		super(vertex, fragment);

		Object.assign(this, {
			totalTime: 120, 
			time: 0, 
		}, options);
	}       

	apply(filterManager, input, output, clear) {

		if (!input.filterFrame) {
			input.filterFrame = {};
			input.filterFrame.width = Graphics.boxWidth;
			input.filterFrame.height = Graphics.boxHeight;
		}

		this.uniforms.dimensions[0] = input.filterFrame.width;
		this.uniforms.dimensions[1] = input.filterFrame.height;

		this.uniforms.time = this.time;

		filterManager.applyFilter(this, input, output, clear);
	}

	set totalTime(value) {
		this.uniforms.totalTime = value;
	}
	get totalTime() {
		return this.uniforms.totalTime;
	}
}

class MK_Filter_GradualOut_MoveTailoring extends PIXI.Filter {
	constructor(options) {

		var vertex = 'attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}';
		var fragment = 'varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\n\r\nuniform float fadeWidth;\r\nuniform float angle;\r\nuniform float totalTime;\r\nuniform float time;\r\n\r\nvoid main(void)\r\n{\r\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\r\n    vec2 coord = pixelCoord / dimensions;\r\n	\r\n	vec2 vertexList[4];\r\n	vertexList[0] = vec2(         0. ,          0. );\r\n	vertexList[1] = vec2(filterArea.x,          0. );\r\n	vertexList[2] = vec2(         0. , filterArea.y);\r\n	vertexList[3] = vec2(filterArea.x, filterArea.y);\r\n	\r\n	vec2 direction = vec2(cos(radians(angle)), sin(radians(angle)));\r\n	float lenList[4];\r\n	for (int i=0; i<4; i++)\r\n		lenList[i] = vertexList[i].x * direction.x + vertexList[i].y * direction.y;\r\n	float minLen = lenList[0], maxLen = lenList[0]; \r\n	for (int i=1; i<4; i++) {\r\n		if (minLen > lenList[i]) minLen = lenList[i];\r\n		if (maxLen < lenList[i]) maxLen = lenList[i];\r\n	}\r\n	float totalLen = maxLen - minLen;\r\n	\r\n	float pointLen = pixelCoord.x * direction.x + pixelCoord.y * direction.y;\r\n	\r\n	pointLen -= minLen;\r\n	float k = smoothstep(0., fadeWidth, pointLen - (totalLen + fadeWidth) * time / totalTime + fadeWidth);\r\n	\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * k;\r\n}\r\n';


		super(vertex, fragment);

		Object.assign(this, {
			fadeWidth: 200, 
			angle: -45, 
			totalTime: 120, 
			time: 0, 
		}, options);
	}       

	apply(filterManager, input, output, clear) {

		if (!input.filterFrame) {
			input.filterFrame = {};
			input.filterFrame.width = Graphics.boxWidth;
			input.filterFrame.height = Graphics.boxHeight;
		}

		this.uniforms.dimensions[0] = input.filterFrame.width;
		this.uniforms.dimensions[1] = input.filterFrame.height;

		this.uniforms.time = this.time;

		filterManager.applyFilter(this, input, output, clear);
	}

	set fadeWidth(value) {
		this.uniforms.fadeWidth = value;
	}
	get fadeWidth() {
		return this.uniforms.fadeWidth;
	}

	set angle(value) {
		this.uniforms.angle = value;
	}
	get angle() {
		return this.uniforms.angle;
	}

	set totalTime(value) {
		this.uniforms.totalTime = value;
	}
	get totalTime() {
		return this.uniforms.totalTime;
	}
}

class MK_Filter_GradualOut_RoundSpreading extends PIXI.Filter {
	constructor(options) {

		var vertex = 'attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}';
		var fragment = 'varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\n\r\nuniform float fadeWidth;\r\nuniform float centerX;\r\nuniform float centerY;\r\nuniform bool isSpread;\r\nuniform float totalTime;\r\nuniform float time;\r\n\r\nvoid main(void)\r\n{\r\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\r\n    vec2 coord = pixelCoord / dimensions;\r\n	\r\n	vec2 vertexList[4];\r\n	vertexList[0] = vec2(         0. ,          0. );\r\n	vertexList[1] = vec2(filterArea.x,          0. );\r\n	vertexList[2] = vec2(         0. , filterArea.y);\r\n	vertexList[3] = vec2(filterArea.x, filterArea.y);\r\n	\r\n	vec2 center = vec2(centerX, centerY);\r\n	float lenList[4];\r\n	for (int i=0; i<4; i++)\r\n		lenList[i] = length(vertexList[i] - center);\r\n	float maxLen = lenList[0]; \r\n	for (int i=1; i<4; i++)\r\n		if (maxLen < lenList[i]) maxLen = lenList[i];\r\n	float totalLen = maxLen;\r\n	\r\n	float pointLen = length(pixelCoord - center);\r\n	totalLen += fadeWidth;\r\n	float k = isSpread \r\n			?      smoothstep(0., fadeWidth, (pointLen + fadeWidth) - totalLen * time / totalTime)\r\n			: 1. - smoothstep(0., fadeWidth, (pointLen + fadeWidth) - totalLen * (totalTime - time) / totalTime);\r\n			\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * k;\r\n}\r\n';
		

		super(vertex, fragment);

		Object.assign(this, {
			fadeWidth: 200, 
			centerX: 408, 
			centerY: 312, 
			isSpread: true, 
			totalTime: 60,  
			time: 0, 
		}, options);
	}       

	apply(filterManager, input, output, clear) {

		if (!input.filterFrame) {
			input.filterFrame = {};
			input.filterFrame.width = Graphics.boxWidth;
			input.filterFrame.height = Graphics.boxHeight;
		}

		this.uniforms.dimensions[0] = input.filterFrame.width;
		this.uniforms.dimensions[1] = input.filterFrame.height;

		this.uniforms.time = this.time;

		filterManager.applyFilter(this, input, output, clear);
	}

	set fadeWidth(value) {
		this.uniforms.fadeWidth = value;
	}
	get fadeWidth() {
		return this.uniforms.fadeWidth;
	}

	set centerX(value) {
		this.uniforms.centerX = value;
	}
	get centerX() {
		return this.uniforms.centerX;
	}

	set centerY(value) {
		this.uniforms.centerY = value;
	}
	get centerY() {
		return this.uniforms.centerY;
	}

	set isSpread(value) {
		this.uniforms.isSpread = value;
	}
	get isSpread() {
		return this.uniforms.isSpread;
	}

	set totalTime(value) {
		this.uniforms.totalTime = value;
	}
	get totalTime() {
		return this.uniforms.totalTime;
	}
}



function Sprite_GradualOut() {
	this.initialize.apply(this, arguments);
}

Sprite_GradualOut.prototype = Object.create(Sprite_Base.prototype);

Sprite_GradualOut.prototype.constructor = Sprite_GradualOut;


Sprite_GradualOut.filterInfo = {
	'Whole'          : {
		'class' : MK_Filter_GradualOut_Whole, 
		'regExp' : /(whole)/i, 
		'param' : [60], 
		'update' : function(filter, param) {
			filter.totalTime = param[0];
		}, 
	}, 
	'MoveTailoring'  : {
		'class' : MK_Filter_GradualOut_MoveTailoring,  
		'regExp' : /(move|moveTailor|moveTailoring)/i,
		'param' : [60, 0, 100], 
		'update' : function(filter, param) {
			filter.totalTime = param[0]; 
			filter.angle     = param[1]; 
			filter.fadeWidth = param[2]; 
		}, 
	}, 
	'RoundSpreading' : {
		'class' : MK_Filter_GradualOut_RoundSpreading, 
		'regExp' : /(round|RoundSpread|RoundSpreading)/i, 
		'param' : [60, 408, 312, true, 100], 
		'update' : function(filter, param) {
			filter.totalTime = param[0]; 
			filter.centerX   = param[1]; 
			filter.centerY   = param[2]; 
			filter.isSpread  = param[3]; 
			filter.fadeWidth = param[4]; 
		}, 
	}, 
};

(function() {
	for (var key in Sprite_GradualOut.filterMap) {
		var filterName = key;
		var filterInfo = Sprite_GradualOut.filterInfo[key];

		Filter_Controller.filterNameMap      [filterName] = filterInfo.class ;
		Filter_Controller.defaultFilterParam [filterName] = filterInfo.param ;
		Filter_Controller.updateFilterHandler[filterName] = filterInfo.update;
	}
})();

Sprite_GradualOut.findFilter = function(filterString) {
	for (var filterName in this.filterInfo) {
		if (!!this.filterInfo[filterName].regExp.exec(filterString)) {
			return filterName;
		}
	}
	return null;
}

Sprite_GradualOut.prototype.findFilter = function(filterString) {
	return this.constructor.findFilter(filterString);
}



Sprite_GradualOut.prototype.initialize = function() {
	Sprite_Base.prototype.initialize.call(this);

	this._effectTime = 0;
	this._effectMaxTime = 0;
};

Sprite_GradualOut.makeEffectSprite = function(time, filterString, param) {
	var sprite = new this();
	sprite.setEffect(time, filterString, param);
	return sprite;
}

Sprite_GradualOut.prototype.setEffect = function(time, filterString, param) {
	var filter = this.getFilter(filterString, param);
	this.applyFilter(filter);
	this.setEffectTime(time);
};


Sprite_GradualOut.setEffectSprite = function(time, filterString, param) {
	this._effectSprite = this.makeEffectSprite(time, filterString, param);
}
Sprite_GradualOut.getEffectSprite = function() {
	return this._effectSprite;
}
Sprite_GradualOut.unsetEffectSprite = function() {
	this._effectSprite = null;
}

Sprite_GradualOut.isNeedGradualOut = function() {
	return !!this._effectSprite;
}


Sprite_GradualOut.getLastSceneSnap = function() {
	return SceneManager._gradualOutBitmap;
};

Sprite_GradualOut.prototype.setLastSceneSnap = function() {
	this.bitmap = this.constructor.getLastSceneSnap();
}



Sprite_GradualOut.prototype.getFilter = function(filterString, param) {
	var filterName = this.findFilter(filterString);
	
	var filterInfo = this.constructor.filterInfo[filterName];
	if (filterInfo) {
		var filter = new (filterInfo.class)();
		filterInfo.update(filter, param);
		return filter;
	}
	else return null;
};

Sprite_GradualOut.prototype.applyFilter = function(filter) {

	if (!filter) return ;

	var arr = this.filters || [];
	arr.push(filter);
	this.filters = arr;
	
	var margin = 0;
	var width  = Graphics.boxWidth  + margin * 2;
	var height = Graphics.boxHeight + margin * 2;
	this.filterArea = new Rectangle(-margin, -margin, width, height);
};


Sprite_GradualOut.prototype.setEffectTime = function(time) {
	time = Number(time) || 0;
	this._effectTime = time;
	this._effectMaxTime = time;
};


Sprite_GradualOut.prototype.appendMe = function(scene) {
	scene = scene || SceneManager._scene;

	if (!this.bitmap) {
		this.setLastSceneSnap();
	}

	if (scene) {
		scene.addChild(this);

		if (scene instanceof ScreenSprite) {
        	scene.opacity = 255; 
        	scene.removeChild(scene._graphics);
			scene._gradualoutSprite = this;
		}
	}
};

Sprite_GradualOut.prototype.removeMe = function() {
	var parent = this.parent;
	if (parent) {
		parent.removeChild(this);

		if (parent instanceof ScreenSprite) {
			parent.opacity = 0;
        	parent.addChild(parent._graphics);
		}
	}
};

Sprite_GradualOut.prototype.isFinished = function() {
	return (this._effectTime <= 0);
}

Sprite_GradualOut.prototype.update = function() {
	this._effectTime--;
	if (this.isFinished()) {
		this.removeMe();
	}
	else {
		var arr = this.filters;
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				arr[i].time = this._effectMaxTime - this._effectTime;
			}
		}
	}
};


var _MK_Game_Interpreter_pluginCommand   = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_MK_Game_Interpreter_pluginCommand.apply(this, arguments);

	commandCode = 'SceneGradualOut';
	if ((command || '') != commandCode) return ;

	var filterString = '';
	var param = [];
	var time = 0;

	filterString = args[0] || '';
	time = Number(args[1] || 0);
	param[0] = time;

	switch (filterString) {
		case 'whole' :
			break;

		case 'move' :
			param[1] = Number(args[2] || 0);
			param[2] = Number(args[3] || 60);
			break;

		case 'round' :
			param[3] = !!(String(args[2] || 'true').match(/(true)/i));

			var id = Number(args[3] || 0);
				 if (id == -1) {
				param[1] = Math.floor(Graphics.boxWidth  / 2);
				param[2] = Math.floor(Graphics.boxHeight / 2);
			}
			else if (id ==  0) {
				var c = SceneManager._scene._spriteset._characterSprites[
					SceneManager._scene._spriteset._characterSprites.length - 1];
				param[1] = c.x;
				param[2] = Math.floor(c.y - c.height / 2);
			}
			else {
				eventId = id;
				var c = SceneManager._scene._spriteset._characterSprites[eventId - 1];
				param[1] = c.x;
				param[2] = Math.floor(c.y - c.height / 2)
			}

			param[4] = Number(args[4] || 60);
			param[1] += Number(args[5] || 0);
			param[2] += Number(args[6] || 0);
			break;
	}

	Sprite_GradualOut.setEffectSprite(time, filterString, param);
};


MK_Data.class = MK_Data.class || {};
MK_Data.class['Sprite_GradualOut'] = Sprite_GradualOut;



var _MK_Scene_Map_initialize   = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
	_MK_Scene_Map_initialize.apply(this, arguments);

	this._gradualSprite = null;
};

var _MK_Scene_Map_start   = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	_MK_Scene_Map_start.apply(this, arguments);
	
	this.startLastSceneGradualOut();
};

Scene_Map.prototype.startLastSceneGradualOut = function() {
	this.createGradualSprite();
};

Scene_Map.prototype.createGradualSprite = function() {
	if (Sprite_GradualOut.isNeedGradualOut()) {
        this._gradualSprite = new ScreenSprite();
        this.addChild(this._gradualSprite);

		var sprite = Sprite_GradualOut.getEffectSprite();
		if (sprite) {
			Sprite_GradualOut.unsetEffectSprite();
			sprite.appendMe(this._gradualSprite);
		}
	}
}

var _MK_Scene_Map_update   = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    this.updateGradualOut();
	_MK_Scene_Map_update.apply(this, arguments);
};

Scene_Map.prototype.updateGradualOut = function() {
	if (this._gradualSprite) {
		var sprite = this._gradualSprite._gradualoutSprite;
	    if (sprite) sprite.update();
	}
};


SceneManager.snapForGradualOut = function() {
	this._gradualOutBitmap = this.snap();
};

SceneManager.gradualOutBitmap = function() {
	return this._gradualOutBitmap;
};


var _MK_SceneManager_snapForBackground = SceneManager.snapForBackground;
SceneManager.snapForBackground = function() {
	_MK_SceneManager_snapForBackground.apply(this, arguments);
	this.snapForGradualOut();
};


})();


