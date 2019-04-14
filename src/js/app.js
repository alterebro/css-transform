
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

    methods : {

        modalWindowShow() {

            document.querySelector('#app > article').classList.add('visible');
            return true;
        },

        modalWindowHide() {

            document.querySelector('#app > article').classList.remove('visible');
            return true;
        }
    }

});
