import TaskTab from './tasks.js';
import Template from './template.js';

const sections = document.querySelectorAll('section');

customElements.define('custom-main', Template);

new TaskTab(sections[0]);