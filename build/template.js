import TaskTab from "./tasks.js";
import MemoTab from "./memos.js";
import ImageTab from "./images.js";
import VideoTab from "./videos.js";
const tabs = {
    tasks: TaskTab,
    memos: MemoTab,
    images: ImageTab,
    videos: VideoTab
};
export default class Template extends HTMLElement {
    constructor() {
        super();
        this.template = document.getElementById('template');
        this.attachShadow({ mode: 'open' })
            .appendChild(this.template.content.cloneNode(true));
        this.tabs = this.querySelectorAll('.tabs');
        this.contents = this.querySelectorAll('section');
    }
    ;
    connectedCallback() {
        this.render();
    }
    ;
    render() {
        const handleClick = (i) => {
            this.selectTab(i);
        };
        this.tabs.forEach((tab, i) => tab.addEventListener('click', () => handleClick(i)));
    }
    ;
    detachListeners() {
        const form = document.getElementById('modalForm');
        const clone = form.cloneNode(true);
        form.parentNode?.replaceChild(clone, form);
    }
    ;
    selectTab(i) {
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
    }
}
;
