import Tab from './tab.js';
export default class MemoTab extends Tab {
    constructor(element) {
        super(element);
        this.memos = this.load('memos') || [];
        this.dragStartIndex = null;
        this.modalForm.addEventListener('submit', this.handleClick);
        this.render();
    }
    ;
    setModalInputs() {
        this.modalForm.innerHTML = '';
        const label1 = document.createElement('label');
        label1.htmlFor = 'title';
        label1.innerHTML = `
      Title
      <input type="text" id='title'/>    
    `;
        const label2 = document.createElement('label');
        label2.htmlFor = 'description';
        label2.innerHTML = `
      Contents
      <textarea id="description"></textarea>
    `;
        this.modalForm.prepend(label1, label2);
        const button = document.createElement('button');
        button.type = 'submit';
        button.innerText = 'Add';
        this.modalForm.appendChild(button);
    }
    ;
    handleClickDeleteButton(e) {
        const target = e.target;
        const index = parseInt(target.parentElement?.getAttribute('data-index'), 10);
        this.memos = [...this.memos.slice(0, index), ...this.memos.slice(index + 1)];
        this.save({ name: 'memos', data: this.memos });
        this.render();
    }
    ;
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            this.memos.push({
                title: inputValues[0],
                description: inputValues[1]
            });
            this.save({ name: 'memos', data: this.memos });
        }
        ;
        this.popDown();
        this.render();
    }
    ;
    render() {
        this.dataContainer.innerHTML = '';
        this.memos && this.memos.map((element, i) => {
            const container = document.createElement('div');
            const description = document.createElement('p');
            const title = document.createElement('h6');
            const button = document.createElement('button');
            container.append(title, description, button);
            description.innerHTML = element.description;
            title.innerHTML = element.title;
            button.innerHTML = '␡';
            button.addEventListener('click', this.handleClickDeleteButton.bind(this));
            button.classList.add('delete-button');
            button.setAttribute('draggable', 'false');
            this.setDraggable({
                draggableList: container,
                dataName: 'memos',
                dataIndex: i,
                data: this.memos
            });
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
