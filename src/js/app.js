
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
            });
            Data.modal.current = infoSections[0].id;

        let infoTriggers = document.querySelectorAll('#app > aside dl dt a');
            infoTriggers = Array.from(infoTriggers);
            infoTriggers.forEach( (el) => {

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    let _section = el.href.split('#')[1];
                    Data.modal.current = _section;
                    this.modalWindowShow();
                });

            })
    },

    methods : {

        modalWindowShow() {

            console.log( 'open: ', this.modal.current )
            return true;
        },

        modalWindowHide() {
            return false;
        }


    }

});
