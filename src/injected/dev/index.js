import './index.scss';
import Storage from '../../share/storage';

class Injected {
    constructor() {
        this.name = 'bilibili-live-recorder';
        this.storage = new Storage(this.name);
        this.createUI();

        if (this.storage.get(location.href)) {
            this.storage.del(location.href);
            this.intercept();
        }
    }

    // 创建UI
    createUI() {
        this.$container = document.createElement('div');
        this.$container.classList.add(this.name);
        this.$container.innerHTML = `
            <div class="${this.name}-states">
                <div class="${this.name}-state ${this.name}-state-before-record show">开始录制</div>
                <div class="${this.name}-state ${this.name}-state-recording">停止录制</div>
                <div class="${this.name}-state ${this.name}-state-after-record">下载视频</div>
            </div>
            <div class="${this.name}-monitor">
                <div class="${this.name}-monitor-top">时长：24:23:59</div>
                <div class="${this.name}-monitor-bottom">大小：12.345M</div>
            </div>
            <div class="${this.name}-handle"></div>
        `;
        document.body.appendChild(this.$container);
    }

    // 开始录制
    start() {
        this.storage.set(location.href, 1);
    }

    // 拦截视频流
    intercept() {
        const { read } = ReadableStreamDefaultReader.prototype;
        const that = this;
        ReadableStreamDefaultReader.prototype.read = function() {
            const promiseResult = read.call(this);
            promiseResult.then(({ done, value }) => {
                if (done) return;
                that.read(value.slice());
            });
            return promiseResult;
        };
    }

    read(uint8) {
        //
    }
}

export default new Injected();
