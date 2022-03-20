import { LABEL_BACKGROUND, LABEL_FONT } from './constants/colors.js';

import Tab from './tab.js';

type Category = {
  title: string;
  fontColor: string;
  buttonColor: string;
}

export default class TaskTab extends Tab {
  categories: Category[];

  selectedCategory: string;

  tasks: string[];

  constructor(element: HTMLElement) {
    super(element);
    this.categories = this.loadFromLocal('categories') || [];
    this.selectedCategory = this.categories && this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.loadFromLocal(this.selectedCategory) : [];
    this.modalForm.addEventListener('submit', this.handleClick);
    this.render();
  }

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
      <input type="color" id="font" value=${LABEL_FONT} />
    `;
    const label3 = document.createElement('label');
    label3.htmlFor = 'background';
    label3.innerHTML = `
      Background-Color
      <input type="color" id="background" value=${LABEL_BACKGROUND} />
    `;
    this.modalForm.prepend(label1, label2, label3);
    const button = document.createElement('button');
    button.innerText = 'Add';
    button.type = 'submit';
    this.modalForm.appendChild(button);
  }

  handleClickCategory(e: MouseEvent) {
    const button = e.target as HTMLButtonElement;
    const category = button.innerText;

    [...document.querySelectorAll('.selected')]
      .forEach((element) => element.classList.remove('selected'));
    button.classList.add('selected');

    this.selectedCategory = category;

    this.tasks = this.loadFromLocal(this.selectedCategory) || [];
    this.render();
  }

  handleClickTaskSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedCategory) return;

    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;

    if (!input.value) return;

    this.tasks.push(input.value);
    this.saveToLocal({ name: this.selectedCategory, data: this.tasks });
    input.value = '';
    this.render();
  }

  deleteTodo(e:MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const index = parseInt(target.parentElement?.getAttribute('data-index') as string, 10);
    this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index + 1)];
    this.saveToLocal({ name: this.selectedCategory, data: this.tasks });
    this.render();
  }

  deleteLabel() {
    this.categories = [...this.categories]
      .filter((category) => category.title !== this.selectedCategory);
    this.saveToLocal({ name: 'categories', data: this.categories });
    this.deleteFromLocal(this.selectedCategory);
    this.selectedCategory = this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.loadFromLocal(this.selectedCategory) : [];
    this.render();
  }

  submit(inputValues: string[]) {
    if (inputValues.length === 3) {
      const [title, fontColor, buttonColor] = inputValues;
      if (!title) return;

      if ([...this.categories].find((category) => category.title === title)) {
        alert('This label already exists...');
        return;
      }

      this.categories.push({
        title,
        fontColor,
        buttonColor,
      });
      this.saveToLocal({ name: 'categories', data: this.categories });
      this.saveToLocal({ name: title, data: [] });
      this.selectedCategory = title;
      this.tasks = this.loadFromLocal(this.selectedCategory);
    }

    this.popDown();
    this.render();
  }

  render() {
    this.dataContainer.innerHTML = '';

    this.categories && this.categories.forEach((category) => {
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

      this.dataContainer.appendChild(button);
    });

    if (this.categories && !this.categories.length) {
      const message = document.createElement('span');
      message.innerText = 'Add a label first';
      this.dataContainer.appendChild(message);
    }

    if (this.categories && this.categories.length) {
      const form = document.createElement('form');
      form.classList.add('todo-form');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'what are u gonna do?';
      input.autofocus = true;

      const button = document.createElement('button');
      button.type = 'submit';
      button.innerText = '+';

      form.append(input, button);
      form.addEventListener('submit', this.handleClickTaskSubmit.bind(this));
      this.dataContainer.appendChild(form);

      const ul = document.createElement('ul');
      ul.classList.add('draggable-list');

      this.tasks && this.tasks.forEach((task, i) => {
        const li = document.createElement('li');
        const deleteButton = document.createElement('button');
        li.innerHTML = task;
        li.appendChild(deleteButton);
        li.classList.add('todo');

        deleteButton.innerHTML = '␡';
        deleteButton.addEventListener('click', this.deleteTodo.bind(this));

        ul.appendChild(li);

        this.setDraggable({
          draggableList: li,
          dataName: this.selectedCategory,
          dataIndex: i,
          data: this.tasks,
        });
      });

      this.dataContainer.appendChild(ul);

      const deleteLabelContainer = document.createElement('div');
      const deleteLabelButton = document.createElement('button');

      deleteLabelContainer.classList.add('delete-label-container');
      deleteLabelContainer.appendChild(deleteLabelButton);

      deleteLabelButton.innerText = `Remove the label: ${this.selectedCategory}`;
      deleteLabelButton.addEventListener('click', this.deleteLabel.bind(this));

      this.dataContainer.appendChild(deleteLabelContainer);
    }

    this.element.appendChild(this.dataContainer);
  }
}
