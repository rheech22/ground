import { LABEL_BACKGROUND, LABEL_FONT } from './constants/colors.js';

import Tab from './tab.js';

type Category = {
  title: string;
  fontColor: string;
  buttonColor: string;
}

export default class TaskTab extends Tab {
  private categories: Category[];

  private selectedCategory: string;

  private tasks: string[];

  constructor(element: HTMLElement) {
    super(element);
    this.categories = this.loadLocalData('categories') || [];
    this.selectedCategory = this.categories && this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.loadLocalData(this.selectedCategory) : [];
    this.render();
  }

  protected setModalInputs() {
    this.modal.innerHTML = '';

    const template = `
      <div class="modal">
        <button id="closeModal">_</button>
        <form id="modalForm">
          <label for="category">
            Label
            <input type="text" id="category" placeholder="Enter a label"/>
          </label>
          <label for="font">
            Font-Color
            <input type="color" id="font" value=${LABEL_FONT} />
          </label>
          <label for="background">
            Background-Color
            <input type="color" id="background" value=${LABEL_BACKGROUND} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    `;

    this.modal.innerHTML = template;

    const modalForm = this.modal.querySelector('#modalForm')! as HTMLFormElement;
    const closeButton = this.modal.querySelector('#closeModal')! as HTMLButtonElement;

    modalForm.addEventListener('submit', this.submitModalForm.bind(this));
    closeButton.addEventListener('click', this.closeModal.bind(this));
  }

  private handleClickCategory(e: MouseEvent) {
    const targetElement = e.target as HTMLButtonElement;
    const category = targetElement.innerText;

    [...document.querySelectorAll('.selected')]
      .forEach((element) => element.classList.remove('selected'));

    targetElement.classList.add('selected');

    this.selectedCategory = category;
    this.tasks = this.loadLocalData(this.selectedCategory) || [];
    this.render();
  }

  private handleClickTaskSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedCategory) return;

    const form = e.target as HTMLFormElement;
    const taskInput = form.elements[0] as HTMLInputElement;

    if (!taskInput.value) return;

    this.tasks.push(taskInput.value);
    this.saveLocalData({ name: this.selectedCategory, data: this.tasks });
    taskInput.value = '';
    this.render();
  }

  private deleteTodo(e:MouseEvent) {
    const targetElement = e.target as HTMLButtonElement;
    const index = parseInt(targetElement.parentElement?.getAttribute('data-index') as string, 10);

    this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index + 1)];
    this.saveLocalData({ name: this.selectedCategory, data: this.tasks });
    this.render();
  }

  private deleteLabel() {
    this.categories = [...this.categories]
      .filter((category) => category.title !== this.selectedCategory);
    this.saveLocalData({ name: 'categories', data: this.categories });
    this.deleteLocalData(this.selectedCategory);

    this.selectedCategory = this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.loadLocalData(this.selectedCategory) : [];
    this.render();
  }

  protected submit(inputValues: string[]) {
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

      this.saveLocalData({ name: 'categories', data: this.categories });
      this.saveLocalData({ name: title, data: [] });
      this.selectedCategory = title;
      this.tasks = this.loadLocalData(this.selectedCategory);
    }

    this.popDown();
    this.render();
  }

  protected render() {
    this.dataContainer.innerHTML = '';

    this.categories && this.categories.forEach((category) => {
      const taskLabel = document.createElement('button');

      taskLabel.type = 'button';
      taskLabel.innerHTML = category.title;
      taskLabel.style.color = category.fontColor;
      taskLabel.style.backgroundColor = category.buttonColor;
      taskLabel.classList.add('categories');
      taskLabel.addEventListener('click', this.handleClickCategory.bind(this));

      if (category.title === this.selectedCategory) {
        taskLabel.classList.add('selected');
      }

      this.dataContainer.appendChild(taskLabel);
    });

    if (this.categories && !this.categories.length) {
      const message = document.createElement('span');

      message.innerText = 'Add a label first';
      this.dataContainer.appendChild(message);
    }

    if (this.categories && this.categories.length) {
      const taskForm = document.createElement('form');

      taskForm.classList.add('todo-form');

      const input = document.createElement('input');

      input.type = 'text';
      input.placeholder = 'Add task...';
      input.autofocus = true;

      const submitButton = document.createElement('button');

      submitButton.type = 'submit';
      submitButton.innerText = '+';

      taskForm.append(input, submitButton);
      taskForm.addEventListener('submit', this.handleClickTaskSubmit.bind(this));
      this.dataContainer.appendChild(taskForm);

      const taskList = document.createElement('ul');

      taskList.classList.add('draggable-list');

      this.tasks && this.tasks.forEach((task, i) => {
        const taskElement = document.createElement('li');
        const deleteButton = document.createElement('button');

        taskElement.innerHTML = task;
        taskElement.appendChild(deleteButton);
        taskElement.classList.add('todo');

        deleteButton.innerHTML = '␡';
        deleteButton.addEventListener('click', this.deleteTodo.bind(this));

        taskList.appendChild(taskElement);

        this.setDraggable({
          draggableItem: taskElement,
          dataName: this.selectedCategory,
          dataIndex: i,
          data: this.tasks,
        });
      });

      this.dataContainer.appendChild(taskList);

      const deleteLabelContainer = document.createElement('div');
      const deleteLabelButton = document.createElement('button');

      deleteLabelContainer.classList.add('delete-label-container');
      deleteLabelContainer.appendChild(deleteLabelButton);

      deleteLabelButton.innerText = `Remove this label: ${this.selectedCategory}`;
      deleteLabelButton.addEventListener('click', this.deleteLabel.bind(this));

      this.dataContainer.appendChild(deleteLabelContainer);
    }

    this.element.appendChild(this.dataContainer);
  }
}
