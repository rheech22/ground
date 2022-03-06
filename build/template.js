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
    selectTab(i) {
        this.contents.forEach((content, index) => {
            content.removeAttribute('slot');
            if (index === i) {
                content.setAttribute('slot', 'tab-content');
            }
        });
    }
}
;
