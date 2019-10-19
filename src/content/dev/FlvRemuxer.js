import { mergeBuffer } from '../../share';
import { RECORDING } from '../../share/constant';

export default class FlvRemuxer {
    constructor(content) {
        this.content = content;
        this.recording = false;
        this.data = new Uint8Array();
    }

    load(buf) {
        this.data = mergeBuffer(this.data, buf);
        if (this.content.config.state === RECORDING) {
            const size = (this.data.byteLength / 1024 / 1024).toFixed(3);
            this.content.updateConfig({
                currentSize: size,
            });
        }
    }

    record() {
        this.recording = true;
    }

    stop() {
        this.recording = false;
    }

    download() {
        console.log('download');
    }
}
