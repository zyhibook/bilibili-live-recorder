import 'crx-hotreload';
import { BILIBILI_PATTERN } from '../../share/constant';

class Background {
    constructor() {
        this.changeCSP();
        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });
    }

    changeCSP() {
        chrome.webRequest.onHeadersReceived.addListener(
            details => {
                let header = details.responseHeaders.find(
                    e => e.name.toLowerCase() === 'content-security-policy-report-only',
                );
                if (header && header.value) {
                    header.value = 'worker-src blob: ; ' + header.value;
                }
                return { responseHeaders: details.responseHeaders };
            },
            { urls: [BILIBILI_PATTERN] },
            ['blocking', 'responseHeaders'],
        );
    }
}

export default new Background();
