const NOTIFY = 'notify';
const FLV_BUFFER = 'flv_buffer';
const STOP_RECORD = 'stop_record';
const RESET_RECORD = 'reset_record';
const START_RECORD = 'start_record';
const UPDATE_CONFIG = 'update_config';
const START_DOWNLOAD = 'start_download';

class FLVParser {
    static mergeBuffer(...buffers) {
        const Cons = buffers[0].constructor;
        return buffers.reduce((pre, val) => {
            const merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
            merge.set(pre, 0);
            merge.set(val, pre.byteLength | 0);
            return merge;
        }, new Cons());
    }

    static readBufferSum(array, uint = true) {
        return array.reduce(
            (totle, num, index) => totle + (uint ? num : num - 128) * 256 ** (array.length - index - 1),
            0,
        );
    }

    static numToFloat64Arr(num) {
        return [...new Uint8Array(new Float64Array([num]).buffer)].reverse();
    }

    static readBufferString(array) {
        return String.fromCharCode.call(String, ...array);
    }

    static getNowTime() {
        if (performance && typeof performance.now === 'function') {
            return performance.now();
        }
        return Date.now();
    }

    static createRate(callback, average = true) {
        let totalSize = 0;
        let lastTime = FLVParser.getNowTime();
        return (size = 1) => {
            totalSize += size;
            const thisTime = FLVParser.getNowTime();
            const diffTime = thisTime - lastTime;
            if (diffTime >= 1000) {
                callback(average ? (totalSize / diffTime) * 1000 : size);
                lastTime = thisTime;
                totalSize = 0;
            }
        };
    }

    constructor() {
        this.data = new Uint8Array();
        this.header = new Uint8Array();
        this.scripTag = new Uint8Array();
        this.videoAndAudioTags = new Uint8Array();
        this.tagStartTime = 0;
        this.resultDuration = 0;
        this.recording = false;
        this.debugStr = '';
        this.config = {};
        this.index = 0;

        this.downloadRate = FLVParser.createRate(rate => {
            if (!this.recording) return;
            postMessage({
                type: UPDATE_CONFIG,
                data: {
                    downloadRate: (rate / 1024 / 1024).toFixed(3),
                },
            });
        });

        this.writeRate = FLVParser.createRate(rate => {
            if (!this.recording) return;
            postMessage({
                type: UPDATE_CONFIG,
                data: {
                    writeRate: (rate / 1024 / 1024).toFixed(3),
                },
            });
        });

        this.durationRate = FLVParser.createRate(rate => {
            if (!this.recording) return;
            postMessage({
                type: UPDATE_CONFIG,
                data: {
                    currentDuration: (rate / 1000 / 60).toFixed(3),
                },
            });
        }, false);

        this.sizeRate = FLVParser.createRate(rate => {
            if (!this.recording) return;
            postMessage({
                type: UPDATE_CONFIG,
                data: {
                    currentSize: (rate / 1024 / 1024).toFixed(3),
                },
            });
        }, false);
    }

    get resultData() {
        return FLVParser.mergeBuffer(this.header, this.scripTag, this.videoAndAudioTags);
    }

    get resultSize() {
        return this.header.byteLength + this.scripTag.byteLength + this.videoAndAudioTags.byteLength;
    }

    getTagTime(tag) {
        const ts2 = tag[4];
        const ts1 = tag[5];
        const ts0 = tag[6];
        const ts3 = tag[7];
        return ts0 | (ts1 << 8) | (ts2 << 16) | (ts3 << 24);
    }

    setTagTime(time) {
        const uint = new Uint8Array(4);
        const size = new Uint8Array(new Uint32Array([time]).buffer);
        uint[0] = size[2];
        uint[1] = size[1];
        uint[2] = size[0];
        uint[3] = size[3];
        return uint;
    }

    debug(...args) {
        const d = new Date();
        const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        this.debugStr = `${this.debugStr}\\n\\n${time} -> ${args
            .map(item => (typeof item === 'string' ? item : JSON.stringify(item)))
            .join('|')}`.trim();
        postMessage({
            type: UPDATE_CONFIG,
            data: {
                debug: this.debugStr,
            },
        });
    }

    notify(message) {
        postMessage({
            type: NOTIFY,
            data: {
                title: this.config.name || '',
                message: String(message),
            },
        });
    }

    readable(length) {
        return this.data.length - this.index >= length;
    }

    read(length) {
        const uint8 = new Uint8Array(length);
        for (let i = 0; i < length; i += 1) {
            uint8[i] = this.data[this.index];
            this.index += 1;
        }
        return uint8;
    }

    [RESET_RECORD]() {
        this.data = new Uint8Array();
        this.header = new Uint8Array();
        this.scripTag = new Uint8Array();
        this.videoAndAudioTags = new Uint8Array();
        this.tagStartTime = 0;
        this.resultDuration = 0;
        this.recording = false;
        this.debugStr = '';
        this.config = {};
        this.index = 0;
    }

    [FLV_BUFFER](uint8) {
        this.downloadRate(uint8.byteLength);
        this.data = FLVParser.mergeBuffer(this.data, uint8);
        if (!this.header.length && this.readable(13)) {
            this.header = this.read(13);
        }

        while (this.index < this.data.length) {
            let tagSize = 0;
            let tagType = 0;
            let tagData = new Uint8Array();
            const restIndex = this.index;

            if (this.readable(11)) {
                tagData = FLVParser.mergeBuffer(tagData, this.read(11));
                tagType = tagData[0];
                tagSize = FLVParser.readBufferSum(tagData.subarray(1, 4));
            } else {
                this.index = restIndex;
                return;
            }

            if (this.readable(tagSize + 4)) {
                tagData = FLVParser.mergeBuffer(tagData, this.read(tagSize));
                const prevTag = this.read(4);
                tagData = FLVParser.mergeBuffer(tagData, prevTag);
                const prevTagSize = FLVParser.readBufferSum(prevTag);
                if (prevTagSize !== tagSize + 11) {
                    const msg = `Prev tag size does not match in tag type: ${tagType}`;
                    this.debug(msg);
                    throw new Error(msg);
                }
            } else {
                this.index = restIndex;
                return;
            }

            if (tagType === 18) {
                this.scripTag = tagData;
            } else {
                if (!this.tagStartTime) {
                    this.tagStartTime = this.getTagTime(tagData);
                }
                this.resultDuration = this.getTagTime(tagData) - this.tagStartTime;
                this.videoAndAudioTags = FLVParser.mergeBuffer(this.videoAndAudioTags, tagData);
            }

            this.writeRate(tagData.byteLength);
            this.sizeRate(this.resultData.byteLength);
            this.durationRate(this.resultDuration);
            this.data = this.data.subarray(this.index);
            this.index = 0;
        }
    }

    [START_RECORD](config) {
        this.recording = true;
        this.config = config;
        this.debugStr = '';
        this.config.debug = '';
        this.debug(START_RECORD, 'config', this.config);
    }

    [STOP_RECORD]() {
        this.recording = false;
        this.debug(STOP_RECORD, 'duration', this.resultDuration);
    }

    [START_DOWNLOAD]() {
        postMessage({
            type: START_DOWNLOAD,
            data: this.resultData,
        });
        this.debug(START_DOWNLOAD, 'byteLength', this.resultData.byteLength);
    }
}

const flv = new FLVParser();
onmessage = event => {
    const { type, data } = event.data;
    switch (type) {
        case FLV_BUFFER:
            flv[FLV_BUFFER](data);
            break;
        case START_RECORD:
            flv[START_RECORD](data);
            break;
        case STOP_RECORD:
            flv[STOP_RECORD](data);
            break;
        case START_DOWNLOAD:
            flv[START_DOWNLOAD](data);
            break;
        case RESET_RECORD:
            flv[RESET_RECORD](data);
            break;
        default:
            break;
    }
};
