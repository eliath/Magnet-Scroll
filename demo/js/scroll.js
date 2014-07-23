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
		this.$el.on('wheel', function(e) { _this.desktopScroll(e); });
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
		}, 65);

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
	}
};