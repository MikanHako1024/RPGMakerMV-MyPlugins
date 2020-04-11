//=============================================================================
// MK_SceneDistort.js
// 
//=============================================================================
//  author : Mikan 
//  plugin : MK_SceneDistort.js 场景扭曲
// version : v0.1.03 2019/11/15 开发中
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/_MikanHako/
//  [GitHub] https://github.com/MikanHako1024/
//    [Blog] NONE
//=============================================================================






/*:
 * @plugindesc 场景扭曲 <MK_SceneDistort>
 * @author Mikan 
 * @version v0.1.03 2019/11/15 添加了预设参数组
 * v0.1.02 2019/11/09 更新了扭曲曲线的算法
 * v0.1.00 2019/11/03 最初的构架
 * 
 * 
 * @param ==== 参数配置 ====
 * 
 * @param presetParams
 * @parent ==== 参数配置 ====
 * @type struct<DistortParams>[]
 * @desc 预设参数组
 * @default ["{\"KEY\":\"weak\",\"RANDOMSIZE\":\"6\",\"MAXOFFSET\":\"10\",\"LENGTH\":\"6\",\"SINE_A\":\"4\",\"SINE_B\":\"1/360\",\"SINE_C\":\"0\"}","{\"KEY\":\"normal\",\"RANDOMSIZE\":\"10\",\"MAXOFFSET\":\"20\",\"LENGTH\":\"8\",\"SINE_A\":\"4\",\"SINE_B\":\"1/360\",\"SINE_C\":\"0\"}","{\"KEY\":\"strong\",\"RANDOMSIZE\":\"15\",\"MAXOFFSET\":\"30\",\"LENGTH\":\"5\",\"SINE_A\":\"4\",\"SINE_B\":\"1/360\",\"SINE_C\":\"0\"}"]
 * 
 * @param defaultKey
 * @parent ==== 参数配置 ====
 * @type string
 * @desc 默认参数组名
 * @default normal
 * 
 * @param ==== 插件指令配置 ====
 * 
 * @param 
 * @desc 
 * @default 
 * 
 * @param ==== under ====
 * 
 * @help
 * ---- 插件指令 ----
 * 
 *   # 产生扭曲效果.
 *   DistortEffect time mode argument
 * 
 *     # 使用预设参数产生扭曲效果. (默认)
 *     DistortEffect time preset name
 *       缺省name时 将使用defaultKey的值作为name
 *   
 *     # 使用非预设参数产生扭曲效果. (暂时不允许)
 *     DistortEffect time params arguments
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
 * # 产生扭曲效果.
 * 事件 
 *     ◆插件指令：DistortEffect 30
 * 
 *     ◆插件指令：DistortEffect 30 preset strong
 * 
 * # 离开地图产生扭曲效果.
 * 事件 
 *     ◆插件指令：DistortEffect 30
 *     ◆等待：30帧
 *     ◆场所移动：MAP002 (8,6) (淡入淡出: 无)
 * 
 * # 进入地图产生扭曲效果.
 * 事件 自动执行
 *     ◆插件指令：DistortEffect 30
 *     ◆等待：30帧
 *     ◆暂时消除事件
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

/*~struct~DistortParams:
 *
 * @param KEY
 * @type string
 * @desc 参数组名称
 *     区分大小写 不支持空格
 * @default default
 *
 * @param RANDOMSIZE
 * @type string
 * @desc 随机范围
 * @default 18
 *
 * @param MAXOFFSET
 * @type string
 * @desc 最大偏移
 * @default 50
 *
 * @param LENGTH
 * @type string
 * @desc 曲折密度
 * @default 6
 * 
 * @param SINE_A
 * @type string
 * @desc 三角函数参数 振幅
 *     可以忽略
 * @default 4
 *
 * @param SINE_B
 * @type string
 * @desc 三角函数参数 波长
 *     可以忽略
 * @default 1/360
 *
 * @param SINE_C
 * @type string
 * @desc 三角函数参数 波偏移
 *     可以忽略
 * @default 0
 * 
 */



var MK_Data = MK_Data || {};
MK_Data.paramGet = MK_Data.paramGet || {};
MK_Data.param = MK_Data.param || {};



(function() {


var pluginName = 'MK_SceneDistort';

(function() {


	MK_Data.paramGet[pluginName] = (function (pluginName) {
		var param = PluginManager.parameters(pluginName);
		if (!param || JSON.stringify(param) === '{}') {
			var list = $plugins.filter(function (i) {
				return i.status && i.description.contains('<' + pluginName + '>');
			});
			if (list.length > 0) {
				var realPluginName = list[0].name;
				if (realPluginName && realPluginName !== pluginName)
					return MK_Data.getPluginRaram(realPluginName);
				else return {};
			}
			else return {};
		}
		return param;
	})(pluginName);

	var paramGet = MK_Data.paramGet[pluginName];
	MK_Data.param[pluginName] = {};
	var param = MK_Data.param[pluginName];


	param['presetParams']   	 = String(paramGet['presetParams'] || '[]');
	param['defaultKey']     	 = String(paramGet['defaultKey']   || '');


	var temp1 = JSON.parse(param['presetParams']);
	var temp2 = [];
	for (var idx=0; idx<temp1.length; idx++) {
		temp2.push(JSON.parse(temp1[idx] || '{}'));
	}
	var temp3 = [];
	var numberList = [
		'RANDOMSIZE', 
		'MAXOFFSET', 
		'LENGTH', 
		'SINE_A', 
		'SINE_B', 
		'SINE_C', 
	];
	var stringList = [
		'KEY', 
	];
	for (var idx=0; idx<temp2.length; idx++) {
		temp3[idx] = {};
		for (var i=0; i<numberList.length; i++)
			temp3[idx][numberList[i]] = Number(eval(temp2[idx][numberList[i]]));
		for (var i=0; i<stringList.length; i++)
			temp3[idx][stringList[i]] = String(temp2[idx][stringList[i]]);
	
		temp3[idx]['LENGTH'] = Math.floor(temp3[idx]['LENGTH']);
		if (temp3[idx]['LENGTH'] < 1) temp3[idx]['LENGTH'] = 1;
	}

	param['presetParams']   	 = temp3;

})();



var _MK_Scene_Map_createDisplayObjects   = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
	_MK_Scene_Map_createDisplayObjects.apply(this, arguments);

	this.createEffectsSprite();
};

Scene_Map.prototype.createEffectsSprite = function() {
    this._effectSprite = new Sprite_MapEffect();
    this.addChild(this._effectSprite);
};




function Sprite_MapEffect() {
    this.initialize.apply(this, arguments);
}

Sprite_MapEffect.prototype = Object.create(Sprite_Base.prototype);

Sprite_MapEffect.prototype.constructor = Sprite_MapEffect;


Sprite_MapEffect.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);

    this._effectTime = 0;
    this._effectParams = []; 

    this._effectInterval = this.constructor.effectInterval;
    this._effectInterval_count = 1;
};


Sprite_MapEffect.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);

    this.updateEffect();
};


Sprite_MapEffect.prototype.setEffectTime = function(time) {
	time = Number(time) || 0;
	if (time < 0 && time != -1) time = -1;
	this._effectTime = time;
};

Sprite_MapEffect.prototype.addEffectTime = function(time) {
	time = Number(time) || 0;
	if (this._effectTime + time < 0) this._effectTime = 0;
	else this._effectTime += time;
};


Sprite_MapEffect.prototype.setEffectParams = function(paramList) {
	this._effectParams = paramList;
};

Sprite_MapEffect.prototype.unsetEffectParams = function() {
	this._effectParams = [];
};


Sprite_MapEffect.prototype.updateEffect = function() {
	if (this._effectTime == 0) return this.unsetEffect();

	if (this._effectTime != -1) this._effectTime--;

	if (!this.visible) return this.unsetEffect();

	this._effectInterval_count--;
    if (this._effectInterval_count > 0) return ;
    this._effectInterval_count = this._effectInterval;

    this.reSnap();
    this.reEffect();
};

Sprite_MapEffect.prototype.reSnap = function() {
	var scene = this.parent || SceneManager._scene;
	scene.removeChild(this);
	this.bitmap = SceneManager.snap();
	scene.addChild(this);
};

Sprite_MapEffect.prototype.reEffect = function() {
	this.constructor.makeEffect(this, ...this._effectParams);
};

Sprite_MapEffect.prototype.unsetEffect = function() {
	var scene = this.parent || SceneManager._scene;
	scene.removeChild(this);
};


Sprite_MapEffect.prototype.refresh = function() {
	var scene = this.parent || SceneManager._scene;
	scene.removeChild(this);
	scene.addChild(this);

    this._effectInterval_count = 1; 
};



Sprite_MapEffect.presetParams = {};

Sprite_MapEffect.defaultKey = '';

Sprite_MapEffect.paramNameList = [
	'RANDOMSIZE', 
	'MAXOFFSET', 
	'LENGTH', 
	'SINE_A', 
	'SINE_B', 
	'SINE_C', 
];


Sprite_MapEffect.setPersetParams = function(key, paramList) {
	this.presetParams[key] = paramList;
};

Sprite_MapEffect.setPersetParamsByObject = function(key, paramObject) {
	var names = this.paramNameList;
	var paramList = [];
	for (var idx = 0; idx < names.length; idx++) 
		paramList[idx] = paramObject[names[idx]];
	this.setPersetParams(key, paramList);
};

Sprite_MapEffect.setDefaultKey = function(key) {
	this.defaultKey = key || '';
};

Sprite_MapEffect.setupAllPersetParams = function() {
	var param = MK_Data.param[pluginName];
	var presetParams = param['presetParams'];
	for (var idx = 0; idx < presetParams.length; idx++) {
		var object = presetParams[idx];
		this.setPersetParamsByObject(object['KEY'], object);
	}
	this.setDefaultKey(param['defaultKey']);
};
{ Sprite_MapEffect.setupAllPersetParams(); }


Sprite_MapEffect.effectInterval = 6;
Sprite_MapEffect.defaultEffectTime = 6;

Sprite_MapEffect.setEffect = function(time, paramList) {

	var sprite = SceneManager._scene._effectSprite;
	if (!sprite) return ;

	time = time || this.defaultEffectTime;
	paramList = paramList || [];

	sprite.setEffectParams(paramList);

	sprite.setEffectTime(time);
	sprite.refresh(); 
};

Sprite_MapEffect.setEffectByPreset = function(time, presetKey) {
	presetKey = presetKey || this.defaultKey;
	this.setEffect(time, this.presetParams[presetKey]);
};


(function() {

	var _MK_Game_Interpreter_pluginCommand   = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
	    _MK_Game_Interpreter_pluginCommand.apply(this, arguments);

	    var pluginCode = 'DistortEffect';
	    if (command !== pluginCode) return;

	    var time = args[0] ? Number(args[0]) : 0;

	    switch (args[1]) {
	    	case 'preset':
	    		var key = args[2];
	    		Sprite_MapEffect.setEffectByPreset(time, key);
	    		break;
	    	default:
	    		Sprite_MapEffect.setEffectByPreset(time);
	    		break;
	    }
	};

})();



Sprite_MapEffect.makeEffect = function(sprite, RANDOMSIZE, MAXOFFSET, LENGTH, SINE_A, SINE_B, SINE_C) {	

	if (!sprite || !sprite.bitmap) return ;

	var bitmap = sprite.bitmap;

	var LENGTH = LENGTH || 1;
	var RANDOMSIZE = RANDOMSIZE || 0;

	var MAXOFFSET = MAXOFFSET || 0;

	var SINE_A = SINE_A || 0;
	var SINE_B = SINE_B || 0;
	var SINE_C = SINE_C || 0;

	var newBitmap = new Bitmap(bitmap.width, bitmap.height);
	

	var list = [];
	for (var idx = 0; idx < bitmap.height + LENGTH; idx += LENGTH) {
		var a = Math.max(-MAXOFFSET, list[idx-LENGTH]-RANDOMSIZE);
		var b = Math.min( MAXOFFSET, list[idx-LENGTH]+RANDOMSIZE);
		var random = Math.random() * (b - a) + (a); // Max(-MO, last-RS) ~ Min(MO, last+RS)
		list[idx] = idx == 0 ? Math.random() * RANDOMSIZE * 2 - RANDOMSIZE : random;
    }
    
	for (var idx = 0; idx < bitmap.height; idx++) {

		if (idx % LENGTH != 0) {
			var last = Math.floor(idx / LENGTH) * LENGTH;
			var next = last + LENGTH;
			list[idx] = list[last] + ((idx % LENGTH) / LENGTH) * (list[next] - list[last]);
        }
    }
	
	
    var list_sine = [];
	for (var idx = 0; idx < bitmap.height; idx++) {
		var SINE_A_RANDOM = 0.25
		var sineA = (Math.random() * SINE_A_RANDOM * 2 - SINE_A_RANDOM + 1) * SINE_A;

		var sine = sineA * Math.sin( SINE_B * (idx - SINE_C) );
		list[idx] += sine;
		list_sine[idx] = sine;
    }
	

	for (var idx = 0; idx < bitmap.height; idx++) {
		list[idx] = Math.floor(list[idx]);
    }

    for (var idx = 0; idx < bitmap.height; idx++) {
    	this.tempFunc(bitmap, newBitmap, idx, list[idx]);
    }

    sprite.bitmap = newBitmap;
};

Sprite_MapEffect.tempFunc = function(bitmap, newBitmap, y, a) {

	var width = bitmap.width;

	if (a === 0) {
	}
	else if (a < 0) { // 往左
		a = -a;
		newBitmap.blt(bitmap, a, y, width - a, 1, 0, y, width - a, 1);
		newBitmap.blt(bitmap, width - 1, y, 1, 1, width - a, y, a, 1);
	}
	else if (a > 0) { // 往右
		newBitmap.blt(bitmap, 0, y, width - a, 1, a, y, width - a, 1);
		newBitmap.blt(bitmap, 0, y, 1, 1, 0, y, a, 1);
	}
};



MK_Data.class = MK_Data.class || {};
MK_Data.class['Sprite_MapEffect'] = Sprite_MapEffect;


})();

