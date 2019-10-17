import './index.scss';

const { appendBuffer } = SourceBuffer.prototype;
SourceBuffer.prototype.appendBuffer = function(buf) {
    window.postMessage({
        type: 'buffer',
        data: buf.slice(),
    });
    return appendBuffer.call(this, buf);
};
