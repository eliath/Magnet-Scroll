magnet_scroll = {
	color: ['#f30010', '#ffa431', '#e4db00', '#1fe400', '#16eac7', '#007AFD', '#9000fd', '#ff5dd7'],

	init: function init() {
		this.$el = $('.scroll-container');
		this.n = this.color.length;
		this.opacity_step = 1/this.n;
		this.currY = 0;
		this.currX = 0;
		
		//Unbind default:
		this.$el.unbind('wheel scroll');
		$(window).unbind('wheel scroll');
		//Bind scroll
		var _this = this;
		if (this.isMobile()) {
			this.prevTouch = {};
			this.$el.on('touchstart', function(e) { _this.mobileScrollStart(e); });
			this.$el.on('touchend', function(e) {	_this.mobileScrollEnd(e);	});
		} else {
			this.$el.on('wheel', function(e) { _this.desktopScroll(e); });
		}
		this.render();
	},

	render: function render() {
		for (var i = 0; i < this.n; i++) {
			var $row = $('<div>', {class: 'row row-'+i}).appendTo(this.$el);
			var c = this.color[i];
			for (var j = 0; j < this.n; j++) {
				var $box = $('<div>', {class: 'box box-'+i+'-'+j}).appendTo($row);
				$box.css({
					background: c,
					opacity: 1 - (this.opacity_step*j)
				});
			}
		}
		this.box_h = $('.box').height();
		this.box_w = $('.box').width();
	},

	isScrolling: false,
	desktopScroll: function desktopScroll(event) {
		console.log('- S C R O L L -\n\tisScrolling:', this.isScrolling);
		event.preventDefault();
		if (event.originalEvent) event.originalEvent.preventDefault();
		
		//When scrolling stops firing, reset boolean
		var _this = this;
		clearTimeout(this.scrollTimer);
		this.scrollTimer = setTimeout(function() { 
			console.log('---RESET scrollTimer---');
			_this.isScrolling = false; 
		}, 75);

		//if scrolling, ignore.
		if (this.isScrolling) return;
		this.isScrolling = true; //set to true!
		
		//update currX and currY
		this.updateX(event);
		this.updateY(event);
		var y = this.box_h * this.currY,
			x = this.box_w * this.currX;
		
		//animate
		this.$el.animate({'scrollTop': y, 'scrollLeft': x}, 400);
	},

	updateX: function updateX(event) {
		if (event.originalEvent.deltaX === 0) return;
		var dir = (event.originalEvent.deltaX < 0) ? -1 : 1;
		console.log('\tdir X:', dir);
		if (dir < 0) {
			if (this.currX === 0) return console.error('Left bound');
			this.currX--;
		} else {
			if (this.currX === this.n-1) return console.error('Right bound');
			this.currX++;
		}
	},

	updateY: function updateY(event) {
		if (event.originalEvent.deltaY === 0) return;
		var dir = (event.originalEvent.deltaY < 0) ? -1 : 1;
		console.log('\tdir Y:', dir);
		if (dir < 0) {
			if (this.currY === 0) return console.error('- CEILING -');
			this.currY--;
		} else {
			if (this.currY === this.n - 1) return console.error('- FLOOR -');
			this.currY++;
		}
	},


	mobileScrollStart: function mobileScrollStart(event) {
		var touch = event.originalEvent.touches[0];
		this.prevTouch.x = touch.clientX;
		this.prevTouch.y = touch.clientY;
	},

	mobileScrollEnd: function mobileScrollEnd(event) {
		this.updateMobileX(event.originalEvent.changedTouches[0].clientX);
		this.updateMobileY(event.originalEvent.changedTouches[0].clientY);
		var y = this.box_h * this.currY,
			x = this.box_w * this.currX;
		
		//animate
		this.$el.animate({'scrollTop': y, 'scrollLeft': x}, 400);
	},

	updateMobileX: function updateMobileX(endX) {
		var prevX = this.prevTouch.x;
		if (prevX < endX - 5) {
			if (this.currX === 0) return console.error('Left bound');
			this.currX--;
		} else if (prevX > endX + 5) {
			if (this.currX === this.n-1) return console.error('Right bound');
			this.currX++;
		}
	},

	updateMobileY: function updateMobileY(endY) {
		var prevY = this.prevTouch.y;
		if (prevY < endY - 5) {
			if (this.currY === 0) return console.error('Ceiling');
			this.currY--;
		} else if (prevY > endY + 5) {
			if (this.currY === this.n-1) return console.error('Floor');
			this.currY++;
		}
	},

	isMobile:function isMobile() {
		var device = navigator.userAgent || navigator.vendor || window.opera;
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(device) || 
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(device.substr(0,4))) {
			return true;
		}
		return false;
	}
};