import { sleep, isLiveRoom } from '../../share';
import Storage from '../../share/storage';
import throttle from 'lodash/throttle';
import FlvRemuxer from './FlvRemuxer';
import {
    BILIBILI,
    MP4_BUFFER,
    FLV_BUFFER,
    START_RECORD,
    STOP_RECORD,
    START_DOWNLOAD,
    RECORDING,
    AFTER_RECORD,
    BEFORE_RECORD,
} from '../../share/constant';

class Content {
    constructor() {
        this.injectScript();
        this.injectStyle();

        this.config = {};
        this.storage = new Storage();
        this.flv = new FlvRemuxer(this);
        this.roomId = isLiveRoom(location.href);
        this.updateConfig = throttle(this.updateConfig, 1000);

        if (this.roomId) {
            this.storage.get(this.roomId).then(config => {
                if (config) {
                    this.storage.remove(this.roomId);
                }
            });
            this.storage.onChanged(this.roomId, config => {
                this.config = config;
                switch (this.config.action) {
                    case START_DOWNLOAD:
                        this.flv.download();
                        this.updateConfig({
                            state: BEFORE_RECORD,
                        });
                        break;
                    case START_RECORD:
                        this.flv.record();
                        this.updateConfig({
                            state: RECORDING,
                        });
                        break;
                    case STOP_RECORD:
                        this.flv.stop();
                        this.updateConfig({
                            state: AFTER_RECORD,
                        });
                        break;
                    default:
                        break;
                }
            });
        }

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
    }

    updateConfig(config) {
        this.storage.set(this.roomId, {
            ...this.config,
            ...config,
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
