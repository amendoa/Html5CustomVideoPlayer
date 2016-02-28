
(function() {
'use strict';

	var svgns = "http://www.w3.org/2000/svg";
	var xlinkns = "http://www.w3.org/1999/xlink";

	function playerVideo (selector) {
		this.init(selector);
	}

	playerVideo.prototype.init = function (selector) {
		var elements = document.querySelectorAll(selector);

		if (elements.length < 1) {
			return;
		}

		for (var i = 0; i < elements.length; i++) {
			this.build(elements[i]);
		}
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
			.createEvents();			
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
	}

	playerVideo.prototype.buildControlsButtons = function () {	

		this.playIconSpan = document.createElement('span');
		this.playIconSpan.className = 'icon icon-play';
		this.playIconSpan.setAttribute("tabindex", "1");
		this.playIconSVG = document.createElementNS(svgns,'svg');	
		this.playIconUse = document.createElementNS(svgns, 'use');
		this.playIconUse.setAttributeNS(xlinkns, "xlink:href", "#play");

		this.reloadIconSpan = document.createElement('span');
		this.reloadIconSpan.className = 'icon icon-reload';
		this.reloadIconSVG = document.createElementNS(svgns,'svg');	
		this.reloadIconUse = document.createElementNS(svgns, 'use');
		this.reloadIconUse.setAttributeNS(xlinkns, "xlink:href", "#reload");

		this.reloadIconSVG.appendChild(this.reloadIconUse);
		this.reloadIconSpan.appendChild(this.reloadIconSVG);

		this.playIconSVG.appendChild(this.playIconUse);
		this.playIconSpan.appendChild(this.playIconSVG);
		
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
		
		this.componentsContentRight.appendChild(this.timer);

		return this;
	}

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
		this.iconVolumeSpan.className = 'icon icon-volume-high volume-button';
		this.iconVolumeSVG = document.createElementNS(svgns,'svg');	
		this.iconVolumeUse = document.createElementNS(svgns, 'use');
		this.iconVolumeUse.setAttributeNS(xlinkns, "xlink:href", "#volume-high");

		//Volume svg icon	
		this.iconVolumeSVG.appendChild(this.iconVolumeUse);
		this.iconVolumeSpan.appendChild(this.iconVolumeSVG);

		///Volume bar
		this.volumeBarLevel.appendChild(this.volumeBarBall);
		this.volumeFullBar.appendChild(this.volumeBarLevel);
		this.volumeContent.appendChild(this.volumeFullBar);		
		this.volumeButton.appendChild(this.volumeContent);
		this.volumeButton.appendChild(this.iconVolumeSpan)


		this.componentsContentRight.appendChild(this.volumeButton);	

		return this;
	}

	playerVideo.prototype.buildFunctionButtons = function () {

		this.expandIconSpan = document.createElement('span');
		this.expandIconSpan.className = 'icon icon-expand';
		this.expandIconSVG = document.createElementNS(svgns,'svg');	
		this.expandIconUse = document.createElementNS(svgns, 'use');
		this.expandIconUse.setAttributeNS(xlinkns, "xlink:href", "#expand");

		this.hdIconSpan = document.createElement('span');
		this.hdIconSpan.className = 'icon icon-hd';
		this.hdIconSVG = document.createElementNS(svgns,'svg');	
		this.hdIconUse = document.createElementNS(svgns, 'use');
		this.hdIconUse.setAttributeNS(xlinkns, "xlink:href", "#hd");

		this.hdIconSVG.appendChild(this.hdIconUse);
		this.hdIconSpan.appendChild(this.hdIconSVG);

		this.expandIconSVG.appendChild(this.expandIconUse);
		this.expandIconSpan.appendChild(this.expandIconSVG);
		
		this.componentsContentRight.appendChild(this.hdIconSpan);
		this.componentsContentRight.appendChild(this.expandIconSpan);

		return this;
	}


	playerVideo.prototype.createEvents = function () {		
		
		self = this;

		this.playIconSpan.addEventListener('click', function (){
			if (self.player.paused) {			
				this.className = 'icon icon-pause'
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#pause");
				self.player.play();
			} else {
				this.className = 'icon icon-play'
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#play");
				self.player.pause();
			}
		});

		this.reloadIconSpan.addEventListener('click', function () {
			self.player.currentTime = 0;
		});

		this.player.addEventListener('timeupdate', function () {
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
				self.playIconSpan.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#play");
			}
		});

		this.player.addEventListener('waiting', function () {
			console.log('buffering')
		});

		this.expandIconSpan.addEventListener('click', function () {		
			if (!document.webkitIsFullScreen) {
				self.player.webkitRequestFullScreen();
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#retract");
			} else {
				document.webkitCancelFullScreen();
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#expand");
			}
		});

		this.progressBarFull.addEventListener('mousedown', function(element) {
			if (this == element.target) {
				self.progressBar.style.width =  (element.offsetX / this.offsetWidth) * 100+'%';
			}
		});

		this.progressBarFull.addEventListener('click', function(element) {
			if (element.toElement != self.progressBarBall) {
				var offsetWidth = this.offsetWidth,
				offsetX = element.offsetX;
				var per = (offsetX / offsetWidth).toFixed(3);

				var duration = isNaN(self.player.duration) ? 0 : self.player.duration;
				self.player.currentTime = (duration * per).toFixed(0);

				self.progressBar.style.width =  (offsetX / offsetWidth) * 100 + '%';

				var newMargLeft = element.pageX - this.offsetLeft;
			}		
		});
		
		this.iconVolumeSpan.addEventListener('click', function (element) {

			if (self.player.muted) {
				self.player.muted = false;
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#volume-high");

			} else {
				self.player.muted = true;
				this.children[0].children[0].setAttributeNS(xlinkns, "xlink:href", "#volume-muted");
			}
			
		});			
		
		this.volumeFullBar.addEventListener('mousedown', function(element) {
			if (element.toElement != self.volumeBarBall) {				
				changeVolume(element.pageY);
			}			

			self.root.addEventListener('mousemove', mouseMoveVolume);
			self.root.addEventListener('mouseup', mouseUpVolume);
		});

		this.progressBar.addEventListener('mousedown', function (e) {
			self.root.addEventListener('mousemove', mouseMoveProgress);
			self.root.addEventListener('mouseup', mouseUpProgress);
		}); 

		function mouseMoveVolume (element) {
			changeVolume(element.pageY);		
		}

		function mouseMoveProgress (e) {
			self.player.pause();
			console.log(e)
			console.log(e.pageX)
			var positionX = e.pageX - ((self.progressBarFull.offsetLeft * 2) - self.progressBarFull.offsetHeight);
			var totalPercent = (positionX / self.progressBarFull.offsetWidth ) * 100;
			if (totalPercent >= 0 && totalPercent <= 100) {
				self.progressBar.style.width = Math.round(totalPercent) + '%';
			}			
		}

	    function mouseUpProgress (element) {
	    	console.log(element)
	    	console.log('mouseUpProgress')
			self.root.removeEventListener('mousemove', mouseMoveProgress);			
			self.root.removeEventListener('mouseup', mouseUpProgress);		

			var positionX = element.pageX - ((self.progressBarFull.offsetLeft * 2) - self.progressBarFull.offsetHeight);
			var totalPercent = (positionX / self.progressBarFull.offsetWidth ) * 100;
			if (totalPercent >= 0 && totalPercent <= 100) {
				self.progressBar.style.width = Math.round(totalPercent) + '%';
			}
			self.player.currentTime =  (Math.round(totalPercent) / 100) * self.player.duration;
			self.player.play();			
		};

		function mouseUpVolume (element) {

			self.root.removeEventListener('mousemove', mouseMoveVolume);			
			self.root.removeEventListener('mouseup', mouseUpVolume);	
		};


		
		return this;
	};

	function findPosY (element) {
		var current = element.offsetTop;
		while(element = element.offsetParent) {
			current += element.offsetTop;
		}
		return current;
	}

	function changeVolume (pageY) {
		var offSetY = pageY - findPosY(self.volumeFullBar);
		if (offSetY >= 0 && offSetY <= self.volumeFullBar.offsetHeight) {
			var percentage = Math.round(((self.volumeFullBar.offsetHeight - offSetY) / self.volumeFullBar.offsetHeight) * 100);
			self.volumeBarLevel.style.height = percentage + '%';
				
			var volume = percentage / 100 * 1.0
			self.player.volume = volume;
		}		
	}

	new playerVideo('.video-player');


})();
