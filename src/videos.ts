import Tab from './tab.js';

type Video = {
  description: string;
  videoId: string;
};

export default class VideoTab extends Tab {
  private videos: Video[];

  constructor(element: HTMLElement) {
    super(element);
    this.videos = this.loadFromLocal('videos') || [];
    this.modalForm.addEventListener('submit', this.handleClick);
    this.render();
  }

  protected setModalInputs() {
    this.modalForm.innerHTML = '';

    const label1 = document.createElement('label');
    label1.htmlFor = 'videoUrl';
    label1.innerHTML = `
      URL
      <input type="text" id='videoUrl' placeholder="Paste the video URL"/>    
    `;

    const label2 = document.createElement('label');
    label2.htmlFor = 'description';
    label2.innerHTML = `
      Description
      <input type="text" id='description' placeholder="Enter a description for the video"/>    
    `;

    this.modalForm.prepend(label1, label2);

    const button = document.createElement('button');
    button.type = 'submit';
    button.innerText = 'Add';

    this.modalForm.appendChild(button);
  }

  private handleClickDeleteButton(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const index = parseInt(target.parentElement?.getAttribute('data-index') as string, 10);
    this.videos = [...this.videos.slice(0, index), ...this.videos.slice(index + 1)];
    this.saveToLocal({ name: 'videos', data: this.videos });
    this.render();
  }

  protected submit(inputValues: string[]) {
    if (inputValues.length === 2) {
      if (!inputValues[0] || !inputValues[1]) return;
      let videoId = inputValues[0].split('v=')[1];
      const description = inputValues[1];
      const ampersandIndex = videoId.indexOf('&');
      if (ampersandIndex !== -1) {
        videoId = videoId.substring(0, ampersandIndex);
      }
      this.videos.push({
        description,
        videoId,
      });
      this.saveToLocal({ name: 'videos', data: this.videos });
    }
    this.popDown();
    this.render();
  }

  protected render() {
    this.dataContainer.innerHTML = '';

    this.videos && this.videos.forEach((element, i) => {
      const container = document.createElement('div');
      const button = document.createElement('button');

      container.classList.add('video-container');
      container.innerHTML = `
        <div class="video-wrapper">
          <lite-youtube videoid=${element.videoId} posterloading></lite-youtube>
        </div>
        <p>${element.description}</p>
      `;

      container.appendChild(button);
      button.innerHTML = '␡';
      button.addEventListener('click', this.handleClickDeleteButton.bind(this));
      button.classList.add('delete-button');

      this.setDraggable({
        draggableList: container,
        dataName: 'videos',
        dataIndex: i,
        data: this.videos,
      });

      this.dataContainer.appendChild(container);
    });

    this.element.appendChild(this.dataContainer);
  }
}
