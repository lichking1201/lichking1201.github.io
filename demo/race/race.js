/*
 * Car Object
 */
function Car (x, y, alfa, color, maxVelocity, radius) {
	this.x = x;					// X 坐标
	this.y = y;					// Y 坐标
	this.alfa = alfa == null ? Math.PI / 2 : alfa;	// 方向 初始PI/2
	this.v = 0;					// 速度
	this.v0 = 0.5;				// 最低速

	this.a = 1.05;				//加速度
	this.maxVelocity = maxVelocity == null ? 3 : maxVelocity;	// 最大速度

	this.color = color == null ? '#4A96AD' : color;	// 颜色
	this.r = radius == null ? 10 : radius;			// 半径

	/* 绘制赛车 */
	this.repr = function (c, x, y) {
		c.fillStyle = this.color;
		c.beginPath();
		c.arc(Math.round(x), Math.round(y), this.r, -1 * Math.PI / 2 - this.alfa, Math.PI / 2 - this.alfa);
		c.closePath();
		c.fill();
	}

	/* 绘制镜像对手 */
	this.reprShadow = function(c, x, y, alfa) {
		c.globalAlpha = 0.5;
		c.fillStyle = '#999';
		c.beginPath();
		c.arc(Math.round(x), Math.round(y), this.r, -1 * Math.PI / 2 - alfa, Math.PI / 2 - alfa);
		c.fill();
		c.globalAlpha = 1;
	}

	// 车头半圆，十等分，取各点坐标
	this.collision = function () {
		if (this.x < 0 || this.y < 0 || this.x > track.w - 1 || this.y > track.h - 1) return false; // 不在绘图区，排除
		if (!onTheRoad(this.x, this.y)) return true; // 脱离赛道，碰撞！

		var x, y;
		var r = this.r;
		for (var alfa = -1 * Math.PI / 2; alfa < Math.PI / 2; alfa += Math.PI / 10) {
			x = ~~(r * Math.cos(alfa + this.alfa));
			y = ~~(r * Math.sin(alfa - this.alfa));
			if (!onTheRoad(this.x + x, this.y + y)) return true;
		}
		return false;
	}

	// 检查点，放逆行作弊
	this.checkpoints = [ false, false ];
	this.allCheckpoints = function () {
		for (var i = 0; i < this.checkpoints.length; i++) {
			if (!car.checkpoints[i]) return false;
		}
		return true;
	}
	this.resetCheckpoints = function () {
		for (var i = 0; i < this.checkpoints.length; i++) this.checkpoints[i] = false;
	}

	this.shadow = [];
	this.newShadow = [];
};

/*
 * 赛道
 */
function Track (name, filename, width, height, x, y, alfa, teleporter, checkpoints) {
	this.name = name;
	filename = 'tracks/' + filename;
	this.filename = filename + '.png';
	this.filenameHidden = filename + '_h.png';
	this.w = width;		// 赛道尺寸
	this.h = height;
	this.x = x; 	// 赛车初始位置
	this.y = y;
	this.alfa = alfa == null ? Math.PI / 2 : alfa;
	this.teleporter = teleporter == null ? function (carObject) { } : teleporter; // TODO:无限赛道

	this.checkpoints = checkpoints == null ? null : checkpoints;
};

/*
 * 无限赛道的的重定位
 */
function infiniteTrack(carObject) {
	if (carObject.x < 0) carObject.x += track.w;
	if (carObject.y < 0) carObject.y += track.h;
	if (carObject.x > track.w) carObject.x %= track.w;
	if (carObject.y > track.h) carObject.y %= track.h;
}

/*
 * 主要的帧动画
 */
function frame () {
	if (!trackLoaded) {
		wipeCanvas();
		setTimeout(frame, 500);	
		return;
	}

	if (show === 'game') {
		document.getElementById('start').style.display = "none";

		var x = car.x, 
			y = car.y;
		
		car.v *= 0.98; // 摩擦系数

		if (car.v > 0) {
			car.v *= car.a; // 加速
		} else if (car.v < -0.001) {
			car.v *= 1 - (car.a - 1) * 5; //TODO: 碰撞后速度为负数，缓动到0;无法归零，只能近似到一负极小值
		} else {
			car.v = car.v0; //速度为0时 初速启动
		}
		// 速度极限
		if (car.v > car.maxVelocity) car.v = car.maxVelocity;
		

		// 转向驾驶
		if (!strictSteering || car.v > 0) {
			if (keyDown('LEFT')) {
				car.alfa += steeringAngle;
			} else if (keyDown('RIGHT')) {
				car.alfa -= steeringAngle;
			}
		}
		if (car.alfa > 2 * Math.PI) car.alfa %= 2 * Math.PI; //360deg转向

		// 更新坐标
		car.x += car.v * Math.cos(car.alfa);
		car.y -= car.v * Math.sin(car.alfa);

		// 启用无限赛道
		track.teleporter(car);

		// 碰撞后状态改变
		if (car.collision()) {
			car.x = x;
			car.y = y;
			car.v = -1 * car.v / 1.5;
		}

		// 检查点
		if (track.checkpoints != null) {
			if (insideRectangle(car.x, car.y, track.checkpoints['1'])) { // 检查点 1
				if (car.checkpoints[0] && car.checkpoints[1]) { // 先通2再走1，重置 
					car.resetCheckpoints();
				}
				if (!car.checkpoints[0]) car.checkpoints[0] = true; // 通过检查点1
			} else if (insideRectangle(car.x, car.y, track.checkpoints['2'])) { // 检查点 2
				if (car.checkpoints[0]) {
					if (!car.checkpoints[1]) car.checkpoints[1] = true; // 1、2检查点都正确通过
				} else {
					car.resetCheckpoints(); // 没有通过1逆行来到2，重置
				}
			} else if (insideRectangle(car.x, car.y, track.checkpoints['start'])) { // 起点
				if (car.allCheckpoints()) newLap(); // 1、2检查通过，新的一圈

				car.resetCheckpoints(); 
			}
		}

		car.newShadow.push([ car.x, car.y, car.alfa ]); // 赛车轨迹复制到影子对手
	} else if (show === 'menu') {
		document.getElementById('start').style.display = "block";
	} else if (show === '321') {
		time = (new Date()).getTime();
		lapTime = time;
		countdown = null;
		show = 'game';
	} else {
		return;
	}

	var dNode = {
		width:window.innerWidth,
		height:window.innerHeight
	}

	wipeCanvas();

	// 确保赛道跟随赛车，保持赛车居中在屏幕
	var trackOffsetX = car.x - dNode.width / 2,
		trackOffsetY = car.y - dNode.height / 2;



	// 边界修正
	
	if (trackOffsetX > track.w - dNode.width) trackOffsetX = track.w - dNode.width;
	if (trackOffsetX < 0) trackOffsetX = 0;
	if (trackOffsetY > track.h - dNode.height) trackOffsetY = track.h - dNode.height;
	if (trackOffsetY < 0) trackOffsetY = 0;
	document.getElementById("console").innerHTML = car.y - dNode.height / 2;

	// 赛车相对窗口的位置
	var rX = car.x - trackOffsetX,
		rY = car.y - trackOffsetY;
	/* 帧重绘 */
	// 重绘地图
	// trackImg.style.top = -trackOffsetY + "px";
	// trackImg.style.left = -trackOffsetX + "px";
	c.drawImage(trackImg, -trackOffsetX, -trackOffsetY);

	// 第二圈，添加影子对手
	if (car.shadow.length > 0) {
		var shadow = car.shadow.shift();
			car.reprShadow(c, shadow[0] - trackOffsetX, shadow[1] - trackOffsetY, shadow[2]);
	}

	// 重绘赛车
	//car.repr(c, rX, rY);
	c.fillStyle = car.color;
	c.beginPath();
	c.arc(Math.round(rX), Math.round(rY), car.r, -1 * Math.PI / 2 - car.alfa, Math.PI / 2 - car.alfa);
	c.closePath();
	c.fill();

	f++;
	requestAnimationFrame(frame); //微信不支持，添加UA判断支持

}

/*
 * 下一圈
 */
function newLap () {
	var t = (new Date()).getTime();
	var n = t - lapTime;
	lapTimes.push(n);
	if(!faster){
		faster = n;	
	}else{
		faster = n < faster ? n : faster;
	}
	
	lapTime = t;
	nrLaps++;

	car.shadow = car.newShadow;
	car.newShadow = [];


	fastlapTimeElement.innerHTML = (faster / 1000).toFixed(2);
	lapTimesList.innerHTML += '<li>' + (n / 1000).toFixed(2) + '</li>';
}

/*
 * 载入赛道
 */
function loadTrack(id) {
	if (id < 0 || id >= tracks.length) return false;
	trackLoaded1 = false, trackLoaded2 = false, trackLoaded = false;
	track = tracks[id];

	// 初始化赛车
	car = new Car(0, 0);
	car.x = track.x;
	car.y = track.y;
	car.alfa = track.alfa;
	car.shadow = [];
	car.newShadow = [];

	if (track.name == 'Track 1') {
		car.r = 14;
		car.maxVelocity += 1;
	}

	// 移除旧的赛道位图
	var node = document.getElementById('track');
	var parent = node.parentNode;
	parent.removeChild(node);
	// 建立新位图
	node = document.createElement('img');
	node.setAttribute('id', 'track');
	node.setAttribute('onload', 'trackLoaded1 = true;');
	node.setAttribute('src', track.filename);
	parent.appendChild(node);

	// 移除旧路径位图
	node = document.getElementById('hiddenTrack');
	parent.removeChild(node);
	// 建立新路径位图
	node = document.createElement('img');
	node.setAttribute('id', 'hiddenTrack');
	node.setAttribute('onload', 'trackLoaded2 = true;');
	node.setAttribute('src', track.filenameHidden);
	parent.appendChild(node);

	cNode = document.getElementById('raceTrack');
	c = cNode.getContext('2d');

	hiddenCanvas = document.getElementById('hiddenCanvas')
	hiddenCanvas.width = track.w;
	hiddenCanvas.height = track.h;
	hiddenCanvas = hiddenCanvas.getContext('2d');

	trackImg = document.getElementById('track');
	hiddenTrackImg = document.getElementById('hiddenTrack');
	loadTrackFinish();

	// UI
	show = 'menu';

	// 重置
	nrLaps = 0;
	timeElement.innerHTML = '0.00';
	fastlapTimeElement.innerHTML = '0.00';
	lapTimeElement.innerHTML = '0.00';
	nrLapsElement.innerHTML = '0';
	speedElement.innerHTML = '0.00';
	lapTimesList.innerHTML = '';
	resetFPS();

	document.getElementById('raceTrack').focus();
}

/*
 * 赛道加载完成
 */
function loadTrackFinish () {
	if (trackLoaded1 && trackLoaded2) {
		hiddenCanvas.drawImage(hiddenTrackImg, 0, 0);

		trackImageData = []; // 路径数据
		var k = hiddenCanvas.getImageData(0, 0, track.w, track.h).data;
		var j;
		for (var i = 0; i < k.length / 4; i += 1) {
			j = 4 * i;
			if (k[j] === 255 && k[j + 1] === 255 && k[j + 2] === 255) {
				trackImageData.push(false);
			} else {
				trackImageData.push(true);
			}
		}

		trackLoaded = true;
	} else {
		setTimeout(loadTrackFinish, 200);
	}
}

/*
 * 赛道检测
 */
function onTheRoad (x, y) {
	var i = Math.round(y) * track.w + Math.round(x);
	return trackImageData[i];
}

/*
 * 选择赛道
 */
function selectTrack () {
	var id = document.getElementsByName('selectTrack')[0].value;
	loadTrack(id);
}

/*
 * 文本提示
 */
function displayText (text, x, y, fontSize) {
	fontSize = fontSize == null ? 32 : fontSize;

	c.textAlign = "center";
	c.fillStyle = '#EEE';
	c.strokeStyle = '#666';
	c.globalAlpha = 0.25;
	var x0 = Math.round(cNode.width / 2 - x / 2);
	var y0 = Math.round(cNode.height / 2 - y / 2);
	c.fillRect(x0, y0, x, y - Math.round(fontSize / 2));
	c.strokeRect(x0, y0, x, y - Math.round(fontSize / 2));
	c.globalAlpha = 1;

	c.font = fontSize + "px Arial";
	c.fillStyle = '#000';
	c.fillText(text, Math.round(cNode.width / 2), Math.round(cNode.height / 2));
}

/*
 * 画布重置
 */
function wipeCanvas () {
	var temp = c.fillStyle;
	c.fillStyle = "rgba(0,0,0,0)"
	c.fillRect(0, 0, cNode.width, cNode.height);
	c.fillStyle = temp;
}

/*
 * fps
 */
function resetFPS () {
	f = 0;
	fpsTime = (new Date()).getTime();
}

function keyDown (key) { 
	return keys[key];
}

/*
 * 操作事件绑定
 */
function keyHandler (e,tmp) {

	if (!trackLoaded) return;

	if (show === 'menu') {
		if (tmp.id === 'start' && e.type === 'touchstart') { // New game
			show = '321';
			countdown = (new Date()).getTime();
		}
	}
	var keyCode;
	if(tmp.id === 'ctrRight'){
		keyCode = 39
	}
	if(tmp.id === 'ctrLeft'){
		keyCode = 37
	}

	if ((keyCode >= 37 && keyCode <= 40) || e.keyCode === 32) {
		keys[keyCodes[keyCode]] = e.type === 'touchstart';
		e.preventDefault();
	}
}

/*
 * 坐标检测
 */
function insideRectangle (x, y, array) {
	return (x > array[0] && x < array[1] && y > array[2] && y < array[3]);
}

var tracks = [
				new Track('Track 0', 'track0', 1000, 600, 942, 450, null, null, {'start' : [875, 995, 425, 435], '1' : [875, 995, 250, 260], '2' : [875, 995, 100, 110] }),
				new Track('Track 1', 'track', 1500, 800, 770, 80, 0, null, { 'start' : [790, 800, 5, 160], '1' : [850, 860, 5, 160], '2' : [900, 910, 5, 160] }),
				new Track('Speedway', 'speedway', 1000, 600, 925, 300, null, null, { 'start' : [835, 990, 290, 300], '1' : [510, 540, 10, 200], '2' : [480, 490, 400, 559] }),
				new Track('Infinity', 'infinity', 1000, 600, 550, 250, null, infiniteTrack)
			 ],
	track, c, cNode, hiddenCanvas, trackImg,
	car = new Car(0, 0),
	trackLoaded1, trackLoaded2, trackLoaded, 
	trackImageData,
	keyCodes = { 37 : 'LEFT', 38 : 'UP', 39 : 'RIGHT', 40 : 'DOWN', 32 : 'SPACE' },
	keys = {
			'UP' : false,
			'DOWN' : false,
			'LEFT' : false,
			'RIGHT' : false,
			'SPACE' : false
	},
	strictSteering = false, 		// 静止时是否允许转动
	steeringAngle = Math.PI / 90,  //每帧转动角度
	faster = 0;

// UI
var show = 'menu', // menu, 321, game
	countdown,
	speedElement = document.getElementById('speed'),
	timeElement = document.getElementById('time'),
	lapTimeElement = document.getElementById('lapTime'),
	fastlapTimeElement = document.getElementById('fastlapTime'),
	nrLapsElement = document.getElementById('nrLaps'),
	lapTimesList = document.getElementById('lapTimes'),
	time = 0, lapTime = 0, nrLaps = 0, lapTimes = [];

// FPS
var f, fpsTime, fpsElement = document.getElementById('fps');

// Debug
var debug = false;

// Load track
loadTrack(1);

// Select track
var selected, 
	e = document.getElementsByName('selectTrack')[0];
e.innerHTML = '';
for (var i = 0; i < tracks.length; i++) {
	selected = track.filename == tracks[i].filename ? ' selected' : '';
	e.innerHTML += '<option value="' + i + '"' + selected + '>' + tracks[i].name + '</option>';
}

// Display FPS
setInterval(function () { 
	if (show === 'game') {
		fpsElement.innerHTML = (f / ((new Date()).getTime() - fpsTime) * 1000).toFixed(0);
		if ((new Date()).getTime() - fpsTime > 5000) resetFPS(); // 5 seconds' average FPS
	}
}, 250);

// Display time, lap time, nr. of laps, speed
setInterval(function () {
	if (show == 'game') {
		var now = (new Date()).getTime();
		timeElement.innerHTML = ((now - time) / 1000).toFixed(2);
		lapTimeElement.innerHTML = ((now - lapTime) / 1000).toFixed(2);
		nrLapsElement.innerHTML = nrLaps;
		speedElement.innerHTML = car.v.toFixed(2);
	}
}, 100);

// Debug
setInterval(function () {
	if (debug) {
		console.log(car.x + ' ' + car.y + ' ' + onTheRoad(car.x, car.y) + ' ' + car.collision());
	}
}, 1000);
frame();
//setInterval(frame,16.7);