import Tab from './tab.js';
export default class ImageTab extends Tab {
    constructor(element) {
        super(element);
        const data = JSON.parse(localStorage.getItem('images'));
        this.images = data || [];
        this.modalForm.addEventListener('submit', this.handleClick);
        this.render();
    }
    ;
    setModalInputs() {
        this.modalForm.innerHTML = '';
        const label1 = document.createElement('label');
        label1.htmlFor = 'title';
        label1.innerHTML = `
      Title
      <input type="text" id='title'/>    
    `;
        const label2 = document.createElement('label');
        label2.htmlFor = 'imageUrl';
        label2.innerHTML = `
      URL
      <input type="text" id='imageUrl'/>    
    `;
        this.modalForm.prepend(label1, label2);
        const button = document.createElement('button');
        button.type = 'submit';
        button.innerText = 'submit';
        this.modalForm.appendChild(button);
    }
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            this.images.push({
                title: inputValues[0],
                imageUrl: inputValues[1]
            });
            localStorage.setItem('images', JSON.stringify(this.images));
        }
        ;
        this.popDown();
        this.render();
    }
    ;
    render() {
        this.dataContainer.innerHTML = '';
        this.images && this.images.map(element => {
            const container = document.createElement('div');
            const title = document.createElement('h6');
            const image = document.createElement('img');
            title.innerHTML = element.title;
            image.src = element.imageUrl;
            container.append(image, title);
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
