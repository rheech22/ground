import Tab from './tab.js';
export default class TaskTab extends Tab {
    constructor(element) {
        super(element);
        this.categories = this.load('categories') || [];
        this.selectedCategory = this.categories.length ? this.categories[0].title : '';
        this.tasks = this.selectedCategory ? this.load(this.selectedCategory) : [];
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
    ;
    handleClickCategory(e) {
        const button = e.target;
        const category = button.innerText;
        [...document.querySelectorAll('.selected')]
            .forEach(element => element.classList.remove('selected'));
        button.classList.add('selected');
        this.selectedCategory = category;
        this.tasks = this.load(this.selectedCategory) || [];
        this.render();
    }
    ;
    handleClickTaskSubmit(e) {
        e.preventDefault();
        if (!this.selectedCategory)
            return;
        const form = e.target;
        const input = form.elements[0];
        this.tasks.push(input.value);
        this.save({ name: this.selectedCategory, data: this.tasks });
        input.value = '';
        this.render();
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
            this.save({ name: 'categories', data: this.categories });
            this.save({ name: inputValues[0], data: [] });
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
            button.classList.add('categories');
            button.addEventListener('click', this.handleClickCategory.bind(this));
            if (category.title === this.selectedCategory) {
                button.classList.add('selected');
            }
            ;
            this.dataContainer.appendChild(button);
        });
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'add task';
        const button = document.createElement('button');
        button.type = 'submit';
        button.innerText = 'Add';
        form.append(input, button);
        form.addEventListener('submit', this.handleClickTaskSubmit.bind(this));
        this.dataContainer.appendChild(form);
        const ul = document.createElement('ul');
        ul.classList.add('draggable-list');
        this.tasks && this.tasks.map((task, i) => {
            const li = document.createElement('li');
            li.innerHTML = task;
            ul.appendChild(li);
            this.setDraggable({
                draggableList: li,
                dataName: this.selectedCategory,
                dataIndex: i,
                data: this.tasks
            });
        });
        this.dataContainer.appendChild(ul);
        this.element.appendChild(this.dataContainer);
    }
}
;
