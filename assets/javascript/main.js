
(function() {

'use strict';

function playerVideo (element) {
	this.init(element);
}

playerVideo.prototype.init = function (element) {

	if (element === null || typeof element == "undefined") {
		return;
	}	

	this.build(element.offsetParent);
	element.offsetParent.removeChild(element);
};

playerVideo.prototype.build = function (element) {

	this.root = element;
	this.player = this.root.querySelectorAll('video')[0];

	this.buildComponentsContent()
		.buildControlsButtons()
		.buildProgressBar()
		.buildTime()
		.buildVolumeButton()
		.buildFunctionButtons()
		.createEvents()
		.startVideo();
};

playerVideo.prototype.buildComponentsContent = function () {

	this.controlsContent = document.createElement('div');
	this.controlsContent.className = 'controls-content';

	this.componentsContentLeft = document.createElement('div');
	this.componentsContentLeft.className = 'components-content';

	this.componentsContentRight = document.createElement('div');
	this.componentsContentRight.className = 'components-content';

	this.progressBarContentCenter = document.createElement('div');
	this.progressBarContentCenter.className = 'progressbar-content';

	this.controlsContent.appendChild(this.componentsContentLeft);
	this.controlsContent.appendChild(this.progressBarContentCenter);
	this.controlsContent.appendChild(this.componentsContentRight);

	this.root.appendChild(this.controlsContent);
		
	return this;
};

playerVideo.prototype.buildControlsButtons = function () {	

	this.playIconSpan = document.createElement('span');
	this.playIconSpan.className = 'icon icon-button icon-play';
	this.playIconSpan.setAttribute("name", "icon-play");

	this.reloadIconSpan = document.createElement('span');
	this.reloadIconSpan.className = 'icon icon-button icon-reload';
	this.reloadIconSpan.setAttribute("name", "icon-reload");

	this.componentsContentLeft.appendChild(this.playIconSpan);	
	this.componentsContentLeft.appendChild(this.reloadIconSpan);	

	return this;
};

playerVideo.prototype.buildProgressBar = function () {	

	this.progressBarFull = document.createElement('div');
	this.progressBarFull.className = 'progressbar-full';
	this.progressBarFull.setAttribute("name", "progressbar-full");

	this.bufferedBar = document.createElement('div');
	this.bufferedBar.className = 'bufferedbar';
	this.bufferedBar.setAttribute("name", "bufferedbar");

	this.progressBar = document.createElement('div');
	this.progressBar.className = 'progressbar';
	this.progressBar.setAttribute("name", "progressbar");

	this.progressBarBall = document.createElement('div');
	this.progressBarBall.className = 'progressbar-ball';
	this.progressBarBall.setAttribute("name", "progressbar-ball");


	this.progressBar.appendChild(this.progressBarBall);
	this.progressBarFull.appendChild(this.progressBar);
	this.progressBarFull.appendChild(this.bufferedBar);

	this.progressBarContentCenter.appendChild(this.progressBarFull);

	return this;
};

playerVideo.prototype.buildTime = function () {
		
	this.timer = document.createElement('div');
	this.timer.className = 'timer';
	this.timer.innerHTML = '0:00 / 0:00';
	this.timer.setAttribute("name", "timer");
	
	this.componentsContentRight.appendChild(this.timer);

	return this;
};

playerVideo.prototype.buildVolumeButton = function () {

	this.volumeButton = document.createElement('div');
	this.volumeButton.className = 'volume-button';

	this.volumeContent = document.createElement('div');
	this.volumeContent.className = 'volumebar-content';
	this.volumeContent.setAttribute("name", "volumebar-content");

	this.volumeFullBar = document.createElement('div');
	this.volumeFullBar.className = 'volumebar-full';
	this.volumeFullBar.setAttribute("name", "volumebar-full");

	this.volumeBarLevel = document.createElement('div');
	this.volumeBarLevel.className = 'volumebar-level';
	this.volumeBarLevel.setAttribute("name", "volumebar-level");

	this.volumeBarBall = document.createElement('div');
	this.volumeBarBall.className = 'volumebar-ball';
	this.volumeBarBall.setAttribute("name", "volumebar-ball");

	this.iconVolumeSpan = document.createElement('span');
	this.iconVolumeSpan.className = 'icon icon-button icon-volume-high volume-button';
	this.iconVolumeSpan.setAttribute("name", "icon-volume");

		///Volume bar
	this.volumeBarLevel.appendChild(this.volumeBarBall);
	this.volumeFullBar.appendChild(this.volumeBarLevel);
	this.volumeContent.appendChild(this.volumeFullBar);		
	this.volumeButton.appendChild(this.volumeContent);
	this.volumeButton.appendChild(this.iconVolumeSpan);


	this.componentsContentRight.appendChild(this.volumeButton);	

	return this;
};

playerVideo.prototype.buildFunctionButtons = function () {

	this.expandIconSpan = document.createElement('span');
	this.expandIconSpan.className = 'icon icon-button icon-expand';
	this.expandIconSpan.setAttribute("name", "icon-expand");

	this.hdIconSpan = document.createElement('span');
	this.hdIconSpan.className = 'icon icon-button icon-hd';
	this.hdIconSpan.setAttribute("name", "icon-hd");
		
	this.componentsContentRight.appendChild(this.hdIconSpan);
	this.componentsContentRight.appendChild(this.expandIconSpan);

	return this;
};

playerVideo.prototype.createEvents = function () {
	
	self = this;
	
	this.playIconSpan.addEventListener('click', playPauseClick);
	this.reloadIconSpan.addEventListener('click', reloadClick);
	this.player.addEventListener('timeupdate', videoUpdateTime);
	this.player.addEventListener('waiting', playerWaiting);
	this.expandIconSpan.addEventListener('click', expandMinimizeClick);
	this.progressBarFull.addEventListener('mousedown', progressBarClick);
	this.iconVolumeSpan.addEventListener('click', muteUnmuteClick);	
	this.volumeFullBar.addEventListener('mousedown', volumeBarClick);
	this.progressBarBall.addEventListener('mousedown', progressBarBallClick);
	this.player.addEventListener('click', playPauseClick);
	this.root.addEventListener('webkitfullscreenchange', fullScreenChange);
	this.root.addEventListener('mozfullscreenchange', fullScreenChange);
	this.root.addEventListener('fullscreenchange', fullScreenChange);
	this.root.addEventListener('MSFullscreenChange', fullScreenChange);    

	return this;
};

playerVideo.prototype.startVideo = function () {
	playPauseClick(this.root);	
};
			
function fullScreenChange (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);
	switch(element.type) {
		case 'webkitfullscreenchange':
			changeFullScreenIcon(document.webkitIsFullScreen, root);
			break;
		case 'mozfullscreenchange':
			changeFullScreenIcon(document.mozRequestFullScreen, root);
			break;
		case 'fullscreenchange':
			changeFullScreenIcon(document.fullScreen, root);
			break;
		case 'MSFullscreenChange':
			changeFullScreenIcon(document.msIsFullscreen, root);
			break;		
	}
}

function mouseMoveVolume (element) {
	var root = findRoot(element.target);
	var volumeBarBall = getElementsByName(root,'volumebar-ball');
	changeVolume(element);				
}



function mouseMoveProgress (element) {
	var root = findRoot(element.target);	
	var player = findPlayer(root);
	var progressBarFull = getElementsByName(root,'progressbar-full');
	var progressBar = getElementsByName(root,'progressbar');

	player.pause();
	getElementsByName(root,'icon-play').className = 'icon icon-button icon-pause';

	var position;

	var totalPercent = Math.round(((element.pageX - findPosX(progressBarFull)) / progressBarFull.offsetWidth) * 100 );
	//console.log(element)
	//console.log(element)
	//console.log(element.offsetX)
	//console.log(element.layerX)
	console.log(element.x)
	if (totalPercent >= 0 && totalPercent <= 100) {
		progressBar.style.width = totalPercent + '%';
	}			
}

function mouseUpProgress (element) {
	
	var root = findRoot(element.target);	
	var player = findPlayer(root);
	var progressBarFull = getElementsByName(root,'progressbar-full');
	var progressBar = getElementsByName(root,'progressbar');
	var iconPlay = getElementsByName(root,'icon-play');

  	var totalPercent = Math.round(((element.pageX - findPosX(progressBarFull)) / progressBarFull.offsetWidth) * 100 );
			
	root.removeEventListener('mousemove', mouseMoveProgress);			
	root.removeEventListener('mouseup', mouseUpProgress);		

	if (totalPercent >= 0 && totalPercent <= 100) {
		progressBar.style.width = totalPercent + '%';
	}
	player.currentTime =  (totalPercent / 100) * player.duration;
	player.play();
	iconPlay.className = 'icon icon-button icon-pause';
}

function mouseUpVolume (element) {
	var root = findRoot(element.target);
	root.removeEventListener('mousemove', mouseMoveVolume);			
	root.removeEventListener('mouseup', mouseUpVolume);	
}

function playPauseClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var player = findPlayer(root);	

	if (player.paused) {
		getElementsByName(root,'icon-play').className = 'icon icon-button icon-pause';	
		player.play();
	} else {
		getElementsByName(root,'icon-play').className = 'icon icon-button icon-play';
		player.pause();
	}
}

function changeVolume (element) {
	console.log(element)
	var root = findRoot(element.target);
	var volumeFullBar = getElementsByName(root,'volumebar-full');
	var volumeBarLevel = getElementsByName(root,'volumebar-level');
	var iconVolumeSpan = getElementsByName(root,'icon-volume');
	var player = findPlayer(root);

	var offSetY = element.pageY - findPosY(volumeFullBar);
	if (offSetY >= 0 && offSetY <= volumeFullBar.offsetHeight) {
		var percentage = Math.round(((volumeFullBar.offsetHeight - offSetY) / volumeFullBar.offsetHeight) * 100);
		volumeBarLevel.style.height = percentage + '%';
		
		var volume = percentage / 100 * 1.0;
		player.volume = volume;
		
		if (volume <= 0){					
			iconVolumeSpan.className = "icon icon-button icon-volume-muted";
			player.muted = true;
		} else if (percentage <= 50) {
			iconVolumeSpan.className = "icon icon-button icon-volume-low";
			player.muted = false;
		} else {
			iconVolumeSpan.className = "icon icon-button icon-volume-high";
			player.muted = false;
		}
	}		
}

function reloadClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);
	var player = findPlayer(root);
	player.currentTime = 0;
}

function videoUpdateTime (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);
	var player = findPlayer(root);
	var timer = getElementsByName(root,'timer');
	var bufferedBar = getElementsByName(root,'bufferedbar');
	var progressBar = getElementsByName(root,'progressbar');
	var playIcon = getElementsByName(root,'icon-play');

	if (player.buffered.length > 0) {
		var currentTime = player.currentTime.toFixed(1),
		currentMinutes = Math.floor((currentTime / 60) % 60),
		currentSeconds = Math.floor(currentTime % 60);
		
		var durationTime = player.duration.toFixed(1),
		durationMinutes = Math.floor((durationTime / 60) % 60),
		durationSeconds = Math.floor(durationTime % 60);

	if (currentSeconds < 10) {
		currentSeconds = '0' + currentSeconds;
	}

	if (durationSeconds < 10) {
		durationSeconds = '0' + durationSeconds;
	}

	timer.innerHTML = currentMinutes + ':' + currentSeconds + ' / ' + durationMinutes + ':' + durationSeconds;

	bufferedBar.style.width =  Math.round((player.buffered.end(player.buffered.length - 1) / durationTime) * 100) + '%';
		progressBar.style.width = Math.round((currentTime / durationTime) * 100) + '%';		
	}	

	if (player.ended) {
		playIcon.className = 'icon icon-button icon-play';
	}
}
		
function playerWaiting () {
	console.log('buffering');
}

function expandMinimizeClick (element) {	
	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var player = findPlayer(root);

	if(root.requestFullScreen) {
		if (!document.fullScreen) {
			root.requestFullScreen();
		} else {
			document.cancelFullScreen();
		}		
	} else if(root.webkitRequestFullScreen) {
		if (!document.webkitIsFullScreen) {
			root.style.left = "0px";
			root.webkitRequestFullScreen();

		} else {
			document.webkitCancelFullScreen();
		}		
	} else if(root.mozRequestFullScreen) {		
		if (!document.mozIsFullScreen) {
			root.mozRequestFullScreen();
		} else {
			document.mozCancelFullScreen();
		}
	} else if (root.msRequestFullscreen) {
		if (!document.msIsFullscreen) {
			root.msRequestFullscreen();
		} else {
			document.mozCancelFullScreen();
		}
	}
}

function progressBarClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var progressBarBall = getElementsByName(root,'progressbar-ball');		
	var progressBar = getElementsByName(root,'progressbar');		
	var player = findPlayer(root);
	
	if (element.target != progressBarBall) {
		var percentage = (element.offsetX / this.offsetWidth) * 100;
		progressBar.style.width = percentage + '%';
		player.currentTime =  (percentage / 100) * player.duration;
	}						
}

function muteUnmuteClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var player = findPlayer(root);
	var iconVolume = getElementsByName(root,'icon-volume');
	
	if (player.muted) {
		player.muted = false;
		iconVolume.className = 'icon icon-button icon-volume-high';
	} else {
		player.muted = true;
		iconVolume.className = 'icon icon-button icon-volume-muted';
	}			
}

function volumeBarClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);
	var volumeBarBall = getElementsByName(root,'volumebar-ball');
		
	if (element.toElement != volumeBarBall) {
		changeVolume(element);
	}			

	root.addEventListener('mousemove', mouseMoveVolume);
	root.addEventListener('mouseup', mouseUpVolume);
}

function progressBarBallClick(element) {
	var root = findRoot(element.target);
	root.addEventListener('mousemove', mouseMoveProgress);
	root.addEventListener('mouseup', mouseUpProgress);
}

function findRoot (element) {
	if (element.getAttribute('name') == "player-content") {		
		return element;		
	} else {
		return findRoot(element.offsetParent);
	}
}

function findPlayer (element) {
	return element.querySelectorAll('video')[0];
}

function findPosY (element) {
	var top = 0;
	do {
        top += element.offsetTop  || 0;
        element = element.offsetParent;
    } while(element);
    return top;
}

function findPosX (element) {
	var left = 0;
	do {
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);
    return left;
}

function changeFullScreenIcon (event, root) {
	var iconExpand = getElementsByName(root,'icon-expand');
	if (event) {
		iconExpand.className = 'icon icon-button icon-minimize';
	} else {
		iconExpand.className = 'icon icon-button icon-expand';
	}
}

function getElementsByName (element, name) {
	var childs = element.getElementsByTagName("*");
	for (var i = 0; i < childs.length; i++) {
		if (childs[i].getAttribute('name') == name) {
			return childs[i];
		}
	}
	return undefined;
}

window.loadPlayer = function (element) {
	var feedVideo = new playerVideo(element);
};

})();

