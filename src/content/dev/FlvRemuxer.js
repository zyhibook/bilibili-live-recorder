import { mergeBuffer } from '../../share';

export default class FlvRemuxer {
    constructor(bg) {
        this.bg = bg;
        this.data = new Uint8Array(10);
    }

    load(buf) {
        this.data = mergeBuffer(this.data, buf);
        this.bg.updateConfig({
            currentSize: (this.data.byteLength / 1024 / 1024).toFixed(3),
        });
    }

    stop() {
        //
    }

    download() {
        //
    }
}
