// 合并数据
function mergeBuffer(...buffers) {
    const Cons = buffers[0].constructor;
    return buffers.reduce((pre, val) => {
        const merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
        merge.set(pre, 0);
        merge.set(val, pre.byteLength | 0);
        return merge;
    }, new Cons());
}

// 读取长度
function readBufferSum(array, uint = true) {
    return array.reduce((totle, num, index) => totle + (uint ? num : num - 128) * 256 ** (array.length - index - 1), 0);
}

// 获取时间戳
function getTagTime(tag) {
    const ts2 = tag[4];
    const ts1 = tag[5];
    const ts0 = tag[6];
    const ts3 = tag[7];
    return ts0 | (ts1 << 8) | (ts2 << 16) | (ts3 << 24);
}

// 时长转时间
function durationToTime(duration) {
    const m = String(Math.floor(duration / 60));
    const s = String(duration % 60);
    return `${m.length === 1 ? `0${m}` : m}:${s.length === 1 ? `0${s}` : s}`;
}

// FLV解封装类
class Flv {
    constructor() {
        this.index = 0;
        this.tasks = [];
        this.timer = null;
        this.loading = false;
        this.running = false;
        this.tagStartTime = 0;
        this.resultDuration = 0;
        this.data = new Uint8Array();
        this.header = new Uint8Array();
        this.scripTag = new Uint8Array();
        this.videoAndAudioTags = new Uint8Array();

        (function loop() {
            this.timer = setTimeout(() => {
                if (this.running && this.loading) {
                    this.report();
                }
                loop.call(this);
            }, 1000);
        }.call(this));
    }

    // 最终合成视频
    get resultData() {
        return mergeBuffer(this.header, this.scripTag, this.videoAndAudioTags);
    }

    // 当前视频时长
    get resultSize() {
        return this.header.byteLength + this.scripTag.byteLength + this.videoAndAudioTags.byteLength;
    }

    // 汇报状态
    report() {
        postMessage({
            type: 'report',
            data: {
                duration: durationToTime(Math.floor(this.resultDuration / 1000)),
                size: (this.resultSize / 1024 / 1024).toFixed(2),
            },
        });
    }

    // 判断数据是否足够
    readable(length) {
        return this.data.length - this.index >= length;
    }

    // 按字节读取
    read(length) {
        const uint8 = new Uint8Array(length);
        for (let i = 0; i < length; i += 1) {
            uint8[i] = this.data[this.index];
            this.index += 1;
        }
        return uint8;
    }

    // 加载视频流
    load(uint8) {
        this.loading = true;
        this.tasks.push(this.demuxer.bind(this, uint8));
        if (!this.running) {
            (function loop() {
                const task = this.tasks.shift();
                if (task && this.loading) {
                    this.running = true;
                    task().then(() => {
                        setTimeout(loop.bind(this), 0);
                    });
                } else {
                    this.running = false;
                }
            }.call(this));
        }
    }

    // 数据解封装
    demuxer(uint8) {
        return new Promise((resolve, reject) => {
            if (!this.loading) {
                resolve();
                return;
            }

            this.data = mergeBuffer(this.data, uint8);

            if (!this.header.length && this.readable(13)) {
                this.header = this.read(13);
            }

            while (this.index < this.data.length) {
                let tagSize = 0;
                let tagType = 0;
                let tagData = new Uint8Array();
                const restIndex = this.index;

                if (this.readable(11)) {
                    tagData = mergeBuffer(tagData, this.read(11));
                    tagType = tagData[0];
                    tagSize = readBufferSum(tagData.subarray(1, 4));
                } else {
                    this.index = restIndex;
                    resolve();
                    return;
                }

                if (this.readable(tagSize + 4)) {
                    tagData = mergeBuffer(tagData, this.read(tagSize));
                    const prevTag = this.read(4);
                    tagData = mergeBuffer(tagData, prevTag);
                    const prevTagSize = readBufferSum(prevTag);
                    if (prevTagSize !== tagSize + 11) {
                        this.stop();
                        postMessage({
                            type: 'error',
                        });
                        reject(
                            new Error(`bilibili-live-recorder: Prev tag size does not match in tag type: ${tagType}`),
                        );
                        return;
                    }
                } else {
                    this.index = restIndex;
                    resolve();
                    return;
                }

                if (tagType === 18) {
                    this.scripTag = tagData;
                } else {
                    if (!this.tagStartTime) {
                        this.tagStartTime = getTagTime(tagData);
                    }
                    this.resultDuration = getTagTime(tagData) - this.tagStartTime;
                    this.videoAndAudioTags = mergeBuffer(this.videoAndAudioTags, tagData);
                }

                this.data = this.data.subarray(this.index);
                this.index = 0;
            }
            resolve();
        });
    }

    // 停止解封装
    stop() {
        this.loading = false;
        clearTimeout(this.timer);
        this.report();
    }

    // 下载当前视频
    download() {
        postMessage({
            type: 'report',
            data: {
                duration: durationToTime(0),
                size: (0).toFixed(2),
            },
        });
        postMessage({
            type: 'download',
            data: URL.createObjectURL(new Blob([this.resultData])),
        });
    }
}

const flv = new Flv();
onmessage = event => {
    const { type, data } = event.data;
    switch (type) {
        case 'load':
            flv.load(data);
            break;
        case 'stop':
            flv.stop();
            break;
        case 'download':
            flv.download();
            break;
        default:
            break;
    }
};
