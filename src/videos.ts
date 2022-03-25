import Tab from './tab.js';

import { getVideoId } from './utils.js';

type Video = {
  description: string;
  videoId: string;
};

export default class VideoTab extends Tab {
  private videos: Video[];

  constructor(element: HTMLElement) {
    super(element);
    this.videos = this.loadLocalData('videos') || [];
    this.render();
  }

  protected setModalInputs() {
    this.modal.innerHTML = '';

    const template = `
      <div class="modal">
        <button id="closeModal">_</button>
        <form id="modalForm">
          <label for="videoUrl">
            URL
            <input type="text" id='videoUrl' placeholder="Paste the video URL"/>
          </label>
          <label for="description">
            Description
            <input type="text" id='description' placeholder="Enter a description for the video"/>    
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    `;

    this.modal.innerHTML = template;

    const modalForm = this.modal.querySelector('#modalForm')! as HTMLFormElement;
    const closeButton = this.modal.querySelector('#closeModal')! as HTMLButtonElement;

    modalForm.addEventListener('submit', this.submitModalForm.bind(this));
    closeButton.addEventListener('click', this.closeModal.bind(this));
  }

  private handleClickDeleteButton(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const index = parseInt(target.parentElement?.getAttribute('data-index') as string, 10);

    this.videos = [...this.videos.slice(0, index), ...this.videos.slice(index + 1)];
    this.saveLocalData({ name: 'videos', data: this.videos });
    this.render();
  }

  protected submit(inputValues: string[]) {
    if (inputValues.length === 2) {
      const [videoUrl, description] = inputValues;

      if (!videoUrl || description) return;

      const videoId = getVideoId(videoUrl);

      this.videos.push({
        description,
        videoId,
      });

      this.saveLocalData({ name: 'videos', data: this.videos });
    }
    this.popDown();
    this.render();
  }

  protected render() {
    this.dataContainer.innerHTML = '';

    this.videos && this.videos.forEach((element, i) => {
      const container = document.createElement('div');
      const deleteButton = document.createElement('button');

      container.classList.add('video-container');
      container.innerHTML = `
        <div class="video-wrapper">
          <lite-youtube videoid=${element.videoId} posterloading></lite-youtube>
        </div>
        <p>${element.description}</p>
      `;
      container.appendChild(deleteButton);

      deleteButton.innerHTML = '␡';
      deleteButton.addEventListener('click', this.handleClickDeleteButton.bind(this));
      deleteButton.classList.add('delete-button');

      this.setDraggable({
        draggableItem: container,
        dataName: 'videos',
        dataIndex: i,
        data: this.videos,
      });

      this.dataContainer.appendChild(container);
    });

    this.element.appendChild(this.dataContainer);
  }
}
