import { sleep } from '../../share';
import { BILIBILI, MP4_BUFFER, FLV_BUFFER } from '../../constant';

class Content {
    constructor() {
        const $script = document.createElement('script');
        $script.src = chrome.extension.getURL('injected/index.js');
        $script.onload = () => $script.remove();
        (document.head || document.body || document.documentElement).appendChild($script);

        const $style = document.createElement('link');
        $style.rel = 'stylesheet';
        $style.type = 'text/css';
        $style.href = chrome.extension.getURL('injected/index.css');
        sleep().then(() => document.head.appendChild($style));

        window.addEventListener('message', event => {
            if (event.origin !== BILIBILI) return;
            const { type, data } = event.data;
            switch (type) {
                case MP4_BUFFER:
                    chrome.runtime.sendMessage({
                        type: MP4_BUFFER,
                        data: data,
                    });
                    break;
                case FLV_BUFFER:
                    chrome.runtime.sendMessage({
                        type: FLV_BUFFER,
                        data: data,
                    });
                    break;
                default:
                    break;
            }
        });
    }
}

export default new Content();
