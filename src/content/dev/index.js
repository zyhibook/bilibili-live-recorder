import { sleep, isLiveRoom } from '../../share';
import Storage from '../../share/storage';
import { BILIBILI, MP4_BUFFER, FLV_BUFFER } from '../../share/constant';
import FlvRemuxer from './FlvRemuxer';

class Content {
    constructor() {
        this.injectScript();
        this.injectStyle();

        this.config = {};
        this.storage = new Storage();
        this.flv = new FlvRemuxer(this);
        this.roomId = isLiveRoom(location.href);

        if (this.roomId) {
            this.initEvent();
        }
    }

    initEvent() {
        this.storage.get(this.roomId).then(config => {
            if (config) {
                this.config = config;
            }
        });

        this.storage.onChanged(this.roomId, config => {
            this.config = config;
        });

        window.addEventListener('beforeunload', () => {
            this.storage.remove(this.roomId);
        });

        window.addEventListener('message', event => {
            if (event.origin !== BILIBILI) return;
            const { type, data } = event.data;
            switch (type) {
                case MP4_BUFFER:
                    break;
                case FLV_BUFFER:
                    // this.flv.load(data);
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
