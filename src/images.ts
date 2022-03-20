import Tab from './tab.js';

type Image = {
  description: string;
  imageUrl: string;
};

export default class ImageTab extends Tab {
  images: Image[];

  constructor(element: HTMLElement) {
    super(element);
    this.images = this.loadFromLocal('images') || [];
    this.modalForm.addEventListener('submit', this.handleClick);
    this.render();
  }

  setModalInputs() {
    this.modalForm.innerHTML = '';

    const label1 = document.createElement('label');
    label1.htmlFor = 'imageUrl';
    label1.innerHTML = `
      URL
      <input type="text" id='imageUrl' placeholder="Paste the image URL"/>    
    `;

    const label2 = document.createElement('label');
    label2.htmlFor = 'description';
    label2.innerHTML = `
      Description
      <input type="text" id='description' placeholder="Enter a description for the image"/>    
    `;

    this.modalForm.prepend(label1, label2);

    const button = document.createElement('button');
    button.type = 'submit';
    button.innerText = 'Add';

    this.modalForm.appendChild(button);
  }

  handleClickDeleteButton(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const index = parseInt(target.parentElement?.getAttribute('data-index') as string, 10);
    this.images = [...this.images.slice(0, index), ...this.images.slice(index + 1)];
    this.saveToLocal({ name: 'images', data: this.images });
    this.render();
  }

  submit(inputValues: string[]) {
    if (inputValues.length === 2) {
      if (!inputValues[0] || !inputValues[1]) return;
      this.images.push({
        imageUrl: inputValues[0],
        description: inputValues[1],
      });
      this.saveToLocal({ name: 'images', data: this.images });
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
        draggableList: container,
        dataName: 'images',
        dataIndex: i,
        data: this.images,
      });

      this.dataContainer.appendChild(container);
    });

    this.element.appendChild(this.dataContainer);
  }
}
