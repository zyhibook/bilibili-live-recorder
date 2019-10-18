import './index.scss';
import { MP4_BUFFER, FLV_BUFFER } from '../../constant';

class Injected {
    constructor() {
        const { appendBuffer } = SourceBuffer.prototype;
        SourceBuffer.prototype.appendBuffer = function(buf) {
            window.postMessage({
                type: MP4_BUFFER,
                data: new Uint8Array(buf.slice()),
            });
            return appendBuffer.call(this, buf);
        };

        const { read } = ReadableStreamDefaultReader.prototype;
        ReadableStreamDefaultReader.prototype.read = function() {
            const promiseResult = read.call(this);
            promiseResult.then(({ done, value }) => {
                if (done) return;
                window.postMessage({
                    type: FLV_BUFFER,
                    data: value.slice(),
                });
            });
            return promiseResult;
        };
    }
}

export default new Injected();
