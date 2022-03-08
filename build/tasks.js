import Tab from './tab.js';
export default class TaskTab extends Tab {
    constructor(element) {
        super(element);
        this.categories = [];
        this.modalForm.addEventListener('submit', this.handleClick);
    }
    ;
    setModalInputs() {
        this.modalForm.innerHTML = '';
        const label1 = document.createElement('label');
        label1.htmlFor = 'category';
        label1.innerHTML = `
      Category
      <input type="text" id="category"/>    
    `;
        const label2 = document.createElement('label');
        label2.htmlFor = 'font';
        label2.innerHTML = `
      Font
      <input type="color" id="font"/>
    `;
        const label3 = document.createElement('label');
        label3.htmlFor = 'background';
        label3.innerHTML = `
      Background
      <input type="color" id="background"/>
    `;
        this.modalForm.prepend(label1, label2, label3);
        const button = document.createElement('button');
        button.innerText = 'submit';
        button.type = 'submit';
        this.modalForm.appendChild(button);
    }
    submit(inputValues) {
        if (inputValues.length === 3) {
            if (!inputValues[0])
                return;
            this.categories.push({
                title: inputValues[0],
                fontColor: inputValues[1],
                buttonColor: inputValues[2]
            });
        }
        ;
        this.popDown();
        this.render();
    }
    ;
    render() {
        this.dataContainer.innerHTML = '';
        this.categories && this.categories.map(category => {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = category.title;
            button.style.color = category.fontColor;
            button.style.backgroundColor = category.buttonColor;
            this.dataContainer.appendChild(button);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
