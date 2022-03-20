import TaskTab from './tasks.js';
import MemoTab from './memos.js';
import ImageTab from './images.js';
import VideoTab from './videos.js';

type Tabs = typeof MemoTab | typeof TaskTab | typeof ImageTab | typeof VideoTab;

const tabs: {[key: string]: Tabs} = {
  tasks: TaskTab,
  memos: MemoTab,
  images: ImageTab,
  videos: VideoTab,
};

export default class Template extends HTMLElement {
  private tabs: NodeListOf<HTMLButtonElement>;

  private contents: NodeListOf<HTMLElement>;

  private template: HTMLTemplateElement = document.getElementById('template') as HTMLTemplateElement;

  private form: HTMLFormElement = document.getElementById('modalForm') as HTMLFormElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' })
      .appendChild(this.template.content.cloneNode(true));

    this.tabs = this.querySelectorAll('.tabs');
    this.contents = this.querySelectorAll('section');
  }

  private connectedCallback() {
    this.render();
  }

  private init() {
    this.tabs[0].classList.add('active');
    this.contents[0].setAttribute('slot', 'tab-content');
    new tabs.tasks(this.contents[0]);
  }

  private render() {
    this.init();

    const handleClick = (i: number) => {
      this.selectTab(i);
    };

    this.tabs.forEach((tab, i) => tab.addEventListener('click', () => handleClick(i)));
  }

  private detachListeners() {
    const clone = this.form.cloneNode(true);
    this.form.parentNode?.replaceChild(clone, this.form);
  }

  private selectTab(i: number) {
    this.contents.forEach((content, index) => {
      content.removeAttribute('slot');

      if (index === i) {
        content.setAttribute('slot', 'tab-content');

        this.detachListeners();

        const { name } = content.dataset;
        if (name && tabs[name]) {
          new tabs[name](content);
        }
      }
    });
    this.tabs.forEach((tab, index) => {
      tab.classList.remove('active');

      if (index === i) {
        tab.classList.add('active');
      }
    });
  }
}
