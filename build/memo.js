import Tab from './tab.js';
export default class MemoTab extends Tab {
    constructor(element) {
        super(element);
    }
    ;
    setData() {
        this.data.push({
            title: this.firstInput.value,
            description: this.secondInput.value,
        });
    }
    ;
    setModalInputs() {
        this.firstInput.type = 'text';
        this.firstInput.placeholder = 'types title';
        this.secondInput.type = 'text';
        this.secondInput.placeholder = 'types description';
    }
    render() {
        this.dataContainer.innerHTML = '';
        this.data && this.data.map(element => {
            const container = document.createElement('div');
            const title = document.createElement('h6');
            const description = document.createElement('p');
            title.innerHTML = element.title;
            description.innerHTML = element.description;
            container.append(title, description);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
