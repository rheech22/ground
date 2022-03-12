export default class Tab {
    constructor(element) {
        this.modal = document.querySelector('.modalWrapper');
        this.closeButton = document.getElementById('closeModal');
        this.modalForm = document.getElementById('modalForm');
        const handleCloseModal = (e) => {
            if (e.currentTarget === e.target) {
                this.popDown();
            }
        };
        this.element = element;
        this.dragStartIndex = null;
        this.dataContainer = this.element.querySelector('.data-container');
        this.addButton = this.element.querySelector('button');
        this.modal.addEventListener('click', handleCloseModal);
        this.closeButton.addEventListener('click', handleCloseModal);
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
                    element.value = '#cc8e35';
                    return;
                }
                ;
                element.value = '';
            }
            ;
        });
    }
    ;
    setDraggable({ draggableList, dataName, dataIndex, data }) {
        draggableList.classList.add('draggable');
        draggableList.setAttribute('draggable', 'true');
        draggableList.setAttribute('data-index', dataIndex.toString());
        draggableList.addEventListener('dragstart', ({ target }) => {
            const targetElement = target;
            this.dragStartIndex = parseInt(targetElement.getAttribute('data-index'), 10);
        });
        draggableList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        draggableList.addEventListener('dragenter', ({ target }) => {
            const targetElement = target;
            targetElement.classList.add('over');
        });
        draggableList.addEventListener('dragleave', ({ target }) => {
            const targetElement = target;
            targetElement.classList.remove('over');
        });
        draggableList.addEventListener('drop', ({ target }) => {
            const targetElement = target;
            const dragEndIndex = parseInt(targetElement.getAttribute('data-index'), 10);
            if (typeof this.dragStartIndex === 'number') {
                const tempData = data[this.dragStartIndex];
                data[this.dragStartIndex] = data[dragEndIndex];
                data[dragEndIndex] = tempData;
                localStorage.setItem(dataName, JSON.stringify(data));
                this.render();
            }
            ;
        });
    }
}
;
