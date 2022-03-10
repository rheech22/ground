import Tab from './tab.js';
export default class VideoTab extends Tab {
    constructor(element) {
        super(element);
        const data = JSON.parse(localStorage.getItem('videos'));
        this.videos = data || [];
        this.modalForm.addEventListener('submit', this.handleClick);
        this.render();
    }
    ;
    setModalInputs() {
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
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            let videoId = inputValues[0].split('v=')[1];
            const description = inputValues[1];
            const ampersandIndex = videoId.indexOf('&');
            if (ampersandIndex !== -1) {
                videoId = videoId.substring(0, ampersandIndex);
            }
            ;
            this.videos.push({
                description,
                videoId
            });
            localStorage.setItem('videos', JSON.stringify(this.videos));
        }
        ;
        this.popDown();
        this.render();
    }
    ;
    render() {
        this.dataContainer.innerHTML = '';
        this.videos && this.videos.map((element, i) => {
            const container = document.createElement('div');
            container.classList.add('video-container');
            container.innerHTML = `
      <div class="video-wrapper">
        <lite-youtube videoid=${element.videoId} posterloading></lite-youtube>
      </div>
      <p>${element.description}</p>
      `;
            this.setDraggable({
                draggableList: container,
                dataName: 'videos',
                dataIndex: i,
                data: this.videos
            });
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
