//=============================================================================
// MK_FadedOpacity.js
// 渐变不透明度
//=============================================================================
//  author : Mikan 
//  plugin : MK_FadedOpacity.js 渐变不透明度
// version : v0.1.0 2020/03/24 开发中
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/_MikanHako/
//  [GitHub] https://github.com/MikanHako1024/
//    [Blog] NONE
//=============================================================================




/*:
 * @plugindesc 渐变不透明度 <MK_FadedOpacity>
 * @author Mikan 
 * @version v0.1.0 2020/03/24 开发中
 *   
 * 
 * @param ==== 游戏参数配置 ====
 * 
 * @param 
 * @desc 
 * @default 
 * 
 * @param ==== 插件指令配置 ====
 * 
 * @param 
 * @desc 
 * @default 
 * 
 * @param ==== under ====
 * 
 * 
 * 
 * 
 * @help
 * ---- 插件指令 ----
 * 
 *   # 设置事件不透明度渐变
 *   FadeOpacity Event 事件id 不透明度变化目标 变化时间
 *   
 *     ex : 设置事件5 在180帧内 变成全透明
 *          FadeOpacity Event 5 0 180
 *     ex : 设置事件5 在180帧内 变成全显示 (全显示为255)
 *          FadeOpacity Event 5 255 180
 *     ex : 设置事件5 立即变成全透明 (设置时间为0)
 *          FadeOpacity Event 5 0 0
 * 
 *   # 设置角色不透明度渐变
 *   FadeOpacity Player 不透明度变化目标 变化时间
 * 
 *   # 设置事件不透明度渐变 完成时触发开关
 *   FadeOpacity Event 事件id 不透明度变化目标 变化时间 开关id 开关状态
 *   
 *     ex : 设置事件5 在180帧内 变成全透明 结束后设置开关7 为on
 *          FadeOpacity Event 5 0 180 7 on
 * 
 *   # 设置角色不透明度渐变
 *   FadeOpacity Player 不透明度变化目标 变化时间
 * 
 * 
 * ---- 用语说明 ----
 * 
 * TODO
 * 
 * 
 * 
 * ---- 参数描述 ----
 * 
 * TODO
 * 
 * 
 * 
 * ---- 标签设置 ----
 * 
 * TODO
 * 
 * 
 * 
 * ---- 使用方法 ----
 * 
 * 提供基本的使角色、事件、交通工具透明度渐变的功能，
 * 可以让其在规定帧数内透明度均匀变化至某个值，要注意的是透明度范围0-255。
 * 当然也可以设置变化为立即变化。
 * 
 * 另外在切换地图、存读档时，会保留透明度变化状态，
 * 即回到地图、读档时，会恢复之前的透明度，或是继续尚未完成的渐变。
 * 
 * 插件允许在渐变完成时改变一个开关的状态，
 * 可以借此切换事件的事件页，在事件页中实现需要的控制。
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
 * 如果需要使用本插件，只需要在GitHub给本插件一个Star或Watching即可。
 * 仓库：https://github.com/MikanHako1024/  ___TBD___
 * 
 * 这之后，可以对本插件随意修改使用，或二次开发。（但是，请保留页眉的著作权表示部分。）
 * 
 * 使用形式（自由游戏、商业游戏、R-18作品等）没有限制，请随意使用。
 * 
 * 由于使用本插件而发生的问题，作者不负任何责任。有必要时请注意备份。
 * 
 * 如果您有任何要求，您可能需要本插件的版本升级。
 * 根据版本升级，本插件的规格有可能变更。请谅解。
 * 
 * 如果有什么意见或建议可以联系我，欢迎。
 * 
 */




var MK_Plugins = MK_Plugins || {};
MK_Plugins.paramGet = MK_Plugins.paramGet || {};
MK_Plugins.param = MK_Plugins.param || {};
MK_Plugins.class = MK_Plugins.class || {};
MK_Plugins.datas = MK_Plugins.datas || {};



//-----------------------------------------------------------------------------
// FadedOpacityData

function FadedOpacityData() {
	this.initialize.apply(this, arguments);
}

FadedOpacityData.prototype.constructor = FadedOpacityData;

FadedOpacityData.prototype.initialize = function() {
	this._fade = {};
	this._callback = {};
};

FadedOpacityData.prototype.setFadeValue = function(flag, fromOp, toOp, time) {
	this._fade[flag] = this._fade[flag] || {};
	this._fade[flag].nowOpacity  = fromOp;
	this._fade[flag].fromOpacity = fromOp;
	this._fade[flag].toOpacity   = toOp;
	this._fade[flag].fadeTime    = time;
};

FadedOpacityData.prototype.getFadeValue = function(flag) {
	return this._fade[flag];
};

FadedOpacityData.prototype.setNowOpacity = function(flag, value) {
	var data = this._fade[flag];
	if (!!data) {
		data.nowOpacity = value;
	}
};

FadedOpacityData.prototype.setFixedOpacity = function(flag) {
	var data = this._fade[flag];
	if (!!data) {
		data.fadeTime = 0;
	}
};

FadedOpacityData.prototype.setCallbackValue = function(flag, id, value) {
	this._callback[flag] = this._callback[flag] || {};
	this._callback[flag].switchId    = id;
	this._callback[flag].switchValue = value;
};

FadedOpacityData.prototype.getCallbackValue = function(flag) {
	return this._callback[flag];
};

FadedOpacityData.prototype.unsetCallback = function(flag) {
	delete this._callback[flag];
};

FadedOpacityData.prototype.makeCallbackFunction = function(flag) {
	var data = this._callback[flag];
	if (!!data) {
		return function() {
			$gameSwitches.setValue(data.switchId, data.switchValue);
		};
	}
	else {
		return function() {};
	}
};

MK_Plugins.class['FadedOpacityData'] = FadedOpacityData;

var fadedOpacityData;


(function() {


//-----------------------------------------------------------------------------
// DataManager  save and load data

var pluginName = 'MK_FadedOpacity';

var _MK_DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	_MK_DataManager_createGameObjects.apply(this, arguments);
	fadedOpacityData = new FadedOpacityData();
};

var _MK_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
	var contents = _MK_DataManager_makeSaveContents.apply(this, arguments);
	contents.fadedOpacityData = fadedOpacityData || new FadedOpacityData();
	return contents;
};

var _MK_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	_MK_DataManager_extractSaveContents.apply(this, arguments);
	fadedOpacityData = contents.fadedOpacityData || new FadedOpacityData();
};



//-----------------------------------------------------------------------------
// Game_Character  updateFadeOpacity

var _MK_Game_Character_update   = Game_Character.prototype.update;
Game_Character.prototype.update = function() {
	_MK_Game_Character_update.apply(this, arguments);
	this.updateFadeOpacity();
};

Game_Character.prototype.updateFadeOpacity = function() {
	if (this.needFadeOpacity()) {
		var flag = this.fadeOpacityFlag();
		var data = fadedOpacityData.getFadeValue(flag);

		var opacity = this.opacity();
		if (data.fadeTime <= 0) opacity = data.toOpacity;
		else opacity += (data.toOpacity - data.fromOpacity) / data.fadeTime;
		if (!(Math.min(data.fromOpacity, data.toOpacity) <= opacity
				 && opacity <= Math.max(data.fromOpacity, data.toOpacity))) {
			opacity = data.toOpacity;
			fadedOpacityData.setFixedOpacity(flag);
			var callback = fadedOpacityData.makeCallbackFunction(flag);
			!!callback && callback.call(this);
		}
		this.setOpacity(opacity);
		fadedOpacityData.setNowOpacity(flag, opacity);
	}
};

Game_Character.prototype.fadeOpacityFlag = function() {
	if (this.constructor === Game_Event) {
		return [this._mapId, this._eventId].toString();
	}
	else if (this.constructor === Game_Player) {
		return 'player';
	}
	else if (this.constructor === Game_Vehicle) {
		return this._type;
	}
};

Game_Character.prototype.needFadeOpacity = function() {
	var flag = this.fadeOpacityFlag();
	var data = fadedOpacityData.getFadeValue(flag);
	return !!data && this.opacity() !== data.toOpacity;
};

Game_Character.prototype.startFadeOpacity = function(toOpacity, fadeTime) {
	var fromOpacity = this.opacity();
	toOpacity = Number(toOpacity) || 0;
	fadeTime  = Number(fadeTime)  || 0;
	var flag = this.fadeOpacityFlag();
	!!flag && fadedOpacityData.setFadeValue(flag, fromOpacity, toOpacity, fadeTime);
};

Game_Character.prototype.setFadeOpacityCallBack = function(switchId, switchValue) {
	switchId    = Number(switchId) || 0;
	switchValue = /on/i.test(switchValue);
	var flag = this.fadeOpacityFlag();
	!!flag && fadedOpacityData.setCallbackValue(flag, switchId, switchValue);
};

Game_Character.prototype.initFadeOpacity = function() {
	if (!fadedOpacityData) return;
	var flag = this.fadeOpacityFlag();
	var data = fadedOpacityData.getFadeValue(flag);
	!!data && this.setOpacity(data.nowOpacity);
};

var _MK_Game_Event_initialize   = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function() {
	_MK_Game_Event_initialize.apply(this, arguments);
	this.initFadeOpacity();
};
var _MK_Game_Player_initialize   = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function() {
	_MK_Game_Player_initialize.apply(this, arguments);
	this.initFadeOpacity();
};
var _MK_Game_Vehicle_initialize   = Game_Vehicle.prototype.initialize;
Game_Vehicle.prototype.initialize = function() {
	_MK_Game_Vehicle_initialize.apply(this, arguments);
	this.initFadeOpacity();
};


//-----------------------------------------------------------------------------
// plugin commands

var _MK_Game_Interpreter_pluginCommand   = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	_MK_Game_Interpreter_pluginCommand.apply(this, arguments);

	if (/^FadeOpacity$/i.test(command)) {
		if (/^Event$/i.test(args[0])) {
			var event = $gameMap.event(Number(args[1]) || 0);
			!!event && event.startFadeOpacity(args[2], args[3]);
			!!event && event.setFadeOpacityCallBack(args[4], args[5]);
		}
		else if (/^Player$/i.test(args[0])) {
			!!$gamePlayer && $gamePlayer.startFadeOpacity(args[1], args[2]);
			!!$gamePlayer && $gamePlayer.setFadeOpacityCallBack(args[3], args[4]);
		}
		else if (/^Vehicle$/i.test(args[0])) {
			var vehicle = $gameMap.vehicle(String(args[1]).toLowerCase());
			!!vehicle && vehicle.startFadeOpacity(args[2], args[3]);
			!!vehicle && vehicle.setFadeOpacityCallBack(args[4], args[5]);
		}
	}
};


})();



