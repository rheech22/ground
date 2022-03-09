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
        button.innerText = 'submit';
        this.modalForm.appendChild(button);
    }
    submit(inputValues) {
        if (inputValues.length === 2) {
            if (!inputValues[0] || !inputValues[1])
                return;
            const title = inputValues[0];
            let videoId = inputValues[1].split('v=')[1];
            const ampersandIndex = videoId.indexOf('&');
            if (ampersandIndex !== -1) {
                videoId = videoId.substring(0, ampersandIndex);
            }
            ;
            this.videos.push({
                title,
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
        this.videos && this.videos.map(element => {
            const container = document.createElement('div');
            container.innerHTML = `
        <h6>${element.title}</h6>
        <lite-youtube videoid=${element.videoId} posterloading></lite-youtube>
      `;
            this.dataContainer.appendChild(container);
        });
        this.element.appendChild(this.dataContainer);
    }
}
;
