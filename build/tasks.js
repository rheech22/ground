import Tab from './tab.js';
export default class TaskTab extends Tab {
    constructor(element) {
        super(element);
        this.categories = JSON.parse(localStorage.getItem('categories')) || [];
        this.modalForm.addEventListener('submit', this.handleClick);
        this.render();
    }
    ;
    setModalInputs() {
        this.modalForm.innerHTML = '';
        const label1 = document.createElement('label');
        label1.htmlFor = 'category';
        label1.innerHTML = `
      Label
      <input type="text" id="category" placeholder="Enter a label"/>    
    `;
        const label2 = document.createElement('label');
        label2.htmlFor = 'font';
        label2.innerHTML = `
      Font-Color
      <input type="color" id="font" value="#ffffff"/>
    `;
        const label3 = document.createElement('label');
        label3.htmlFor = 'background';
        label3.innerHTML = `
      Background-Color
      <input type="color" id="background" value="#cc8e35"/>
    `;
        this.modalForm.prepend(label1, label2, label3);
        const button = document.createElement('button');
        button.innerText = 'Add';
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
            localStorage.setItem('categories', JSON.stringify(this.categories));
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
