
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

	this.reloadIconSpan = document.createElement('span');
	this.reloadIconSpan.className = 'icon icon-button icon-restart';

	this.componentsContentLeft.appendChild(this.playIconSpan);	
	this.componentsContentLeft.appendChild(this.reloadIconSpan);	

	return this;
};

playerVideo.prototype.buildProgressBar = function () {	

	this.progressBarFull = document.createElement('div');
	this.progressBarFull.className = 'progressbar-full';

	this.bufferedBar = document.createElement('div');
	this.bufferedBar.className = 'bufferedbar';

	this.progressBar = document.createElement('div');
	this.progressBar.className = 'progressbar';

	this.progressBarBall = document.createElement('div');
	this.progressBarBall.className = 'progressbar-ball';


	this.progressBar.appendChild(this.progressBarBall);
	this.progressBarFull.appendChild(this.progressBar);
	this.progressBarFull.appendChild(this.bufferedBar);

	this.progressBarContentCenter.appendChild(this.progressBarFull);

	return this;
};

playerVideo.prototype.buildTime = function () {
		
	this.timer = document.createElement('span');
	this.timer.className = 'timer';
	this.timer.innerHTML = '0:00 / 0:00';
	//this.timer.setAttribute("unselectable","on");
	this.timer.onselectstart = function() { return(false); };
	this.timer.setAttribute('unselectable', 'on', 0);
	
	this.componentsContentRight.appendChild(this.timer);

		return this;
	};

playerVideo.prototype.buildVolumeButton = function () {

	this.volumeButton = document.createElement('div');
	this.volumeButton.className = 'volume-button';

	this.volumeContent = document.createElement('div');
	this.volumeContent.className = 'volumebar-content';

	this.volumeFullBar = document.createElement('div');
	this.volumeFullBar.className = 'volumebar-full';

	this.volumeBarLevel = document.createElement('div');
	this.volumeBarLevel.className = 'volumebar-level';

	this.volumeBarBall = document.createElement('div');
	this.volumeBarBall.className = 'volumebar-ball';

	this.iconVolumeSpan = document.createElement('span');
	this.iconVolumeSpan.className = 'icon icon-button icon-volume-high volume-button';

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

	this.hdIconSpan = document.createElement('span');
	this.hdIconSpan.className = 'icon icon-button icon-hd';
		
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
	changeVolume(element.pageY);		
}

function mouseMoveProgress (e) {
	self.player.pause();
	self.playIconSpan.className = 'icon icon-button icon-play';
		
	var totalPercent = Math.round(((e.pageX - findPosX(self.progressBarFull)) / self.progressBarFull.offsetWidth) * 100 );

	if (totalPercent >= 0 && totalPercent <= 100) {
		self.progressBar.style.width = totalPercent + '%';
	}			
}

function mouseUpProgress (element) {
	    	
  	var totalPercent = Math.round(((element.pageX - findPosX(self.progressBarFull)) / self.progressBarFull.offsetWidth) * 100 );
			
	self.root.removeEventListener('mousemove', mouseMoveProgress);			
	self.progressBarFull.removeEventListener('mouseup', mouseUpProgress);		

	if (totalPercent >= 0 && totalPercent <= 100) {
		self.progressBar.style.width = totalPercent + '%';
	}
	self.player.currentTime =  (totalPercent / 100) * self.player.duration;
	self.player.play();
	self.playIconSpan.className = 'icon icon-button icon-pause';
}

function mouseUpVolume (element) {
	self.root.removeEventListener('mousemove', mouseMoveVolume);			
	self.root.removeEventListener('mouseup', mouseUpVolume);	
}

function playPauseClick (element) {
	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var player = findPlayer(root);	

	if (player.paused) {
		root.getElementsByClassName('icon icon-button icon-play')[0].className = 'icon icon-button icon-pause';	
		player.play();
	} else {
		root.getElementsByClassName('icon icon-button icon-pause')[0].className = 'icon icon-button icon-play';
		player.pause();
	}
}

function changeVolume (pageY) {
	var offSetY = pageY - findPosY(self.volumeFullBar);
	if (offSetY >= 0 && offSetY <= self.volumeFullBar.offsetHeight) {
		var percentage = Math.round(((self.volumeFullBar.offsetHeight - offSetY) / self.volumeFullBar.offsetHeight) * 100);
		self.volumeBarLevel.style.height = percentage + '%';
					
		var volume = percentage / 100 * 1.0;
		self.player.volume = volume;
				
		if (volume <= 0){					
			self.iconVolumeSpan.className = "icon icon-button icon-volume-muted";
			self.player.muted = true;
		} else if (percentage <= 50) {
			self.iconVolumeSpan.className = "icon icon-button icon-volume-low";
			self.player.muted = false;
		} else {
			self.iconVolumeSpan.className = "icon icon-button icon-volume-high";
			self.player.muted = false;
		}
	}		
}

function reloadClick () {
	self.player.currentTime = 0;
}

function videoUpdateTime () {
	if (self.player.buffered.length > 0) {
		var currentTime = self.player.currentTime.toFixed(1),
		currentMinutes = Math.floor((currentTime / 60) % 60),
		currentSeconds = Math.floor(currentTime % 60);
		var durationTime = self.player.duration.toFixed(1),
		durationMinutes = Math.floor((durationTime / 60) % 60),
		durationSeconds = Math.floor(durationTime % 60);

	if (currentSeconds < 10) {
		currentSeconds = '0' + currentSeconds;
	}

	if (durationSeconds < 10) {
		durationSeconds = '0' + durationSeconds;
	}

	self.timer.innerHTML = currentMinutes + ':' + currentSeconds + ' / ' + durationMinutes + ':' + durationSeconds;

	self.bufferedBar.style.width =  Math.round((self.player.buffered.end(self.player.buffered.length - 1) / durationTime) * 100) + '%';
		self.progressBar.style.width = Math.round((currentTime / durationTime) * 100) + '%';		
	}	

	if (self.player.ended) {
		self.playIconSpan.className = 'icon icon-button icon-play';
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
	if (element.target != self.progressBarBall) {
		var percentage = (element.offsetX / this.offsetWidth) * 100;
		self.progressBar.style.width = percentage + '%';
		self.player.currentTime =  (percentage / 100) * self.player.duration;
	}						
}

function muteUnmuteClick (element) {

	var root = findRoot(element instanceof HTMLElement ? element: this);		
	var player = findPlayer(root);
	
	if (player.muted) {
		player.muted = false;
		root.getElementsByClassName('icon icon-button icon-volume-muted')[0].className = 'icon icon-button icon-volume-high';
	} else {
		player.muted = true;
		root.getElementsByClassName('icon icon-button icon-volume-high')[0].className = 'icon icon-button icon-volume-muted';
	}			
}

function volumeBarClick (element) {
	if (element.toElement != self.volumeBarBall) {				
		changeVolume(element.pageY);
	}			

	self.root.addEventListener('mousemove', mouseMoveVolume);
	self.root.addEventListener('mouseup', mouseUpVolume);
}

function progressBarBallClick() {
	self.root.addEventListener('mousemove', mouseMoveProgress);
	self.progressBarFull.addEventListener('mouseup', mouseUpProgress);
}

function findRoot (element) {
	if (element.className == "player-content") {		
		return element;		
	} else {
		return findRoot(element.offsetParent);
	}
}

function findPlayer (element) {
	return element.querySelectorAll('video')[0];
}

function findPosY (element) {
	var current = element.offsetTop;
	while(element = element.offsetParent) {
		current += element.offsetTop;
	}
	return current;
}

function findPosX (element) {
	var current = element.offsetLeft;
	while(element = element.offsetParent) {
		current += element.offsetLeft;
	}
	return current;
}

function changeFullScreenIcon (event, root) {
	console.log(event)
	if (event) {
		root.getElementsByClassName('icon icon-button icon-expand')[0].className = 'icon icon-button icon-minimize';
	} else {
		root.getElementsByClassName('icon icon-button icon-minimize')[0].className = 'icon icon-button icon-expand';
	}
}

window.loadPlayer = function (element) {
	var feedVideo = new playerVideo(element);
};

})();

