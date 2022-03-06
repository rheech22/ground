import Tab from './tab.js';
export default class TaskTab extends Tab {
    constructor(element) {
        super(element);
    }
    ;
    setData() {
        this.data.push(this.firstInput.value);
    }
    ;
    setModalInputs() {
        this.firstInput.type = 'text';
        this.firstInput.placeholder = 'types category';
        this.secondInput.type = 'color';
    }
    render() {
        this.dataContainer.innerHTML = '';
        this.data && this.data.map(category => {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = category;
            this.dataContainer.appendChild(button);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
