import Tab from './tab.js';
import { getVideoId } from './utils.js';
export default class VideoTab extends Tab {
    constructor(element) {
        super(element);
        this.videos = this.loadLocalData('videos') || [];
        this.modalForm.addEventListener('submit', this.handleClick);
        this.render();
    }
    setModalInputs() {
        this.modalForm.innerHTML = '';
        const videoUrl = document.createElement('label');
        const videoDescription = document.createElement('label');
        const submitButton = document.createElement('button');
        videoUrl.htmlFor = 'videoUrl';
        videoUrl.innerHTML = `
      URL
      <input type="text" id='videoUrl' placeholder="Paste the video URL"/>    
    `;
        videoDescription.htmlFor = 'description';
        videoDescription.innerHTML = `
      Description
      <input type="text" id='description' placeholder="Enter a description for the video"/>    
    `;
        submitButton.type = 'submit';
        submitButton.innerText = 'Add';
        this.modalForm.prepend(videoUrl, videoDescription);
        this.modalForm.appendChild(submitButton);
    }
    handleClickDeleteButton(e) {
        const target = e.target;
        const index = parseInt(target.parentElement?.getAttribute('data-index'), 10);
        this.videos = [...this.videos.slice(0, index), ...this.videos.slice(index + 1)];
        this.saveLocalData({ name: 'videos', data: this.videos });
        this.render();
    }
    submit(inputValues) {
        if (inputValues.length === 2) {
            const [videoUrl, description] = inputValues;
            if (!videoUrl || description)
                return;
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
    render() {
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
