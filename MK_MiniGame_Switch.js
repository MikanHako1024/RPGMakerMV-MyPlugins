//=============================================================================
// MK_MiniGame_Switch.js
// 
//=============================================================================
//  author : Mikan 
//  plugin : MK_MiniGame_Switch.js
// version : v0.1.4 2020/03/29 增加了场景的淡入淡出
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/_MikanHako/
//  [GitHub] https://github.com/MikanHako1024/
//    [Blog] NONE
//=============================================================================




/*:
 * @plugindesc 开关小游戏 <MK_MiniGame_Switch>
 * @author Mikan 
 * @version v0.1.4 2020/03/29 增加了场景的淡入淡出
 * v0.1.03 2019/12/16 添加了自动检查模式
 * v0.1.02 2019/12/16 添加音效
 * v0.1.01 2019/12/15 添加了鼠标点击功能
 * v0.1.00 2019/12/11 最初的版本
 * 
 * 
 * @param 游戏配置
 * 
 * 
 * @param 图片配置
 * @parent 游戏配置
 * 
 * @param slot
 * @parent 图片配置
 * @type file
 * @dir img/pictures/
 * @desc 槽位图片
 * @default 
 * 
 * @param slotSelected
 * @parent 图片配置
 * @type file
 * @dir img/pictures/
 * @desc 选中槽位图片
 * @default 
 * 
 * @param switch
 * @parent 图片配置
 * @type file
 * @dir img/pictures/
 * @desc 按钮图片
 * @default 
 * 
 * @param BackGround
 * @parent 图片配置
 * @type file
 * @dir img/pictures/
 * @desc 背景图
 * @default 
 * 
 * @param exit
 * @parent 图片配置
 * @type file
 * @dir img/pictures/
 * @desc 退出标志图片
 * @default 
 * 
 * 
 * @param 位置配置
 * @parent 游戏配置
 * 
 * @param rowNum
 * @parent 位置配置
 * @type number
 * @desc 每个槽的槽位数
 * @default 4
 * 
 * @param colNum
 * @parent 位置配置
 * @type number
 * @desc 槽个数
 * @default 5
 * 
 * @param rowLoop
 * @parent 位置配置
 * @type number
 * @desc 行间隔
 * @default 80
 * 
 * @param colLoop
 * @parent 位置配置
 * @type number
 * @desc 列间隔
 * @default 90
 * 
 * @param rowStartOffset
 * @parent 位置配置
 * @type number
 * @desc 纵向偏移距离
 * @default 0
 * 
 * @param colStartOffset
 * @parent 位置配置
 * @type number
 * @desc 横向偏移距离
 * @default 0
 * 
 * @param exit_x
 * @parent 位置配置
 * @type number
 * @desc 退出图片横坐标
 * @default 
 * 
 * @param exit_y
 * @parent 位置配置
 * @type number
 * @desc 退出图片纵坐标
 * @default 
 * 
 * 
 * @param 交互配置
 * @parent 游戏配置
 * 
 * @param defaultVarStartNo
 * @parent 交互配置
 * @type number
 * @desc 默认变量组开头
 * @default 1
 * @min 1
 * 
 * @param defaultSwitchNo
 * @parent 交互配置
 * @type number
 * @desc 默认开关编号
 * @default 1
 * @min 1
 * 
 * 
 * @param 音效配置
 * @parent 游戏配置
 * 
 * @param moveSound
 * @parent 音效配置
 * @type file
 * @dir audio/se
 * @desc 移动时的音效
 * @default 
 * 
 * @param openSound
 * @parent 音效配置
 * @type file
 * @dir audio/se
 * @desc 正确时的音效
 * @default 
 * 
 * @param soundVolume
 * @parent 音效配置
 * @type number
 * @desc 默认音量
 * @default 90
 * @min 0
 * @max 100
 * 
 * @param soundPitch
 * @parent 音效配置
 * @type number
 * @desc 默认音调
 * @default 100
 * @min 0
 * @max 100
 * 
 * 
 * @param 插件指令配置
 * 
 * @param ==== under ====
 * 
 * 
 * 
 * 
 * @help
 * ---- 插件指令 ----
 * 
 *   # 呼叫开关小游戏.
 *   MK_MiniGame_Switch call 变量起始 列数 行数
 * 
 *       ## 呼叫开关小游戏 5行4列 使用变量1-5(只需要开头的1)
 *       MK_MiniGame_Switch call 1 5 4
 * 
 *   # 快速检查一组变量是否能匹配答案.
 *   MK_MiniGame_Switch check 变量起始 列数 结果开关号 匹配答案(0开始, 空格隔开)
 * 
 *       ## 检查结果 小游戏5行4列 使用变量1-5(只需要开头的1) 用开关1接收结果 正确结果 0 1 2 3 0
 *       MK_MiniGame_Switch check 1 5 1 0 1 2 3 0
 * 
 *   # 呼叫开关小游戏 自动检查模式 : 当正确时直接结束.
 *   MK_MiniGame_Switch call_autoCheck 变量起始 列数 行数 结果开关号 匹配答案(0开始, 空格隔开)
 * 
 *       ## 呼叫开关小游戏 自动检查模式 5行4列 使用变量1-5(只需要开头的1) 用开关1接收结果 正确结果 0 1 2 3 0
 *       MK_MiniGame_Switch call_autoCheck 1 5 4 1 0 1 2 3 0
 *   
 * 
 *   # 上述呼叫小游戏指令(call,call_autoCheck)之后可加的附加选项，设置淡入淡出
 *   上述的呼叫命令 -fadeIn 淡入颜色 淡入时间
 *   上述的呼叫命令 -fadeOut 淡出颜色 淡出时间
 *       颜色只支持 white 和 black
 * 
 *       ## XX呼叫，不淡入，60帧的黑色淡出
 *       MK_MiniGame_Switch call 1 5 4 -fadeOut black 60
 * 
 *       ## XX呼叫，120帧的白色淡入，60帧的黑色淡出
 *       MK_MiniGame_Switch call 1 5 4 -fadeIn white 120 -fadeOut black 60
 * 
 *   # 附加选项，设置游戏期间的执行的事件
 *   上述的呼叫命令 -event 事件id
 *       事件为当前地图的某个事件
 *       各个时机对应一个独立开关 : 
 *           开始时淡入完成后 : 独立开关A
 *           进行时每次移动后 : 独立开关B
 *           结果正确的结束，淡出开始前 : 独立开关C
 *           结果错误的结束，淡出开始前 : 独立开关D
 *       
 *       ## XX呼叫，指定事件7
 *       MK_MiniGame_Switch call 1 5 4 -event 7
 *   
 * 
 *   注意 : 附加选项的 -xxx 应保留其原有写法
 *          需要选项时加上 -xxx 及其参数，不需要时可以不写
 *          各选项的顺序任意
 * 
 *   注意 : 空格只能是一个空格
 *   
 * 
 * ---- 用语说明 ----
 * 
 * NONE
 * 
 * 
 * 
 * ---- 参数描述 ----
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
 * ◆插件指令：MK_MiniGame_Switch call 1 5 4
 * ◆插件指令：MK_MiniGame_Switch check 1 5 1 0 1 2 3 0
 * ◆如果：#0001 为 ON
 *   ◆文本：无, 窗口, 底部
 *   ：　　：远处传来一声响声
 *   ◆
 * ：否则
 *   ◆文本：无, 窗口, 底部
 *   ：　　：什么都没发生
 *   ◆
 * ：结束
 * 
 * or
 * 
 * ◆插件指令：MK_MiniGame_Switch call_autoCheck 1 5 4 1 0 1 2 3 0
 * ◆如果：#0001 为 ON
 *   ◆文本：无, 窗口, 底部
 *   ：　　：远处传来一声响声
 *   ◆
 * ：否则
 *   ◆文本：无, 窗口, 底部
 *   ：　　：什么都没发生
 *   ◆
 * ：结束
 * 
 * 
 * TODO : other
 * 
 * 
 * ---- 开发方法 ----
 * 
 * NONE
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




var MK_Data = MK_Data || {};
MK_Data.paramGet = MK_Data.paramGet || {};
MK_Data.param = MK_Data.param || {};
MK_Data.class = MK_Data.class || {};

MK_Data.getPluginParam = MK_Data.getPluginParam ||
function (pluginName) {
	var param = PluginManager.parameters(pluginName);
	if (!param || JSON.stringify(param) === '{}') {
		var list = $plugins.filter(function (i) {
			return i.description.contains('<' + pluginName + '>');
		});
		if (list.length > 0) {
			var realPluginName = list[0].name;
			if (realPluginName && realPluginName !== pluginName)
				return PluginManager.parameters(realPluginName);
			else return {};
		}
		else return {};
	}
	return param;
};


(function() {


{
	var pluginName = 'MK_MiniGame_Switch';
	MK_Data.paramGet[pluginName] = MK_Data.getPluginParam(pluginName);
	MK_Data.param[pluginName] = {};

	var paramGet = MK_Data.paramGet[pluginName];
	var param = MK_Data.param[pluginName];

	param['slot']           	 = String(paramGet['slot']              	 || '' );
	param['slotSelected']   	 = String(paramGet['slotSelected']         	 || '' );
	param['switch']         	 = String(paramGet['switch']            	 || '' );
	param['BackGround']     	 = String(paramGet['BackGround']         	 || '' );
	param['exit']           	 = String(paramGet['exit']               	 || '' );
	
	param['rowNum']         	 = Number(paramGet['rowNum']            	 || 4  );
	param['colNum']         	 = Number(paramGet['colNum']            	 || 5  );
	param['rowLoop']        	 = Number(paramGet['rowLoop']           	 || 80 );
	param['colLoop']        	 = Number(paramGet['colLoop']           	 || 90 );
	param['rowStartOffset'] 	 = Number(paramGet['rowStartOffset']     	 || 0  );
	param['colStartOffset'] 	 = Number(paramGet['colStartOffset']    	 || 0  );
	param['exit_x']         	 = Number(paramGet['exit_x']            	 || 0  );
	param['exit_y']         	 = Number(paramGet['exit_y']            	 || 0  );

	param['defaultVarStartNo'] 	 = Number(paramGet['defaultVarStartNo'] 	 || 1  );
	param['defaultSwitchNo'] 	 = Number(paramGet['defaultSwitchNo']   	 || 1  );

	param['moveSound']         	 = String(paramGet['moveSound']         	 || '' );
	param['openSound']         	 = String(paramGet['openSound']         	 || '' );
	param['soundVolume']    	 = Number(paramGet['soundVolume']       	 || 90 );
	param['soundPitch']     	 = Number(paramGet['soundPitch']        	 || 100);
}




//-----------------------------------------------------------------------------
// Scene_MiniGame_Switch
// 开关小游戏场景

function Scene_MiniGame_Switch() {
	this.initialize.apply(this, arguments);
}

Scene_MiniGame_Switch.prototype = Object.create(Scene_Base.prototype);

Scene_MiniGame_Switch.prototype.constructor = Scene_MiniGame_Switch;


Scene_MiniGame_Switch.setNextParam = function(checkMode, inpVarS, inpCol, inpRow, toVar, list) {
	if (checkMode) {
		this._nextParam_checkMode = checkMode;
		this._nextParam_inpVarS   = inpVarS  ;
		this._nextParam_inpCol    = inpCol   ;
		this._nextParam_inpRow    = inpRow   ;
		this._nextParam_inpToVar  = toVar    ;
		this._nextParam_inpList   = list     ;
	}
	else {
		this._nextParam_checkMode = checkMode;
		this._nextParam_inpVarS   = inpVarS  ;
		this._nextParam_inpCol    = inpCol   ;
		this._nextParam_inpRow    = inpRow   ;
	}
}

Scene_MiniGame_Switch.unsetNextParam = function() {
	this._nextParam_checkMode = null;
	this._nextParam_inpVarS   = null;
	this._nextParam_inpCol    = null;
	this._nextParam_inpRow    = null;
	this._nextParam_inpToVar  = null;
	this._nextParam_inpList   = null;
}

Scene_MiniGame_Switch.setNextFadeParam = function(fadeIn, fadeInTime, fadeOut, fadeOutTime) {
	this._nextParam_fadeIn      = fadeIn;
	this._nextParam_fadeInTime  = fadeInTime;
	this._nextParam_fadeOut     = fadeOut;
	this._nextParam_fadeOutTime = fadeOutTime;
}

Scene_MiniGame_Switch.unsetNextFadeParam = function() {
	this._nextParam_fadeIn      = null;
	this._nextParam_fadeInTime  = null;
	this._nextParam_fadeOut     = null;
	this._nextParam_fadeOutTime = null;
}

Scene_MiniGame_Switch.setNextEvent = function(eventId) {
	this._nextParam_eventId     = eventId;
}

Scene_MiniGame_Switch.unsetNextEvent = function() {
	this._nextParam_eventId     = null;
}




// ------------------------
// 初始化
{
	Scene_MiniGame_Switch.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this);

		this._handlers = [];
		this.initHandleLs();

		this._moveSound = null;
		this._openSound = null;
		this.initSound();

		this._variableList = [];

		this._checkMode = false;
		this._ansList = [];

		this.getInitData();

		var rect = this.getAllSlotRect();
		this._colStart = rect.x; // 槽位的左边界
		this._rowStart = rect.y; // 槽位的上边界
		this._colEnd   = rect.x + rect.width ; // 槽位的右边界
		this._rowEnd   = rect.y + rect.height; // 槽位的下边界

		this._cursorCol = 0;

		this._switchIndexList = [];
		this.initSwitchIndex();

		this._mainSprite = null;
		this._bgSprite = null;
		this._slotSpriteList = [];
		this._switchSpriteList = [];

		this._exitSprite = null;

		this.createAllSprite();

		this._interpreter = new Game_Interpreter();

		if (this._interpreterEventId > 0) {
			this._interpreterEvent = $gameMap.event(this._interpreterEventId);
		}

		this.createWindowLayer();
		this.createMessageWindow();

		this.refreshAllSprite();
	};

	Scene_MiniGame_Switch.prototype.createMessageWindow = function() {
	    this._messageWindow = new Window_Message();
	    this.addWindow(this._messageWindow);
	    this._messageWindow.subWindows().forEach(function(window) {
	        this.addWindow(window);
	    }, this);
	};


	Scene_MiniGame_Switch.prototype.getInitData = function() {

		var inpVarS   = this.constructor._nextParam_inpVarS  ;
		var inpCol    = this.constructor._nextParam_inpCol   ;
		var inpRow    = this.constructor._nextParam_inpRow   ;

		this._slotRowNum = inpRow || this.constructor.defaultRowNum;
		this._slotColNum = inpCol || this.constructor.defaultColNum;

		this._rowLoop  = this.constructor.rowLoop;
		this._colLoop  = this.constructor.colLoop;
		
		this._rowStartOffset = this.constructor.rowStartOffset || 0;
		this._colStartOffset = this.constructor.colStartOffset || 0;


		var checkMode = this.constructor._nextParam_checkMode;
		this._checkMode = !!checkMode;

		if (checkMode) {
			var inpToVar  = this.constructor._nextParam_inpToVar ;
			var inpList   = this.constructor._nextParam_inpList  ;

			this._toVar   = inpToVar || this.constructor.defaultSwitchNo;
			this._ansList = this.initAnsList(inpList);
		}


		this._fadeIn      = this.constructor._nextParam_fadeIn      || 0;
		this._fadeInTime  = this.constructor._nextParam_fadeInTime  || 0;
		this._fadeOut     = this.constructor._nextParam_fadeOut     || 0;
		this._fadeOutTime = this.constructor._nextParam_fadeOutTime || 0;


		this._interpreterEventId = this.constructor._nextParam_eventId || 0;


		this.initVariableList(inpVarS);
	};

	Scene_MiniGame_Switch.prototype.initAnsList = function(inpList) {
		if (!Array.isArray(inpList)) inpList = [];
		for (var col = 0; col < this._slotColNum; col++) {
			if (typeof inpList[col] !== 'number') {
				inpList[col] = String(inpList[col]) || 0;
			}
			else {
				if (inpList[col] < 0) inpList[col] = 0;
				if (inpList[col] >= this._slotColNum) inpList[col] = this._slotColNum - 1;
			}
		}
		return inpList;
	};


	Scene_MiniGame_Switch.prototype.createAllSprite = function() {
		this._mainSprite = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
		this._mainSprite.x = 0;
		this._mainSprite.y = 0;
		this.addChild(this._mainSprite);

		var centerX = Math.floor(Graphics.boxWidth  / 2);
		var centerY = Math.floor(Graphics.boxHeight / 2);

		var sprite = new Sprite(this.constructor.backgroundBitmap);
		sprite.anchor = new Point(0.5, 0.5);
		sprite.x = centerX;
		sprite.y = centerY;
		this._bgSprite = sprite;
		this._mainSprite.addChild(this._bgSprite);

		this._slotSpriteList = [];
		for (var col = 0; col < this._slotColNum; col++) {
			var sprite = new Sprite(this.constructor.slotBitmap);
			sprite.anchor = new Point(0.5, 0.5);
			this._slotSpriteList[col] = sprite;
			this._mainSprite.addChild(this._slotSpriteList[col]);
		}

		this._switchSpriteList = [];
		for (var col = 0; col < this._slotColNum; col++) {
			var sprite = new Sprite(this.constructor.switchBitmap);
			sprite.anchor = new Point(0.5, 0.5);
			this._switchSpriteList[col] = sprite;
			this._mainSprite.addChild(this._switchSpriteList[col]);
		}

		var sprite = new Sprite(this.constructor.exitBitmap);
		sprite.x = this.constructor.exit_x;
		sprite.y = this.constructor.exit_y;
		this._exitSprite = sprite;
		this._mainSprite.addChild(this._exitSprite);
	};
}




// ------------------------
// 淡入淡出
{
	Scene_MiniGame_Switch.prototype.start = function() {
		Scene_Base.prototype.start.apply(this, arguments);
		     if (this._fadeIn  == 1) this.startFadeIn(this._fadeInTime , true );
		else if (this._fadeIn  == 2) this.startFadeIn(this._fadeInTime , false);

		this.executeEvent('A');
	};

	Scene_MiniGame_Switch.prototype.stop = function() {
		     if (this._fadeOut == 1) this.startFadeOut(this._fadeOutTime, true );
		else if (this._fadeOut == 2) this.startFadeOut(this._fadeOutTime, false);
		Scene_Base.prototype.stop.apply(this, arguments);
	};
}




// ------------------------
// 触发事件
{
	Scene_MiniGame_Switch.prototype.executeEvent = function(selfSwitch) {
		this.setEventSelfSwitch(selfSwitch, true);
		this.setupInterpreter();
		this.setEventSelfSwitch(selfSwitch, false);
	};

	Scene_MiniGame_Switch.prototype.setEventSelfSwitch = function(selfSwitch, value) {
		var event = this._interpreterEvent;
		if (!event) return ;
		var key = [event._mapId, event._eventId, selfSwitch].toString();
		$gameSelfSwitches.setValue(key, value);
		event.refresh(); 
	};

	Scene_MiniGame_Switch.prototype.setupInterpreter = function() {
		var event = this._interpreterEvent;
		if (!event) return ;
		event._pageIndex >= 0 && this._interpreter.setup(event.list(), event.eventId());
	};
}




// ------------------------
// 游戏画面
{
	Scene_MiniGame_Switch.prototype.getAllSlotRect = function() {
		var width  = (this._slotColNum - 1) * this._colLoop;
		var height = (this._slotRowNum - 1) * this._rowLoop;
		var x = Math.floor((Graphics.boxWidth  - width ) / 2);
		var y = Math.floor((Graphics.boxHeight - height) / 2);
		return new Rectangle(x, y, width, height);
	};

	Scene_MiniGame_Switch.prototype.setSpritePosition = function(sprite, point) {
		if (sprite && point) {
			sprite.x = point.x;
			sprite.y = point.y;
		}
	};

	Scene_MiniGame_Switch.prototype.getSlotPosition = function(col) {
		return new Point(
			Math.floor(this._colStartOffset + this._colStart + this._colLoop * col), 
			Math.floor(this._rowStartOffset + (this._rowStart + this._rowEnd) / 2), 
		);
	};

	Scene_MiniGame_Switch.prototype.refreshSlotPosition = function() {

		for (var col = 0; col < this._slotColNum; col++) {
			this.setSpritePosition(
				this._slotSpriteList[col], 
				this.getSlotPosition(col), 
			);
		}
	};

	Scene_MiniGame_Switch.prototype.refreshSlotBitmap = function() {

		var normal = this.constructor.slotBitmap;
		var select = this.constructor.slotSelBitmap; 
		for (var col = 0; col < this._slotColNum; col++) {
			this._slotSpriteList[col].bitmap = 
				this._cursorCol == col ? select : normal;
		}
	};

	Scene_MiniGame_Switch.prototype.refreshSlot = function() {
		this.refreshSlotPosition();
		this.refreshSlotBitmap();
	};


	Scene_MiniGame_Switch.prototype.getSwitchPosition = function(col, row) {
		return new Point(
			Math.floor(this._colStartOffset + this._colStart + this._colLoop * col), 
			Math.floor(this._rowStartOffset + this._rowStart + this._rowLoop * row), 
		);
	};

	Scene_MiniGame_Switch.prototype.refreshSwitchPosition = function() {

		for (var col = 0; col < this._slotColNum; col++) {
			this.setSpritePosition(
				this._switchSpriteList[col], 
				this.getSwitchPosition(col, this._switchIndexList[col]), 
			);
		}
	};

	Scene_MiniGame_Switch.prototype.refreshSwitch = function() {
		this.refreshSwitchPosition();
	};

	Scene_MiniGame_Switch.prototype.refreshAllSprite = function() {
		this.refreshSlot();
		this.refreshSwitch();
	};
}




// ------------------------
// 参数配置
{
	var pluginName = 'MK_MiniGame_Switch';
	var param = MK_Data.param[pluginName];

	Scene_MiniGame_Switch.slotPictureName   = param['slot'];
	Scene_MiniGame_Switch.slotSelectedName  = param['slotSelected'];
	Scene_MiniGame_Switch.switchPictureName = param['switch'];
	Scene_MiniGame_Switch.backgroundName    = param['BackGround'];
	Scene_MiniGame_Switch.exitPictureName   = param['exit'];

	Scene_MiniGame_Switch.slotBitmap        = ImageManager.loadPicture(Scene_MiniGame_Switch.slotPictureName  );
	Scene_MiniGame_Switch.slotSelBitmap     = ImageManager.loadPicture(Scene_MiniGame_Switch.slotSelectedName )
												|| Scene_MiniGame_Switch.slotBitmap;
	Scene_MiniGame_Switch.switchBitmap      = ImageManager.loadPicture(Scene_MiniGame_Switch.switchPictureName);
	Scene_MiniGame_Switch.backgroundBitmap  = ImageManager.loadPicture(Scene_MiniGame_Switch.backgroundName   );
	Scene_MiniGame_Switch.exitBitmap        = ImageManager.loadPicture(Scene_MiniGame_Switch.exitPictureName  );

	Scene_MiniGame_Switch.defaultRowNum     = param['rowNum'];
	Scene_MiniGame_Switch.defaultColNum     = param['colNum'];
	Scene_MiniGame_Switch.rowLoop           = param['rowLoop'];
	Scene_MiniGame_Switch.colLoop           = param['colLoop'];
	Scene_MiniGame_Switch.rowStartOffset    = param['rowStartOffset'];
	Scene_MiniGame_Switch.colStartOffset    = param['colStartOffset'];
	Scene_MiniGame_Switch.exit_x            = param['exit_x'];
	Scene_MiniGame_Switch.exit_y            = param['exit_y'];

	Scene_MiniGame_Switch.defaultVarStart   = param['defaultVarStartNo'];
	Scene_MiniGame_Switch.defaultSwitchNo   = param['defaultSwitchNo'];

	Scene_MiniGame_Switch.moveSound         = param['moveSound'];
	Scene_MiniGame_Switch.openSound         = param['openSound'];
	Scene_MiniGame_Switch.soundVolume       = param['soundVolume'];
	Scene_MiniGame_Switch.soundPitch        = param['soundPitch'];
}




// ------------------------
// 游戏帧
{
	Scene_MiniGame_Switch.prototype.update = function() {
	    Scene_Base.prototype.update.call(this);

	    if (!this.isPauseInterpreter()) {
			this._interpreter.update();
		}
		this.checkExitScene();

		this.allowHandling() && this.processHandling();
	};

	Scene_MiniGame_Switch.prototype.allowHandling = function() {
		return this._active
			 && this._fadeDuration <= 0
			 && !$gameMessage.isBusy()
			 && this._messageWindow._openness <= 0
			 && !this._interpreter.isRunning();
	};

	Scene_MiniGame_Switch.prototype.isPauseInterpreter = function() {
		return this._fadeDuration > 0;
	};
}




// ------------------------
// 数据传输
{
	Scene_MiniGame_Switch.prototype.initVariableList = function(s) {
		this._variableList = [];
		s = s || this.constructor.defaultVarStart;
		for (var col = 0; col < this._slotColNum; col++) {
			this._variableList[col] = s + col;
		}
	};

	Scene_MiniGame_Switch.prototype.initSwitchIndex = function() {
		this._switchIndexList = [];
		for (var col = 0; col < this._slotColNum; col++) {
			this._switchIndexList[col] = 0;
		}

		this.readVariable();
	};

	Scene_MiniGame_Switch.prototype.readVariable = function() {

		this._switchIndexList = [];
		for (var col = 0; col < this._slotColNum; col++) {
			var row = $gameVariables.value(this._variableList[col]);
			if (row < 0 || row >= this._slotRowNum) row = 0;
			this._switchIndexList[col] = row;
		}
	};

	Scene_MiniGame_Switch.prototype.writeVariable = function() {

		for (var col = 0; col < this._slotColNum; col++) {
			$gameVariables.setValue(this._variableList[col], this._switchIndexList[col]);
		}
	};
}




// ------------------------
// 游戏内容控制
{
	Scene_MiniGame_Switch.prototype.moveExit = function(flag) {
		this.writeVariable();

		this.checkOpen() ? this.executeEvent('C') : this.executeEvent('D');

		this.setExitFlag();
	};

	Scene_MiniGame_Switch.prototype.setExitFlag = function() {
		this._exitFlag = true;
	};

	Scene_MiniGame_Switch.prototype.checkExitScene = function() {
		if (!this._exiting && this._exitFlag && !this._interpreter.isRunning()) {
			this.popScene();
			this._exitFlag = false;
			this._exiting = true;
		}
	};


	Scene_MiniGame_Switch.prototype.moveUp = function() {
		var row = this._switchIndexList[this._cursorCol];
		var changed = false;
		if (row - 1 >= 0) {
			row--;
			changed = true;
		}
		else {
			row = 0;
			changed = false;
		}
		this._switchIndexList[this._cursorCol] = row;
		this.refreshMove(changed);
	};
	Scene_MiniGame_Switch.prototype.moveDown = function() {
		var row = this._switchIndexList[this._cursorCol];
		var changed = false;
		if (row + 1 <= this._slotRowNum - 1) {
			row++;
			changed = true;
		}
		else {
			row = this._slotRowNum - 1;
			changed = false;
		}
		this._switchIndexList[this._cursorCol] = row;
		this.refreshMove(changed);
	};
	Scene_MiniGame_Switch.prototype.moveLeft = function() {
		var col = this._cursorCol;
		var changed = false;
		if (col - 1 > 0) {
			col--;
			changed = true;
		}
		else {
			col = 0;
			changed = false;
		}
		this._cursorCol = col;
		this.refreshMove(changed);
	};
	Scene_MiniGame_Switch.prototype.moveRight = function() {
		var col = this._cursorCol;
		var changed = false;
		if (col + 1 <= this._slotColNum - 1) {
			col++;
			changed = true;
		}
		else {
			col = this._slotColNum - 1;
			changed = false;
		}
		this._cursorCol = col;
		this.refreshMove(changed);
	};


	Scene_MiniGame_Switch.prototype.hitTest = function(x, y) {
		var swb = this.constructor.switchBitmap;
		if (!swb) return [-1, -1];

		var halfW = Math.floor(swb.width  / 2);
		var halfH = Math.floor(swb.height / 2);

		for (var col = 0; col < this._slotColNum; col++) {
			var midX = this.getSwitchPosition(col, 0).x;
			if (midX - halfW <= x && x <= midX + halfW) {

				for (var row = 0; row < this._slotRowNum; row++) {
					var midY = this.getSwitchPosition(0, row).y;
					if (midY - halfH <= y && y <= midY + halfH) {

						return [col, row];
						
					}
				}

			}
		}
		
		return [-1, -1];
	};
	Scene_MiniGame_Switch.prototype.moveTo = function(col, row) {
		if (col < 0) col = 0;
		if (col >= this._slotColNum) col = this._slotColNum - 1;
		if (row < 0) row = 0;
		if (row >= this._slotRowNum) row = this._slotRowNum - 1;

		var changed = this._cursorCol != col || this._switchIndexList[col] != row;

		this._cursorCol = col;
		this._switchIndexList[col] = row;
		this.refreshMove(changed);
	};

	Scene_MiniGame_Switch.prototype.hitText_exit = function(x, y) {
		var sprite = this._exitSprite;
		if (!sprite) return false;
		else {
			var minX = sprite.x;
			var maxX = sprite.x + sprite.width ;
			var minY = sprite.y;
			var maxY = sprite.y + sprite.height;
			return (minX <= x && x <= maxX && minY <= y && y <= maxY);
		}
	};

	Scene_MiniGame_Switch.prototype.moveTouch = function(x, y) {
		if (this.hitText_exit(x, y)) {
			this.moveExit(true);
		}
		else {
			var hit = this.hitTest(x, y);
			var col = hit[0];
			var row = hit[1];
			if (col != -1 && row != -1) {
				this.moveTo(col, row);
			}
		}
	};


	Scene_MiniGame_Switch.prototype.checkOpen = function() {
		for (var col = 0; col < this._slotColNum; col++) 
			if (this._switchIndexList[col] != this._ansList[col]) 
				return false;
		return true;
	};
	Scene_MiniGame_Switch.prototype.refreshOpen = function() {
		if (this._checkMode && this.checkOpen()) {
			this.playOpenSound();
			$gameSwitches.setValue(this._toVar, true);
			this.moveExit(true);
		}
	};

	Scene_MiniGame_Switch.prototype.refreshMove = function(changed) {
		changed && this.playMoveSound();

		changed && this.executeEvent('B');

		this.refreshAllSprite();
		this.refreshOpen();
	};

	Scene_MiniGame_Switch.prototype.refreshAll = function() {
		this.refreshMove(false);
	};
}




// ------------------------
// 音效
{
	Scene_MiniGame_Switch.prototype.initSound = function() {
		this.initMoveSound();
		this.initOpenSound();
	};
	Scene_MiniGame_Switch.prototype.initMoveSound = function() {
		var se = AudioManager.makeEmptyAudioObject();
		se.name = this.constructor.moveSound;
		se.volume = this.constructor.soundVolume;
		se.pitch = this.constructor.soundPitch;

		if (se.name) {
			this._moveSound = se;
			AudioManager.loadStaticSe(this._moveSound);
		}
		else {
			this._moveSound = null;
		}
	};
	Scene_MiniGame_Switch.prototype.initOpenSound = function() {
		var se = AudioManager.makeEmptyAudioObject();
		se.name = this.constructor.openSound;
		se.volume = this.constructor.soundVolume;
		se.pitch = this.constructor.soundPitch;

		if (se.name) {
			this._openSound = se;
			AudioManager.loadStaticSe(this._openSound);
		}
		else {
			this._openSound = null;
		}
	};

	Scene_MiniGame_Switch.prototype.stopSound = function() {
		AudioManager.stopSe();
	};
	Scene_MiniGame_Switch.prototype.playMoveSound = function() {
		this._moveSound && AudioManager.playSe(this._moveSound);
	};
	Scene_MiniGame_Switch.prototype.playOpenSound = function() {
		if (this._openSound) {
			this.stopSound();
			AudioManager.playSe(this._openSound);
		}
	};
}




// ------------------------
// 游戏按键
{
	Scene_MiniGame_Switch._checkHandleList = [
		'ok', 
		'cancel', 
		'up', 
		'down', 
		'left', 
		'right', 
	];

	Scene_MiniGame_Switch.prototype.processHandling = function() {
		for (var idx in this.constructor._checkHandleList) {
			var key = this.constructor._checkHandleList[idx];

			if (Input.isTriggered(key)) {
				this.callHandler(key);
				break;
			}
		}
		if (TouchInput.isPressed()) {
			this.callHandler('touch');
		}
	};

	Scene_MiniGame_Switch.prototype.initHandleLs = function() {
		this._handlers = this._handlers || [];

		this.setHandler('ok'    , this.processOk    );
		this.setHandler('cancel', this.processCancel);
		this.setHandler('up'    , this.processUp    );
		this.setHandler('down'  , this.processDown  );
		this.setHandler('left'  , this.processLeft  );
		this.setHandler('right' , this.processRight );

		var list = [];
		list.push('ok');
		list.push('cancel');
		list.push('up');
		list.push('down');
		list.push('left');
		list.push('right');
		this._checkHandleList = list;

		this.setHandler('touch' , this.processTouch );
	};

	Scene_MiniGame_Switch.prototype.setHandler = function(symbol, method) {
		this._handlers[symbol] = method;
	};

	Scene_MiniGame_Switch.prototype.isHandled = function(symbol) {
		return !!this._handlers[symbol];
	};

	Scene_MiniGame_Switch.prototype.callHandler = function(symbol) {
		if (this.isHandled(symbol)) {
			this._handlers[symbol].apply(this);
		}
	};


	Scene_MiniGame_Switch.prototype.processOk = function() {
		this.moveExit(true);
	};
	Scene_MiniGame_Switch.prototype.processCancel = function() {
		this.moveExit(false);
	};

	Scene_MiniGame_Switch.prototype.processUp = function() {
		this.moveUp();
	};
	Scene_MiniGame_Switch.prototype.processDown = function() {
		this.moveDown();
	};
	Scene_MiniGame_Switch.prototype.processLeft = function() {
		this.moveLeft();
	};
	Scene_MiniGame_Switch.prototype.processRight = function() {
		this.moveRight();
	};

	Scene_MiniGame_Switch.prototype.processTouch = function() {
		this.moveTouch(TouchInput.x, TouchInput.y);
	};
}




// ------------------------
// 插件指令
{
	var _MK_Game_Interpreter_pluginCommand   = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_MK_Game_Interpreter_pluginCommand.apply(this, arguments);

		var pluginCode = "MK_MiniGame_Switch";
		if (command === pluginCode) {
			if (args[0] === 'call') {
				var i = 1;

				var varStart = Number(args[i++]);
				var colNum   = Number(args[i++]);
				var rowNum   = Number(args[i++]);

				var fadeIn, fadeInTime, fadeOut, fadeOutTime;
				var eventId;

				while (i < args.length) {
					var subCommand = args[i++];
					if (/-fadeIn/i.test(subCommand)) {
						var fadeInStr = args[i++];
						if (/white/i.test(fadeInStr)) fadeIn = 1;
						else if (/black/i.test(fadeInStr)) fadeIn = 2;
						else fadeIn = 0;
						fadeInTime = fadeIn == 0 ? 0 : Number(args[i++] || 0);
					}
					else if (/-fadeOut/i.test(subCommand)) {
						var fadeOutStr = args[i++];
						if (/white/i.test(fadeOutStr)) fadeOut = 1;
						else if (/black/i.test(fadeOutStr)) fadeOut = 2;
						else fadeOut = 0;
						fadeOutTime = fadeOut == 0 ? 0 : Number(args[i++] || 0);
					}
					else if (/-event/i.test(subCommand)) {
						eventId = Number(args[i++] || 0);
					}
				}

				call_MiniGame_Switch(varStart, colNum, rowNum, fadeIn, fadeInTime, fadeOut, fadeOutTime, eventId);
			}
			else if (args[0] === 'check') {
				var varStart = Number(args[1]);
				var colNum   = Number(args[2]);
				var toVar    = Number(args[3]);
				var list = [];
				for (var col = 0; col < colNum; col++) {
					list.push(Number(args[4 + col] || 0));
				}
				check_MiniGame_Switch(varStart, colNum, toVar, list);
			}
			else if (args[0] === 'call_autoCheck') {
				var i = 1;

				var varStart = Number(args[i++]);
				var colNum   = Number(args[i++]);
				var rowNum   = Number(args[i++]);

				var toVar    = Number(args[i++]);
				var list = [];
				for (var col = 0; col < colNum; col++) {
					list.push(Number(args[i++] || 0));
				}

				var fadeIn, fadeInTime, fadeOut, fadeOutTime;
				var eventId;

				while (i < args.length) {
					var subCommand = args[i++];
					if (/-fadeIn/i.test(subCommand)) {
						var fadeInStr = args[i++];
						if (/white/i.test(fadeInStr)) fadeIn = 1;
						else if (/black/i.test(fadeInStr)) fadeIn = 2;
						else fadeIn = 0;
						fadeInTime = fadeIn == 0 ? 0 : Number(args[i++] || 0);
					}
					else if (/-fadeOut/i.test(subCommand)) {
						var fadeOutStr = args[i++];
						if (/white/i.test(fadeOutStr)) fadeOut = 1;
						else if (/black/i.test(fadeOutStr)) fadeOut = 2;
						else fadeOut = 0;
						fadeOutTime = fadeOut == 0 ? 0 : Number(args[i++] || 0);
					}
					else if (/-event/i.test(subCommand)) {
						eventId = Number(args[i++] || 0);
					}
				}

				call_MiniGame_Switch_withCheck(varStart, colNum, rowNum, toVar, list, fadeIn, fadeInTime, fadeOut, fadeOutTime, eventId);
			}
		}
	};

	function call_MiniGame_Switch(inpVarS, inpCol, inpRow, fadeIn, fadeInTime, fadeOut, fadeOutTime, eventId) {
		Scene_MiniGame_Switch.setNextParam(false, inpVarS, inpCol, inpRow);
		Scene_MiniGame_Switch.setNextFadeParam(fadeIn, fadeInTime, fadeOut, fadeOutTime);
		Scene_MiniGame_Switch.setNextEvent(eventId);
		SceneManager.push(Scene_MiniGame_Switch);
		Scene_MiniGame_Switch.unsetNextParam();
		Scene_MiniGame_Switch.unsetNextFadeParam();
		Scene_MiniGame_Switch.unsetNextEvent();
	}

	function check_MiniGame_Switch(varStart, colNum, toVar, list) {
		varStart = varStart || Scene_MiniGame_Switch.defaultVarStart;
		colNum   = colNum   || Scene_MiniGame_Switch.defaultColNum  ;
		toVar    = toVar    || Scene_MiniGame_Switch.defaultSwitchNo;
		list     = list     || [];

		var result = true;
		for (var col = 0; col < colNum; col++) {
			if (Number($gameVariables.value(varStart + col)) !== Number(list[col])) {
				result = false;
				break;
			}
		}
		$gameSwitches.setValue(toVar, result);
	}

	function call_MiniGame_Switch_withCheck(inpVarS, inpCol, inpRow, toVar, list, fadeIn, fadeInTime, fadeOut, fadeOutTime, eventId) {
		Scene_MiniGame_Switch.setNextParam(true, inpVarS, inpCol, inpRow, toVar, list);
		Scene_MiniGame_Switch.setNextFadeParam(fadeIn, fadeInTime, fadeOut, fadeOutTime);
		Scene_MiniGame_Switch.setNextEvent(eventId);
		SceneManager.push(Scene_MiniGame_Switch);
		Scene_MiniGame_Switch.unsetNextParam();
		Scene_MiniGame_Switch.unsetNextFadeParam();
		Scene_MiniGame_Switch.unsetNextEvent();
	}
}


MK_Data.class['Scene_MiniGame_Switch'] = Scene_MiniGame_Switch;


})();

