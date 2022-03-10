import Tab from './tab.js';
export default class MemoTab extends Tab {
    constructor(element) {
        super(element);
        const data = JSON.parse(localStorage.getItem('memos'));
        this.memos = data || [];
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
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            this.memos.push({
                title: inputValues[0],
                description: inputValues[1]
            });
            localStorage.setItem('memos', JSON.stringify(this.memos));
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
            container.setAttribute('draggable', 'true');
            container.setAttribute('data-index', i.toString());
            container.append(title, description);
            container.addEventListener('dragstart', ({ target }) => {
                const targetElement = target;
                const dragStartStringIndex = target instanceof HTMLDivElement ? targetElement.getAttribute('data-index')
                    : targetElement.parentElement.getAttribute('data-index');
                this.dragStartIndex = parseInt(dragStartStringIndex, 10);
            });
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            container.addEventListener('dragenter', ({ target }) => {
                const targetElement = target;
                targetElement.classList.add('over');
            });
            container.addEventListener('dragleave', ({ target }) => {
                const targetElement = target;
                targetElement.classList.remove('over');
            });
            container.addEventListener('drop', ({ target }) => {
                const targetElement = target;
                const dragEndStringIndex = target instanceof HTMLDivElement ? targetElement.getAttribute('data-index')
                    : targetElement.parentElement.getAttribute('data-index');
                const dragEndIndex = parseInt(dragEndStringIndex, 10);
                console.log(this.dragStartIndex, dragEndIndex);
                if (typeof this.dragStartIndex === 'number') {
                    const temp = this.memos[this.dragStartIndex];
                    this.memos[this.dragStartIndex] = this.memos[dragEndIndex];
                    this.memos[dragEndIndex] = temp;
                    localStorage.setItem('memos', JSON.stringify(this.memos));
                    this.render();
                }
                ;
            });
            description.innerHTML = element.description;
            title.innerHTML = element.title;
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
