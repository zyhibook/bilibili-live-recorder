const { addSourceBuffer } = MediaSource.prototype;

MediaSource.prototype.addSourceBuffer = (...args) => {
    console.log(args);
    return addSourceBuffer.apply(MediaSource.prototype, args);
};
