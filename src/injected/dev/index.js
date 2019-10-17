import './index.scss';

class Injected {
    constructor() {
        const { appendBuffer } = SourceBuffer.prototype;
        SourceBuffer.prototype.appendBuffer = function(buf) {
            window.postMessage({
                type: 'MP4Buffer',
                data: buf.slice(),
            });
            return appendBuffer.call(this, buf);
        };

        const { read } = ReadableStreamDefaultReader.prototype;
        ReadableStreamDefaultReader.prototype.read = function() {
            const promiseResult = read.call(this);
            promiseResult.then(({ done, value }) => {
                if (done) return;
                window.postMessage({
                    type: 'FLVBuffer',
                    data: value.slice(),
                });
            });
            return promiseResult;
        };
    }
}

export default new Injected();
