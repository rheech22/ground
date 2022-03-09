import Tab from './tab.js';
export default class MemoTab extends Tab {
    constructor(element) {
        super(element);
        const data = JSON.parse(localStorage.getItem('memos'));
        this.memos = data || [];
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
        this.memos && this.memos.map(element => {
            const container = document.createElement('div');
            const title = document.createElement('h6');
            const description = document.createElement('p');
            title.innerHTML = element.title;
            description.innerHTML = element.description;
            container.append(title, description);
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
