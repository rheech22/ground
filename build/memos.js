import Tab from './tab.js';
export default class MemoTab extends Tab {
    constructor(element) {
        super(element);
        this.memos = this.loadLocalData('memos') || [];
        this.dragStartIndex = null;
        this.render();
    }
    setModalInputs() {
        this.modal.innerHTML = '';
        const template = `
      <div class="modal">
        <button id="closeModal">_</button>
        <form id="modalForm">
          <label for="title">
            Title
            <input type="text" id='title'/>    
          </label>
          <label for="description">
            Contents
            <textarea id="description"></textarea>
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    `;
        this.modal.innerHTML = template;
        const modalForm = this.modal.querySelector('#modalForm');
        const closeButton = this.modal.querySelector('#closeModal');
        modalForm.addEventListener('submit', this.submitModalForm.bind(this));
        closeButton.addEventListener('click', this.closeModal.bind(this));
    }
    handleClickDeleteButton(e) {
        const target = e.target;
        const index = parseInt(target.parentElement?.getAttribute('data-index'), 10);
        this.memos = [...this.memos.slice(0, index), ...this.memos.slice(index + 1)];
        this.saveLocalData({ name: 'memos', data: this.memos });
        this.render();
    }
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            this.memos.push({
                title: inputValues[0],
                description: inputValues[1],
            });
            this.saveLocalData({ name: 'memos', data: this.memos });
        }
        this.popDown();
        this.render();
    }
    render() {
        this.dataContainer.innerHTML = '';
        this.memos && this.memos.forEach((element, i) => {
            const container = document.createElement('div');
            const description = document.createElement('p');
            const title = document.createElement('h6');
            const button = document.createElement('button');
            container.classList.add('memo-container');
            container.append(title, description, button);
            description.innerHTML = element.description;
            title.innerHTML = element.title;
            button.innerHTML = '␡';
            button.addEventListener('click', this.handleClickDeleteButton.bind(this));
            button.classList.add('delete-button');
            button.setAttribute('draggable', 'false');
            this.setDraggable({
                draggableItem: container,
                dataName: 'memos',
                dataIndex: i,
                data: this.memos,
            });
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
