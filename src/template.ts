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

  selectTab(i: number){
    this.contents.forEach((content, index) => {
      content.removeAttribute('slot');

      if (index === i) {
        content.setAttribute('slot', 'tab-content');
      }
    });
  }
};
