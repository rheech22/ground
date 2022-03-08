import MemoTab from "./memos.js";
import TaskTab from "./tasks.js";

type Tabs = typeof MemoTab | typeof TaskTab;

const tabs: {[key: string]: Tabs} = {
  tasks: TaskTab,
  memos: MemoTab,
};

export default class Template extends HTMLElement {
  tabs: NodeListOf<HTMLButtonElement>;
  contents: NodeListOf<HTMLElement>;
  template: HTMLTemplateElement = document.getElementById('template') as HTMLTemplateElement;

  constructor() { 
    super();

    this.attachShadow({mode: 'open'})
        .appendChild(this.template.content.cloneNode(true));
    
    this.tabs = this.querySelectorAll('.tabs');
    this.contents = this.querySelectorAll('section');
  };
  
  connectedCallback() {
    this.render();
  };

  render(){
    const handleClick = (i: number) => {
      this.selectTab(i);
    }
    
    this.tabs.forEach((tab, i)=> tab.addEventListener('click', () => handleClick(i)));
  };

  detachListeners(){
    const form = document.getElementById('modalForm') as HTMLFormElement;
    const clone = form.cloneNode(true);
    form.parentNode?.replaceChild(clone, form);
  };

  selectTab(i: number){
    this.contents.forEach((content, index) => {
      content.removeAttribute('slot');

      if (index === i) {
        content.setAttribute('slot', 'tab-content');

        this.detachListeners();

        const { name } = content.dataset;
        if(name && tabs[name]) {
          new tabs[name](content);
        }
      }
    });
  }
};
