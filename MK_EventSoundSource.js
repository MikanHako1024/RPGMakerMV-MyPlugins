//=============================================================================
// MK_EventSoundSource.js
// 事件音源
//=============================================================================
//  author : Mikan 
//  plugin : MK_EventSoundSource.js 事件音源
// version : v0.6.01 2020/02/02 
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/_MikanHako/
//  [GitHub] https://github.com/MikanHako1024/
//    [Blog] NONE
//=============================================================================




/*:
 * @plugindesc MK_EventSoundSource <事件音源>
 * @author Mikan 
 * @version v0.6.01 2020/02/02 解决了停止时打开菜单会播放的问题
 *   v0.6.00 2020/02/02 允许设置初始声音不播放或不循环
 *   v0.5.00 2020/02/02 优化了音频的清理
 *   v0.4.00 2020/02/01 添加了获取音乐播放状态的功能
 *   v0.3.00 2020/02/01 解决了读档bug 添加了控制、更变音乐的功能
 *   v0.2.00 2020/01/31 可以为非自身事件设置音源
 *   v0.1.00 2020/01/31 完成了最初的构架
 * 
 * 
 * @help
 * ---- 插件指令 ----
 * 
 * #设置音源参数
 *     插件指令 : SetSound eventId key value
 *     插件指令 : ModifySound eventId key value
 *         eventId : 设置音源的事件id (不是声音目标事件id)
 *         key     : 需要设置的参数名
 *         value   : 需要设置的值
 * 
 *         key    | value
 *         -------+-------
 *         target | 声音目标事件id
 *         name   | 音乐名
 *         dist   | 距离限制
 *         volume | 音量
 *         pan    | 音像
 *         pitch  | 音调
 *         loop   | 是否循环 (循环 loop / 一次 only )
 *         play   | 是否播放 (播放 on   / 停止 off  )
 *         pause  | 是否暂停 (继续 cont / 暂停 pause) 
 *                | ps : 在场景开始时会自动继续 场景结束时会自动暂停
 *                |      一般停止播放应该使用 play off 
 * 
 *     示例 : 修改 在id为6的事件设置的声音 的 声音目标 为 id为6的事件
 *         ModifySound 6 target 8
 *     示例 : 修改 在id为6的事件设置的声音 的 声音文件 为 audio/bgs/Sea
 *         ModifySound 6 name Sea
 *     示例 : 修改 在id为6的事件设置的声音 的 距离限制 为 5格
 *         ModifySound 6 dist 5
 *     示例 : 让 在id为6的事件设置的声音 只播放一次不循环 (不会直接停止 不会重播)
 *         ModifySound 6 loop only
 *     示例 : 让 在id为6的事件设置的声音 停止
 *         ModifySound 6 play off
 *     示例 : 让 在id为6的事件设置的声音 暂停
 *         ModifySound 6 pause pause
 * 
 * 
 * #判断音乐播放状态
 *     插件指令 : CheckSound eventId key variId
 *     示例 : 让 在id为6的事件设置的声音 暂停
 *         eventId : 设置音源的事件id (不是声音目标事件id)
 *         key     : 需要读取的参数名
 *         variId  : 存放值的编号 (分为 变量 和 开关)
 * 
 *         key    | type | value
 *         -------+------+-------
 *         target | 变量 | 声音目标事件id
 *         name   | 变量 | 音乐名
 *         dist   | 变量 | 距离限制
 *         volume | 变量 | 音量
 *         pan    | 变量 | 音像
 *         pitch  | 变量 | 音调
 *         loop   | 开关 | 是否循环 (循环 ON  / 一次 OFF)
 *         play   | 开关 | 是否播放 (播放 ON  / 停止 OFF)
 *         pause  | 开关 | 是否暂停 (继续 OFF / 暂停 ON )
 * 
 *     示例 : 检查 是否在播放 存进开关1 (ON : 仍在播放 / OFF : 播放结束)
 *         CheckSound 6 play 1
 *     
 *     示例 : 播放结束后等待600帧后再播放
 *         事件 并行处理 : 
 *             ◆插件指令：CheckSound 1 play 3
 *             ◆如果：#0003 为 OFF
 *              ◆等待：600帧
 *               ◆插件指令：SetSound 1 play on
 *               ◆
 *             ：结束
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
 * #为自身事件设置一个音源
 *     事件备注 : <Sound : name, dist, play, loop, volume, pan, pitch>
 * 			name    : bgs名 (路径为 audio/bgs/)
 * 			dist    : 声音距离限制 (按格数 线性地减弱声音)
 * 			play    : 初始播放状态 (播放 on / 不播放 off / 默认 on)
 * 			loop    : 初始循环状态 (循环 loop / 仅一次 only / 默认 loop)
 * 			volume  : 音量 (默认 90)
 * 			pan     : 音像 (默认 0)
 * 			pitch   : 音调 (默认 100)
 *     示例 : 为自身事件播放音乐audio/bgs/City 极限距离10格 默认播放且循环
 *         <Sound : City, 10, on, loop>
 * 
 * #为非自身事件设置一个音源
 *     事件备注 : <SetSound : eventId, name, dist, status, volume, pan, pitch>
 * 			eventId : 目标事件Id
 *     示例 : 为Id为6的事件播放音乐audio/bgs/City 极限距离10格 默认播放且循环
 *         <SetSound : 6, City, 10, on, loop>
 * 
 * 
 * ---- 使用方法 ----
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




// 暂时只支持 根据 事件坐标与玩家坐标的距离


// 暂时使用 线性公式 计算声音减弱


// 暂时不清楚 是否会因为 不清除事件的 bgsBuffer 导致内存堆积


// FINISH : 更换音乐


// 暂时不能 自动在事件消失时停止音乐



function MK_SoundSourceManager() {
    throw new Error('This is a static class');
}

var MK_Plugins = MK_Plugins || {};
MK_Plugins.paramGet = MK_Plugins.paramGet || {};
MK_Plugins.param = MK_Plugins.param || {};
MK_Plugins.class = MK_Plugins.class || {};

MK_Plugins.class['MK_SoundSourceManager'] = MK_SoundSourceManager;



MK_SoundSourceManager._soundBufferList = [];
MK_SoundSourceManager._soundList       = [];


MK_SoundSourceManager.addSound = function(sound) {
	if (!sound) return ;

	var bgs = sound;

	if (!bgs.name) return null;
	var bgsBuffer = AudioManager.createBuffer('bgs', bgs.name);
	AudioManager.updateBufferParameters(bgsBuffer, AudioManager._bgsVolume, bgs);

	var index = this._soundBufferList.push(bgsBuffer) - 1;
	this._soundList.push(bgs) - 1;
	bgs.index = index;

	return bgsBuffer;
};

MK_SoundSourceManager.removeAllSound = function() {
	this.pauseAllSound();
	this._soundBufferList = [];
	this._soundList       = [];
};

MK_SoundSourceManager.removeSound = function(index) {
	var buffer = this._soundBufferList[index];
	buffer.stop();
	this._soundBufferList[index] = undefined;
	this._soundList[index] = undefined;
};


MK_SoundSourceManager.pullStatus = function(sound) {
	if (!sound) return ;
	if (this._soundList[sound.index] !== sound) return ;

	var index = sound.index;
	var buffer = this._soundBufferList[index];

	sound.pos  = !!buffer ? buffer.seek() : 0;
	sound.play = sound.pause ? sound.play
			      : (!!buffer ? buffer.isPlaying() : false);
	sound.pos = !sound.play ? 0 : sound.play;
};

MK_SoundSourceManager.pushStatus = function(sound) {
	if (!sound) return ;
	if (this._soundList[sound.index] !== sound) return ;

	var index = sound.index;
	var buffer = this._soundBufferList[index];
	if (!buffer) {
		buffer = AudioManager.createBuffer('bgs', sound.name);
		AudioManager.updateBufferParameters(buffer, AudioManager._bgsVolume, sound);
		this._soundBufferList[index] = buffer;
	} 

	var settoPlay  = sound.play && !sound.pause;
	var settoPause = sound.pause;
	var settoLoop  = sound.loop;
	var nowPlay    = buffer.isPlaying();
	var nowPos     = buffer.seek();
	var settoPos   = nowPlay ? nowPos : sound.pos;

	var tmpBuffer = AudioManager.createBuffer('bgs', sound.name);
	if (tmpBuffer.url !== buffer.url) { 
		buffer.stop();
		buffer = tmpBuffer;
		AudioManager.updateBufferParameters(buffer, AudioManager._bgsVolume, sound);
		this._soundBufferList[index] = buffer;
	}

	if (settoPlay) {
		buffer.play(settoLoop, settoPos);
	}
	else {
		if (settoPause) {
			sound.pos = nowPos;
			buffer.stop();
		}
		else {
			sound.pos = 0;
			buffer.stop();
		}
	}
};


MK_SoundSourceManager.stopAllSound = function() {
	this._soundList.forEach(function(sound) {
		if (!sound) return ;
		sound.play = false;
		this.pushStatus(sound);
	}, this);
};

MK_SoundSourceManager.pauseAllSound = function() {
	this._soundList.forEach(function(sound) {
		if (!sound) return ;
		sound.pause = true;
		this.pushStatus(sound);
	}, this);
};

MK_SoundSourceManager.continueAllSound = function() {
	this._soundList.forEach(function(sound) {
		if (!sound) return ;
		sound.pause = false;
		this.pushStatus(sound);
	}, this);
};


MK_SoundSourceManager.checkLossSound = function(sound) {
	if (!sound) return ;

	var index = sound.index;
	if (this._soundList[index] !== sound) {
		this._soundList[index] = sound;
		this.pushStatus(sound);
	}
};

MK_SoundSourceManager.checkAllLossSound = function() {
	$gameMap._events.forEach(function(event) {
		if (!event || !event._bgs) return ;
		this.checkLossSound(event._bgs);
	}, this);
};

MK_SoundSourceManager.checkAllRetainSound = function() {
	this._soundList.forEach(function(sound, idx) {
		if (!sound) return ;
		var event = $gameMap.event(sound.configerId);
		if (!event || !event._bgs) {
			this.removeSound(idx);
		}
	}, this);
};


MK_SoundSourceManager.calDistToPlayer = function(targetId) {
	var target = $gameMap.event(targetId);

	if (!target) return Number.POSITIVE_INFINITY;
	return Math.sqrt(
		  Math.pow($gamePlayer._realX - target._realX, 2) 
		+ Math.pow($gamePlayer._realY - target._realY, 2)
	);
};

MK_SoundSourceManager.calVolumeRate = function(sound) {
	var targetId = sound.targetId;
	var nowDist  = this.calDistToPlayer(targetId);
	var lmtDist  = sound.dist;

	var dist = Math.max(0, Math.min(lmtDist, nowDist));
	var rate = lmtDist === 0
			   ? (nowDist === 0 ? 1 : 0) 
			   : (1.0 - dist / lmtDist);

	sound.vRate = rate;
};

MK_SoundSourceManager.updateBufferWithDist = function(sound) {
	if (!sound) return ;
	if (this._soundList[sound.index] !== sound) return ;

	var index = sound.index;
	var buffer = this._soundBufferList[index]; 

	var configVolume = AudioManager._bgsVolume;
	buffer.volume = configVolume * (sound.volume * sound.vRate || 0) / 10000;
    buffer.pitch  = (sound.pitch || 0) / 100;
    buffer.pan    = (sound.pan || 0) / 100;
};


MK_SoundSourceManager.formatSound = function(sound) {
	if (typeof sound !== 'object') AudioManager.makeEmptyAudioObject();


	var targetId = sound.targetId;
	targetId = Math.floor(Number(targetId || 0));
	targetId = targetId <= 0 ? 0 : targetId;
	sound.targetId = targetId;

	var name = sound.name;
	name = String(name) || '';
	sound.name = name;

	// soundMode 暂时只有 bgs

	var dist = sound.dist;
	dist = Number(dist || 'inf');
	dist = Number.isNaN(dist) ? Number.POSITIVE_INFINITY : dist;
	dist = (dist < 0 && dist != -1) ? Number.POSITIVE_INFINITY : dist;
	sound.dist = dist;

	var volume = sound.volume;
	var volume = Number(volume || '90');
	volume = Number.isNaN(volume) ? 90 : volume;
	volume = Math.max(0, volume);
	sound.volume = volume;

	var pan = sound.pan;
	pan = Number(pan || '0');
	pan = Math.max(0, pan);
	sound.pan = pan;
	
	var pitch = sound.pitch;
	pitch = Number(pitch || '100');
	pitch = Number.isNaN(pitch) ? 100 : pitch;
	pitch = Math.max(0, pitch);
	sound.pitch = pitch;


	var pos = sound.pos;
	pos = Math.floor(Number(pos || '0'));
	pos = Number.isNaN(pos) ? 0 : pos;
	pos = Math.max(0, pos);
	sound.pos = pos;

	var loop = sound.loop;
	loop = typeof loop === 'undefined' ? true : loop;
	loop = typeof loop === 'string' ? !loop.match(/(false|only)/i) : !!loop;
	sound.loop = loop;

	var play = sound.play;
	play = typeof play === 'undefined' ? true : play;
	play = typeof play === 'string' ? !play.match(/(false|off)/i) : !!play;
	sound.play = play;

	var pause = sound.pause;
	pause = typeof pause === 'undefined' ? false : pause;
	pause = typeof pause === 'string' ? !!pause.match(/(true|pause)/i) : !!pause;
	sound.pause = pause;

	var index = sound.index;
	index = index !== 0 ? Math.floor(Number(index || '-1')) : index;
	index = Number.isNaN(index) ? -1 : index;
	index = index < -1 ? -1 : index;
	sound.index = index;

	var vRate = sound.vRate;
	vRate = Number(vRate || '0');
	vRate = Number.isNaN(vRate) ? 0 : vRate;
	vRate = Math.min(1, Math.max(0, vRate));
	sound.vRate = vRate;

	var configerId = sound.configerId;
	configerId = Math.floor(Number(configerId || 0));
	configerId = configerId <= 0 ? 0 : configerId;
	sound.configerId = configerId;


	return sound;
};



var _MK_Game_Event_initialize   = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function() {
	_MK_Game_Event_initialize.apply(this, arguments);
	this._bgsBuffer = null;
	this.createEventSound();
};

var _MK_Game_Event_update   = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
	_MK_Game_Event_update.apply(this, arguments);
	this.updateEventSound();
};


Game_Event.prototype.createEventSound = function() {

	var note = this.event().note || '';
	var matchResult = note.match(/<(Sound|SetSound) *:(.*?)>/i);
	if (!!matchResult) {
		var args = matchResult[2].split(',')
								 .map(function(str) { return str.trim(); })
								 .filter(function(str) { return !!str; });
		var command = matchResult[1] || '';

		var bgs = AudioManager.makeEmptyAudioObject();
		bgs.targetId = !!command.match(/SetSound/i) 
						 ? Number(args.shift()) || this.eventId()
						 : this.eventId();
		bgs.configerId = this.eventId(); // 控制者Id
		bgs.name     = args[0];
		bgs.dist     = args[1];
		bgs.play     = args[2];
		bgs.loop     = args[3];
		bgs.volume   = args[4];
		bgs.pan      = args[5];
		bgs.pitch    = args[6];
		bgs = MK_SoundSourceManager.formatSound(bgs);

		if (!!bgs.name) {
			this._bgs = bgs;
			MK_SoundSourceManager.addSound(this._bgs);
		}
	}
};


Game_Event.prototype.needEventSound = function() {
	return !!this._bgs;
};

Game_Event.prototype.updateEventSound = function() {

	if (this.needEventSound()) {

		MK_SoundSourceManager.calVolumeRate(this._bgs);
		MK_SoundSourceManager.updateBufferWithDist(this._bgs);
		MK_SoundSourceManager.pullStatus(this._bgs);
	}
};


var _MK_Scene_Map_stop   = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
	_MK_Scene_Map_stop.apply(this, arguments);
	MK_SoundSourceManager.pauseAllSound();
};

var _MK_Scene_Map_start   = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	_MK_Scene_Map_start.apply(this, arguments);
	MK_SoundSourceManager.checkAllRetainSound();
	MK_SoundSourceManager.checkAllLossSound();
	MK_SoundSourceManager.continueAllSound();
};



var _MK_Game_Interpreter_pluginCommand   = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_MK_Game_Interpreter_pluginCommand.apply(this, arguments);

	if (!(command === 'SetSound' || 
		  command === 'ModifySound' || 
		  command === 'CheckSound')) {
		return ;
	}

	var configerId = Math.floor(Number(args[0] || '0'));
	if (configerId <= 0) return ;
	var event = $gameMap.event(configerId);
	if (!event || !event._bgs) return ;
	var sound = event._bgs;

	var key = String(args[1] || '');
	var value = args[2];

	var list = [
		['targetId', /target/i, false], 
		['name'    , /name/i  , false], 
		['dist'    , /dist/i  , false], 
		['volume'  , /vol/i   , false], 
		['pan'     , /pan/i   , false], 
		['pitch'   , /pitch/i , false], 
		['pos'     , /pos/i   , false], 
		['loop'    , /loop/i  , true ], 
		['play'    , /play/i  , true ], 
		['pause'   , /pause/i , true ],
	];

	for (var idx in list) {
		if (!!key.match(list[idx][1])) {
			key = list[idx][0];
				
			if (command === 'SetSound' || command === 'ModifySound') {
				sound[key] = value;
				MK_SoundSourceManager.formatSound(sound);
				MK_SoundSourceManager.pushStatus(sound);
			}
			else if (command === 'CheckSound') {
				value = Math.floor(Number(value || '0'));
				value = Number.isNaN(value) ? 0 : value;
				if (value <= 0) return ;

				var isSwitch = list[idx][2];
				var id = value;
				var gameList = isSwitch ? $gameSwitches : $gameVariables;
				gameList.setValue(id, sound[key]);
			}

			break;
		}
	}
};




