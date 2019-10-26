import './index.scss';
import { sleep, download } from '../../share';
import Storage from '../../share/storage';

class Injected {
    constructor() {
        this.name = 'bilibili-live-recorder';
        this.storage = new Storage(this.name);
        this.worker = new Worker('./worker.js');
        this.loading = false;

        this.worker.onmessage = event => {
            const { type, data } = event.data;
            switch (type) {
                case 'report':
                    this.$duration.textContent = data.duration;
                    this.$size.textContent = data.size;
                    break;
                case 'download':
                    download(data, `${document.title}.flv`);
                    this.worker.terminate();
                    break;
                case 'error':
                    this.loading = false;
                    this.changeState('after-record');
                    break;
                default:
                    break;
            }
        };

        if (this.storage.get(location.href)) {
            this.storage.del(location.href);
            this.loading = true;
            this.intercept();
            sleep(20).then(() => {
                this.changeState('recording');
            });
        }

        sleep(10).then(() => {
            this.createUI();
            this.bindEvent();
        });
    }

    // 创建UI
    createUI() {
        this.$container = document.createElement('div');
        this.$container.classList.add(this.name);
        this.$container.innerHTML = `
            <div class="blr-states">
                <div class="blr-state blr-state-before-record blr-active">开始</div>
                <div class="blr-state blr-state-recording">停止</div>
                <div class="blr-state blr-state-after-record">下载</div>
            </div>
            <div class="blr-monitor">
                <div class="blr-monitor-top">时长：<span class="blr-duration">00:00</span></div>
                <div class="blr-monitor-bottom">大小：<span class="blr-size">0.00</span>M</div>
            </div>
        `;
        this.$states = Array.from(this.$container.querySelectorAll('.blr-state'));
        this.$beforeRecord = this.$container.querySelector('.blr-state-before-record');
        this.$recording = this.$container.querySelector('.blr-state-recording');
        this.$afterRecord = this.$container.querySelector('.blr-state-after-record');
        this.$duration = this.$container.querySelector('.blr-duration');
        this.$size = this.$container.querySelector('.blr-size');
        document.body.appendChild(this.$container);
    }

    // 更改状态
    changeState(state) {
        this.$states.forEach(item => {
            if (item.classList.contains(`blr-state-${state}`)) {
                item.classList.add('blr-active');
            } else {
                item.classList.remove('blr-active');
            }
        });
    }

    // 绑定事件
    bindEvent() {
        this.$beforeRecord.addEventListener('click', () => {
            const $video = document.querySelector('video');
            if ($video) {
                this.storage.set(location.href, 1);
                location.reload();
            }
        });

        this.$recording.addEventListener('click', () => {
            this.loading = false;
            this.changeState('after-record');
            this.worker.postMessage({
                type: 'stop',
            });
        });

        this.$afterRecord.addEventListener('click', () => {
            this.loading = false;
            this.changeState('before-record');
            this.worker.postMessage({
                type: 'download',
            });
        });
    }

    // 拦截视频流
    intercept() {
        const { read } = ReadableStreamDefaultReader.prototype;
        const that = this;
        ReadableStreamDefaultReader.prototype.read = function() {
            const promiseResult = read.call(this);
            promiseResult.then(({ done, value }) => {
                if (done || !that.loading) return;
                that.worker.postMessage({
                    type: 'load',
                    data: value.slice(),
                });
            });
            return promiseResult;
        };
    }
}

export default new Injected();
