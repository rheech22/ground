/* eslint-disable import/prefer-default-export */
export const getVideoId = (url) => {
    const videoId = url.split('v=')[1];
    const ampersandIndex = videoId.indexOf('&');
    return ampersandIndex === -1 ? videoId : videoId.substring(0, ampersandIndex);
};
