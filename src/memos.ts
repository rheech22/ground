import Tab from './tab.js';

type Memo = {
  title: string;
  description: string;
};

export default class MemoTab extends Tab {
  memos: Memo[];
  
  constructor(element: HTMLElement){
    super(element);
    this.memos = JSON.parse(localStorage.getItem('memos') as string) || [];
    this.dragStartIndex = null;
    this.modalForm.addEventListener('submit', this.handleClick);
    this.render();
  };

  setModalInputs(){
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

  submit(inputValues: string[]){
    if(inputValues.length === 2){
      if(!inputValues[0] || !inputValues[1]) return;
      this.memos.push({
        title: inputValues[0],
        description: inputValues[1]
      });
      localStorage.setItem('memos', JSON.stringify(this.memos));
    };
    this.popDown();
    this.render();
  };

  render(){
    this.dataContainer.innerHTML = '';  

    this.memos && this.memos.map((element, i)=> {
      const container = document.createElement('div');
      const description = document.createElement('p');
      const title = document.createElement('h6');

      container.append(title, description);
      description.innerHTML = element.description;
      title.innerHTML = element.title;

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
};
