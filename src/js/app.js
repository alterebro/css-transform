
const chainTimeout = function(fn, t) {

	// SetTimeout Replacement using requestAnimationFrame
	function requestTimeout(func, delay) {

		let start = new Date().getTime();
		let handle = null;
		let loop = () => { ( (new Date().getTime() - start) >= delay ) ? func.call() : handle = requestAnimationFrame(loop) };
		    handle = requestAnimationFrame(loop);
		return handle;
	}

	// ---

	let queue = []
	let self = null;
	let timer = null;

    function schedule(fn, t) {

		timer = requestTimeout( function() {

			timer = null;
			fn.call();
		    if (queue.length) {
                let item = queue.shift();
                schedule(item.fn, item.t);
            }

		}, t);
    }

    self = {

        chainTimeout: function(fn, t) {
			(queue.length || timer) ? queue.push({fn: fn, t: t}) : schedule(fn, t);
            return self;
        },
        clear: function() {
			cancelAnimationFrame(timer);
            queue = [];
            return self;
        }
    };

    return self.chainTimeout(fn, t);
}


// Sampling ...
let a = 0;
let z = chainTimeout( function() {
		a = new Date().getTime()
		console.log(0, a)
	}, 0 )
	.chainTimeout( function() { console.log('a', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() { console.log('b', new Date().getTime() - a ) }, 500)
	.chainTimeout( function() { console.log('c', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() { console.log('d', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() {
		b = new Date().getTime()
		console.log( b - a );
		z.clear();
		console.log(z);
		console.log('cancel?')
	}, 500)
	.chainTimeout( function() { console.log('a', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() { console.log('b', new Date().getTime() - a ) }, 500)
	.chainTimeout( function() { console.log('c', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() { console.log('d', new Date().getTime() - a ) }, 500)
    .chainTimeout( function() {
		b = new Date().getTime()
		console.log( b - a )
	}, 500);



const randomInt = function(min, max) {
	// Returns a random integer between @min and @max (inclusive)
	let _max = parseInt(max);
	let _min = parseInt(min);
	return Math.floor(Math.random() * ((_max - _min) + 1)) + _min;
}

const Data = {

    rotate2Dactive : false,
    rotate2D : 10,

    rotate3Dactive : false,
	rotateX : 35,
	rotateY : 35,
	rotateZ : 0,

    perspectiveActive : false,
	perspective : 700,

    transformOriginActive : false,
	transformOriginX : 50,
	transformOriginY : 50,
	transformOriginZ : -70,

    scaleActive : false,
	scale : 1.2,

	translateActive : false,
	translateX : -10,
	translateY : -20,

	skewActive : false,
	skewX : 5,
	skewY : 5,

    modal : {
        visible : false,
        current : null
    },

	sidebar : false,
	cssOutput : false
}

const App = new Vue({

    el : '#app',
    data : Data,

    mounted() {

        let infoSections = Array.from( document.querySelectorAll('#app > article section') );
            infoSections.forEach( (el) => {
                el.addEventListener('click', (e) => e.stopPropagation() );
            });

        let infoTriggers = Array.from( document.querySelectorAll('#app > aside dl dt a') );
            infoTriggers.forEach( (el) => {

                el.addEventListener('click', (e) => {
                    e.preventDefault();

                        let _current = el.href.split('#')[1];
                        this.modal.current = _current;
                        infoSections.forEach( (el) => el.style.display = 'none' );
                        document.querySelector( `#app > article section#${_current}`).style.display = 'block';

                    this.modalWindowShow();
                });
            });

        // Modal window close handlers
        let infoCloser = document.querySelector('#app > article > p a');
            infoCloser.addEventListener('click', (e) => {
                e.preventDefault();
                this.modalWindowHide();
            });
            document.querySelector('#app > article').addEventListener('click', () => this.modalWindowHide() );

        // Accordion
		// TODO : Close when only one is open
        let detailsBlocks = Array.from( document.querySelectorAll('#app > article > section details summary') );
            detailsBlocks.forEach( (el) => {

                el.addEventListener('click', (e) => {

                    e.preventDefault();
                    let _detailsChildren = Array.from( el.parentNode.parentNode.querySelectorAll('details') );
                        _detailsChildren.forEach( (_el) => _el.removeAttribute('open') );
                    el.parentNode.setAttribute('open', '');
                });
            });

    },

	computed : {

		styleObject() {

			const _styles = {
				'transform' : [],
				'transform-origin' : null
			};

			let _trFunctions = [];

				// Rotate 2D
				if ( this.rotate2D != 0 && this.rotate2D != 360 && this.rotate2Dactive ) { _trFunctions.push( 'rotate('+this.rotate2D + 'deg)' ) }

				// Rotate 3D
				if ( this.rotate3Dactive ) {
					if ( this.rotateX && this.rotateX != 0 ) { _trFunctions.push( 'rotateX('+this.rotateX + 'deg)' ) }
					if ( this.rotateY && this.rotateY != 0 ) { _trFunctions.push( 'rotateY('+this.rotateY + 'deg)' ) }
					if ( this.rotateZ && this.rotateZ != 0 ) { _trFunctions.push( 'rotateZ('+this.rotateZ + 'deg)' ) }
				}

				// Perspective
				if ( this.perspectiveActive ) { _trFunctions.push( 'perspective('+this.perspective + 'px)' ) }

				// Scale
				if ( this.scaleActive && this.scale != 1 ) { _trFunctions.push('scale('+this.scale+')') }

				// Translate
				if ( this.translateActive && (this.translateX !=0 || this.translateY !=0) ) { _trFunctions.push('translate('+this.translateX+'px,'+this.translateY+'px)') }

				// Skew
				if ( this.skewActive && (this.skewX !=0 || this.skewY !=0) ) { _trFunctions.push('skew('+this.skewX+'deg,'+this.skewY+'deg)') }

			_styles['transform'] = _trFunctions;


			if ( this.transformOriginActive ) {

				let _x = { 0 : 'left', 50 : 'center', 100 : 'right' };
				let _y = { 0 : 'top', 50 : 'center', 100 : 'bottom' };

				let origin_x = ( this.transformOriginX == 0 || this.transformOriginX == 50 || this.transformOriginX == 100 )
					? _x[this.transformOriginX]
					: this.transformOriginX+'%';

				let origin_y = ( this.transformOriginY == 0 || this.transformOriginY == 50 || this.transformOriginY == 100 )
					? _y[this.transformOriginY]
					: this.transformOriginY+'%';

				let output = origin_x + ' ' + origin_y;
				 	output = ( this.transformOriginZ && this.transformOriginZ != 0 ) ? output + ' ' + this.transformOriginZ + 'px' : output;

				_styles['transform-origin'] = output;
			}

			return _styles;
		},

		styleClass() {
			return {
				'transform' : this.styleObject.transform.join(' '),
				'transformOrigin' : (this.styleObject['transform-origin']) ? this.styleObject['transform-origin'] : ''
			}
		},

		hasStyle() {
			return (this.styleObject.transform.length > 0) || (this.styleObject['transform-origin'] != null);
		}

	},

	filters : {

		stringOutput(obj) {

			let _output = [];

				if ( !!obj['transform'].length ) { _output.push( `transform: ${obj['transform'].join('\n\t\t')};` ) }
				if ( !!obj['transform-origin'] ) { _output.push( `transform-origin: ${obj['transform-origin']};` ) }

			return (_output.length) ? `element {\n\t${_output.join('\n\t')}\n}` : '';
		}

	},

    methods : {

		// ------------------
		// - Modal Info Window
        modalWindowShow() { document.querySelector('#app > article').classList.add('visible') },
        modalWindowHide() { document.querySelector('#app > article').classList.remove('visible') },

		// ------------------
		// - Sidebar
		openSidebar() { this.sidebar = true },
		closeSidebar() { this.sidebar = false },

		// ------------------
		// - CSS Output
		toggleCSSOutput() { this.cssOutput = !this.cssOutput },

		// ------------------
		// - Transform Functions

		// Rotate 2D
		randomRotate2D() { this.rotate2D = randomInt(0, 359) },
        resetRotate2D() { this.rotate2D = 0 },

		// Rotate 3D
		randomRotate3D() {
			this.rotateX = randomInt(0, 359);
			this.rotateY = randomInt(0, 359);
			this.rotateZ = randomInt(0, 359);
		},
		resetRotate3D() { this.rotateX = this.rotateY = this.rotateZ = 0; },

		// Perspective
		randomPerspective() { this.perspective = (randomInt(3, 23) * 100) },
		resetPerspective() { this.perspective = 700 },

		// Transform Origin
		randomTransformOrigin() {
			this.transformOriginX = randomInt(0, 100);
			this.transformOriginY = randomInt(0, 100);
			this.transformOriginZ = randomInt(-250, 250);
		},
		resetTransformOrigin() {
			this.transformOriginX = this.transformOriginY = 50;
			this.transformOriginZ = 0;
		},

		// Scale
		randomScale() { this.scale = (randomInt(5, 20) / 10) },
		resetScale() { this.scale = 1; },

		// Translate
		randomTranslate() {
			this.translateX = (randomInt(-10, 10) * 10);
			this.translateY = (randomInt(-10, 10) * 10);
		},
		resetTranslate() { this.translateX = this.translateY = 0 },

		// Skew
		randomSkew() {
			this.skewX = randomInt(0, 180);
			this.skewY = randomInt(0, 180);
		},
		resetSkew() { this.skewX = this.skewY = 0 },

		// ------------------
		// - Multiple Transform Action
		randomAll : function() {
			this.randomTransformOrigin();
			this.randomRotate2D();
			this.randomRotate3D();
			this.randomPerspective();
			this.randomScale();
			this.randomTranslate();
			this.randomSkew();
		},
		resetAll : function() {
			this.resetTransformOrigin();
			this.resetRotate2D();
			this.resetRotate3D();
			this.resetPerspective();
			this.resetScale();
			this.resetTranslate();
			this.resetSkew();
		},
		activateAll : function(seriously) { this.transformOriginActive = this.rotate2Dactive = this.rotate3Dactive = this.perspectiveActive = this.scaleActive = this.translateActive = this.skewActive = seriously }

    }

});
