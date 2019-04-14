
const Data = {
    modal : {
        visible : false,
        current : null,
        content : {}
    }
}
const App = new Vue({

    el : '#app',
    data : Data,

    mounted() {

        let infoSections = document.querySelectorAll('#app > article section')
            infoSections = Array.from(infoSections);
            infoSections.forEach( (el) => {

                Data.modal.content[el.id] = el.innerHTML;
                el.addEventListener('click', (e) => e.stopPropagation() );
            });
            Data.modal.current = infoSections[0].id;

        let infoTriggers = document.querySelectorAll('#app > aside dl dt a');
            infoTriggers = Array.from(infoTriggers);
            infoTriggers.forEach( (el) => {

                el.addEventListener('click', (e) => {
                    e.preventDefault();

                        let _current = el.href.split('#')[1];
                        Data.modal.current = _current;
                        infoSections.forEach( (el) => {
                            el.style.display = 'none';
                        })
                        document.querySelector( `#app > article section#${_current}`).style.display = 'block';

                    this.modalWindowShow();
                });

            });

        let infoCloser = document.querySelector('#app > article > p a');
            infoCloser.addEventListener('click', (e) => {
                e.preventDefault();
                this.modalWindowHide();
            });
            document.querySelector('#app > article').addEventListener('click', () => { this.modalWindowHide() });

    },

    methods : {

        modalWindowShow() {

            document.querySelector('#app > article').classList.add('visible');
            console.log( 'open: ', this.modal.current )
            return true;
        },

        modalWindowHide() {

            document.querySelector('#app > article').classList.remove('visible');
            console.log( 'close: ', this.modal.current )
            return false;
        }


    }

});
