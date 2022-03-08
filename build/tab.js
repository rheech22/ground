export default class Tab {
    constructor(element) {
        this.modal = document.querySelector('.modalWrapper');
        this.closeButton = document.getElementById('closeModal');
        this.modalForm = document.getElementById('modalForm');
        this.element = element;
        this.dataContainer = this.element.querySelector('.data-container');
        this.addButton = this.element.querySelector('button');
        this.closeButton.addEventListener('click', this.popDown.bind(this));
        this.addButton.addEventListener('click', this.popUp.bind(this));
        this.handleClick = (e) => {
            e.preventDefault();
            let inputValues = [];
            if (e.target instanceof HTMLFormElement) {
                [...e.target.elements].forEach(element => {
                    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                        inputValues.push(element.value);
                    }
                });
            }
            ;
            this.submit(inputValues);
        };
        this.setModalInputs();
        this.render();
    }
    ;
    popUp() {
        this.modal.style.display = 'flex';
    }
    ;
    popDown() {
        this.modal.style.display = 'none';
        [...this.modalForm.elements].forEach(element => {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                if (element.id === 'font') {
                    element.value = '#ffffff';
                    return;
                }
                ;
                if (element.id === 'background') {
                    element.value = '#26de81';
                    return;
                }
                ;
                element.value = '';
            }
            ;
        });
    }
    ;
}
;
