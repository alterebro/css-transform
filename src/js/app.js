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
    }
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
        let detailsBlocks = Array.from( document.querySelectorAll('#app > article > section details') );
            detailsBlocks.forEach( (el) => {

                el.addEventListener('click', (e) => {

                    e.preventDefault();
                    let _detailsChildren = Array.from( el.parentNode.querySelectorAll('details') );
                        _detailsChildren.forEach( (_el) => _el.removeAttribute('open') );
                    el.setAttribute('open', '');
                });
            });
    },

	computed : {

		transform() {
			let _items = [];

			// Rotate 2D
			if ( this.rotate2D != 0 && this.rotate2D != 360 && this.rotate2Dactive ) {
				_items.push( 'rotate('+this.rotate2D + 'deg)' );
			}

			// Rotate 3D
			if ( this.rotate3Dactive ) {
				if ( this.rotateX && this.rotateX != 0 ) { _items.push( 'rotateX('+this.rotateX + 'deg)' ) }
				if ( this.rotateY && this.rotateY != 0 ) { _items.push( 'rotateY('+this.rotateY + 'deg)' ) }
				if ( this.rotateZ && this.rotateZ != 0 ) { _items.push( 'rotateZ('+this.rotateZ + 'deg)' ) }
			}

			// TODO : output rotators as oneliner rotate3d(x, y, z, a);

			// Perspective
			if ( this.perspectiveActive ) { _items.push( 'perspective('+this.perspective + 'px)' ) }

			// Scale
			if ( this.scaleActive && this.scale != 1 ) { _items.push('scale('+this.scale+')'); }

			// Translate
			if ( this.translateActive && (this.translateX !=0 || this.translateY !=0) ) {

				_items.push('translate('+this.translateX+'px,'+this.translateY+'px)');
			}

			// Skew
			if ( this.skewActive && (this.skewX !=0 || this.skewY !=0) ) {
				_items.push('skew('+this.skewX+'deg,'+this.skewY+'deg)');
			}

			return _items.join(';\n');
		}

	},

    methods : {

        modalWindowShow() {

            document.querySelector('#app > article').classList.add('visible');
            return true;
        },

        modalWindowHide() {

            document.querySelector('#app > article').classList.remove('visible');
            return true;
        },

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

		// -- Multiple Action
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
		activateAll : function(seriously) { this.transformOriginActive = this.rotate2Dactive = this.rotate3Dactive = this.perspectiveActive = this.scaleActive = this.translateActive = this.skewActive = seriously },

    }

});
