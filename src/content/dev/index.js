import { sleep, download } from '../../share';
import Storage from '../../share/storage';
import {
    LIVE,
    NOTIFY,
    TAB_INFO,
    RECORDING,
    MP4_BUFFER,
    FLV_BUFFER,
    START_RECORD,
    BEFORE_RECORD,
    STOP_RECORD,
    UPDATE_CONFIG,
    START_DOWNLOAD,
} from '../../share/constant';

class Content {
    constructor() {
        this.injectScript();
        this.injectStyle();

        this.tab = null;
        this.worker = new Worker('./flv-remuxer.js');
        this.storage = new Storage('bilibili-live-recorder');
        this.config = this.storage.get(location.href);
        this.storage.del(location.href);

        if (this.config) {
            this.worker.postMessage({
                type: START_RECORD,
                data: this.config,
            });
        }

        // 来自 worker
        this.worker.onmessage = event => {
            const { type, data } = event.data;
            switch (type) {
                case NOTIFY:
                    this.notify(data);
                    break;
                case UPDATE_CONFIG:
                    this.updateConfig(data);
                    break;
                case START_DOWNLOAD:
                    console.log('4');
                    this.download(data);
                    break;
                default:
                    break;
            }
        };

        // 来自 popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            const { type, data } = request;
            switch (type) {
                case TAB_INFO:
                    this.tab = data;
                    break;
                case START_RECORD:
                    const $video = document.querySelector('video');
                    if ($video) {
                        this.storage.set(location.href, data);
                        this.worker.terminate();
                        location.reload();
                    } else {
                        this.notify({
                            message: '未找到视频播放器',
                        });
                        this.updateConfig({
                            state: BEFORE_RECORD,
                        });
                    }
                    break;
                case START_DOWNLOAD:
                    this.config = data;
                    this.worker.postMessage({
                        type: START_DOWNLOAD,
                        data,
                    });
                    break;
                case STOP_RECORD:
                    this.config = data;
                    this.worker.postMessage({
                        type: STOP_RECORD,
                        data,
                    });
                    break;
                default:
                    break;
            }
            sendResponse(this.config);
        });

        // 来自 injected
        window.addEventListener('message', event => {
            if (event.origin === LIVE && this.config && this.config.state === RECORDING) {
                const { type, data } = event.data;
                switch (type) {
                    case MP4_BUFFER:
                        break;
                    case FLV_BUFFER:
                        this.worker.postMessage({
                            type: FLV_BUFFER,
                            data,
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    }

    download(data) {
        const name = this.config.name + '.' + this.config.format;
        download(data, name);
        this.updateConfig({
            state: BEFORE_RECORD,
        });
    }

    notify(data) {
        chrome.runtime.sendMessage({
            type: NOTIFY,
            data,
        });
    }

    updateConfig(data) {
        this.config = {
            ...this.config,
            ...data,
        };
        chrome.runtime.sendMessage({
            type: UPDATE_CONFIG,
            data: this.config,
        });
    }

    injectScript() {
        const $script = document.createElement('script');
        $script.src = chrome.extension.getURL('injected/index.js');
        $script.onload = () => $script.remove();
        document.documentElement.appendChild($script);
    }

    injectStyle() {
        const $style = document.createElement('link');
        $style.rel = 'stylesheet';
        $style.type = 'text/css';
        $style.href = chrome.extension.getURL('injected/index.css');
        sleep().then(() => document.head.appendChild($style));
    }
}

export default new Content();
