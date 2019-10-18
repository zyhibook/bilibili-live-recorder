import { sleep } from '../../share';
import { BILIBILI, MP4_BUFFER, FLV_BUFFER } from '../../share/constant';
import FlvRemuxer from './FlvRemuxer';

class Content {
    constructor() {
        this.injectScript();
        this.injectStyle();
        
        this.config = {};
        this.flv = new FlvRemuxer(this);

        window.addEventListener('message', event => {
            if (event.origin !== BILIBILI) return;
            const { type, data } = event.data;
            switch (type) {
                case MP4_BUFFER:
                    break;
                case FLV_BUFFER:
                    this.flv.load(data);
                    break;
                default:
                    break;
            }
        });

        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            const { type, data } = request;
            switch (type) {
                case START_RECORD:
                    this.config = data;
                    break;
                case STOP_RECORD:
                    this.flv.stop();
                    break;
                case START_DOWNLOAD:
                    this.flv.download();
                default:
                    break;
            }
            callback();
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
