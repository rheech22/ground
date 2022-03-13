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
    
  constructor(element: HTMLElement){
    super(element);
    this.categories = this.load('categories') || [];
    this.selectedCategory = this.categories && this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.load(this.selectedCategory) : [];
    this.modalForm.addEventListener('submit', this.handleClick);
    this.render();
  };

  setModalInputs(){
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
  };

  handleClickCategory(e: MouseEvent){
    const button = e.target as HTMLButtonElement;
    const category = button.innerText;

    [...document.querySelectorAll('.selected')]
      .forEach(element => element.classList.remove('selected'));
    button.classList.add('selected');
    
    this.selectedCategory = category;

    this.tasks = this.load(this.selectedCategory) || [];
    this.render();
  };

  handleClickTaskSubmit(e: SubmitEvent){
    e.preventDefault();
    if(!this.selectedCategory) return;

    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;

    if(!input.value) return;

    this.tasks.push(input.value);
    this.save({name: this.selectedCategory, data: this.tasks});
    input.value = '';
    this.render();
  };

  deleteTodo(e:MouseEvent){
    const target = e.target as HTMLButtonElement;
    const index = parseInt(target.parentElement?.getAttribute('data-index') as string, 10);
    this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index+1)];
    this.save({name: this.selectedCategory, data: this.tasks});
    this.render();
  };

  deleteLabel(){
    this.categories = [...this.categories]
      .filter(category => category.title !== this.selectedCategory);
    this.save({name: 'categories', data: this.categories});
    this.delete(this.selectedCategory);
    this.selectedCategory = this.categories.length ? this.categories[0].title : '';
    this.tasks = this.selectedCategory ? this.load(this.selectedCategory) : [];
    this.render();
  }  

  submit(inputValues: string[]){
    if(inputValues.length === 3){
      if(!inputValues[0]) return;
      this.categories.push({
        title: inputValues[0],
        fontColor: inputValues[1],
        buttonColor: inputValues[2]
      });
      this.save({name: 'categories', data: this.categories});
      this.save({name: inputValues[0], data: []});
      this.selectedCategory = inputValues[0];
      this.tasks = this.load(this.selectedCategory);
    };

    this.popDown();
    this.render();
  };

  render(){
    this.dataContainer.innerHTML = '';

    this.categories && this.categories.map(category=> {
      const button = document.createElement('button');

      button.type = 'button';
      button.innerHTML = category.title;
      button.style.color = category.fontColor;
      button.style.backgroundColor = category.buttonColor;
      button.classList.add('categories');
      button.addEventListener('click', this.handleClickCategory.bind(this));

      if(category.title === this.selectedCategory){
        button.classList.add('selected');
      };

      this.dataContainer.appendChild(button);
    });

    if (this.categories && !this.categories.length){
      const message = document.createElement('span');
      message.innerText = 'Add a label first'
      this.dataContainer.appendChild(message);
    };

    if (this.categories && this.categories.length){
      const form = document.createElement('form');   
      form.classList.add('todo-form');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'what are u gonna do?';
      
      const button = document.createElement('button');
      button.type = 'submit';
      button.innerText = 'Add task';

      form.append(input, button);
      form.addEventListener('submit', this.handleClickTaskSubmit.bind(this));
      this.dataContainer.appendChild(form);

      const ul = document.createElement('ul');
      ul.classList.add('draggable-list');

      this.tasks && this.tasks.map((task, i) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        li.innerHTML = task;
        li.appendChild(button);
        li.classList.add('todo');

        button.innerHTML = '␡';
        button.addEventListener('click', this.deleteTodo.bind(this));     

        ul.appendChild(li);

        this.setDraggable({
          draggableList: li,
          dataName: this.selectedCategory,
          dataIndex: i,
          data: this.tasks
        })
      });

      this.dataContainer.appendChild(ul);
      
      const deleteLabelButton = document.createElement('button');
      deleteLabelButton.innerText = 'Remove this label';
      deleteLabelButton.classList.add('delete-label-button');
      deleteLabelButton.addEventListener('click', this.deleteLabel.bind(this));
  
      this.dataContainer.appendChild(deleteLabelButton);
    };


    this.element.appendChild(this.dataContainer);
  }
};
