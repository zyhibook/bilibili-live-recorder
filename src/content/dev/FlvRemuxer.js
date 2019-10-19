import { mergeBuffer } from '../../share';

export default class FlvRemuxer {
    constructor(content) {
        this.content = content;
        this.recording = false;
        this.data = new Uint8Array();
    }

    load(buf) {
        this.data = mergeBuffer(this.data, buf);
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
