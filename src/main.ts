import Template from './template.js';
import TaskTab from './tasks.js';
import MemoTab from './memos.js';

const sections = document.querySelectorAll('section');

customElements.define('custom-main', Template);

// new TaskTab(sections[0]);
// new MemoTab(sections[1]);