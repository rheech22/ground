import Tab from './tab.js';
export default class ImageTab extends Tab {
    constructor(element) {
        super(element);
        this.images = this.loadLocalData('images') || [];
        this.render();
    }
    setModalInputs() {
        this.modal.innerHTML = '';
        const template = `
      <div class="modal">
        <button id="closeModal">_</button>
        <form id="modalForm">
          <label for="imageUrl">
            URL
            <input type="text" id='imageUrl' placeholder="Paste the image URL"/>    
          </label>
          <label for="description">
            Description
            <input type="text" id='description' placeholder="Enter a description for the image"/>    
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    `;
        this.modal.innerHTML = template;
        const modalForm = this.modal.querySelector('#modalForm');
        const closeButton = this.modal.querySelector('#closeModal');
        modalForm.addEventListener('submit', this.submitModalForm.bind(this));
        closeButton.addEventListener('click', this.closeModal.bind(this));
    }
    handleClickDeleteButton(e) {
        const target = e.target;
        const index = parseInt(target.parentElement?.getAttribute('data-index'), 10);
        this.images = [...this.images.slice(0, index), ...this.images.slice(index + 1)];
        this.saveLocalData({ name: 'images', data: this.images });
        this.render();
    }
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            this.images.push({
                imageUrl: inputValues[0],
                description: inputValues[1],
            });
            this.saveLocalData({ name: 'images', data: this.images });
        }
        this.popDown();
        this.render();
    }
    render() {
        this.dataContainer.innerHTML = '';
        this.images && this.images.forEach((element, i) => {
            const container = document.createElement('div');
            const description = document.createElement('p');
            const image = document.createElement('div');
            const button = document.createElement('button');
            container.append(image, description, button);
            container.classList.add('image-container');
            description.innerHTML = element.description;
            image.style.backgroundImage = `url(${element.imageUrl})`;
            button.innerHTML = '␡';
            button.addEventListener('click', this.handleClickDeleteButton.bind(this));
            button.classList.add('delete-button');
            this.setDraggable({
                draggableItem: container,
                dataName: 'images',
                dataIndex: i,
                data: this.images,
            });
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
