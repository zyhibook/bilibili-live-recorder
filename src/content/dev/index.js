import { sleep, download } from '../../share';
import {
    LIVE,
    NOTIFY,
    TAB_INFO,
    MP4_BUFFER,
    FLV_BUFFER,
    START_RECORD,
    STOP_RECORD,
    UPDATE_CONFIG,
    START_DOWNLOAD,
} from '../../share/constant';

class Content {
    constructor() {
        this.injectScript();
        this.injectStyle();

        this.tab = null;
        this.config = null;
        this.worker = new Worker('./flv-remuxer.js');

        // 来自 worker
        this.worker.onmessage = event => {
            const { type, data } = event.data;
            switch (type) {
                case NOTIFY:
                    chrome.runtime.sendMessage({
                        type: NOTIFY,
                        data,
                    });
                    break;
                case UPDATE_CONFIG:
                    chrome.runtime.sendMessage({
                        type: UPDATE_CONFIG,
                        data,
                    });
                    break;
                case START_DOWNLOAD:
                    const url = URL.createObjectURL(new Blob([data]));
                    const name = this.config.name + '.' + this.config.format;
                    download(url, name);
                    break;
                default:
                    break;
            }
        };

        setTimeout(() => {
            this.notify('hi');
        }, 1000);

        // 来自 popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            const { type, data } = request;
            switch (type) {
                case TAB_INFO:
                    this.tab = data;
                    break;
                case START_RECORD:
                    this.config = data;
                    this.worker.postMessage({
                        type: START_RECORD,
                        data,
                    });
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
            if (event.origin !== LIVE) return;
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
