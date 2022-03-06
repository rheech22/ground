export default class Tab {
    constructor(element) {
        this.data = [];
        this.button = document.getElementById('addCategory');
        this.modal = document.querySelector('.modalWrapper');
        this.closeButton = document.getElementById('closeModal');
        this.submitButton = document.getElementById('submit');
        this.firstInput = document.getElementById('modalInput1');
        this.secondInput = document.getElementById('modalInput2');
        this.dataContainer = document.createElement('div');
        this.element = element;
        this.button.addEventListener('click', this.popUp.bind(this));
        this.closeButton.addEventListener('click', this.popDown.bind(this));
        this.submitButton.addEventListener('click', this.submit.bind(this));
        this.setModalInputs();
        this.render();
    }
    ;
    popUp() {
        this.modal.style.display = 'flex';
    }
    ;
    popDown() {
        this.firstInput.value = '';
        this.modal.style.display = 'none';
    }
    ;
    submit() {
        if (!this.firstInput.value)
            return;
        this.setData();
        this.popDown();
        this.render();
    }
    ;
}
;
