/* eslint-disable class-methods-use-this */
import { LABEL_BACKGROUND, LABEL_FONT } from './constants/colors.js';
export default class Tab {
    constructor(element) {
        this.dragStartIndex = null;
        this.modal = document.querySelector('.modalWrapper');
        this.element = element;
        this.addButton = this.element.querySelector('.addButton');
        this.dataContainer = this.element.querySelector('.data-container');
        this.addButton.addEventListener('click', this.popUp.bind(this));
        this.modal.addEventListener('click', this.closeModal);
        this.setModalInputs();
        this.render();
    }
    popUp() {
        this.modal.style.display = 'flex';
    }
    popDown() {
        this.modal.style.display = 'none';
        this.resetModal();
    }
    resetModal() {
        const modalForm = this.modal.querySelector('#modalForm');
        [...modalForm.elements].forEach((element) => {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                switch (element.id) {
                    case 'font':
                        element.value = LABEL_FONT;
                        return;
                    case 'background':
                        element.value = LABEL_BACKGROUND;
                        return;
                    default:
                        element.value = '';
                }
            }
        });
    }
    closeModal(e) {
        if (e.currentTarget === e.target) {
            this.popDown();
        }
    }
    submitModalForm(e) {
        e.preventDefault();
        const target = e.target;
        const inputValues = [];
        [...target.elements].forEach((el) => {
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                inputValues.push(el.value);
            }
        });
        this.submit(inputValues);
    }
    saveLocalData({ name, data }) {
        localStorage.setItem(name, JSON.stringify(data));
    }
    loadLocalData(name) {
        return JSON.parse(localStorage.getItem(name));
    }
    deleteLocalData(name) {
        localStorage.removeItem(name);
    }
    setDraggable({ draggableItem, dataName, dataIndex, data, }) {
        draggableItem.classList.add('draggable');
        draggableItem.setAttribute('draggable', 'true');
        draggableItem.setAttribute('data-index', dataIndex.toString());
        draggableItem.addEventListener('dragstart', ({ target }) => {
            const targetElement = target;
            this.dragStartIndex = parseInt(targetElement.getAttribute('data-index'), 10);
        });
        draggableItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        draggableItem.addEventListener('dragenter', ({ target }) => {
            const targetElement = target;
            targetElement.classList.add('over');
        });
        draggableItem.addEventListener('dragleave', ({ target }) => {
            const targetElement = target;
            targetElement.classList.remove('over');
        });
        draggableItem.addEventListener('drop', ({ target }) => {
            const targetElement = target;
            if (!targetElement.classList.contains('draggable')) {
                return;
            }
            const dragEndIndex = parseInt(targetElement.getAttribute('data-index'), 10);
            if (typeof this.dragStartIndex === 'number') {
                const tempData = data[this.dragStartIndex];
                data[this.dragStartIndex] = data[dragEndIndex];
                data[dragEndIndex] = tempData;
                this.saveLocalData({ name: dataName, data });
                this.render();
            }
        });
    }
}
