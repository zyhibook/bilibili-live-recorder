import 'crx-hotreload';
import { LIVE_PATTERN, NOTIFY, UPDATE_CONFIG, RECORDING, AFTER_RECORD } from '../../share/constant';

class Background {
    constructor() {
        this.changeCSP();

        // 来自 content
        chrome.runtime.onMessage.addListener(request => {
            const { type, data } = request;
            switch (type) {
                case NOTIFY:
                    chrome.notifications.create(String(Math.random()), {
                        type: 'basic',
                        message: data.message,
                        contextMessage: data.title || '',
                        title: chrome.runtime.getManifest().name,
                        iconUrl: chrome.extension.getURL('icons/icon128.png'),
                    });
                    break;
                case UPDATE_CONFIG:
                    if (data.state === RECORDING) {
                        this.setBadgeText(data.id, 'ON');
                    } else if (data.state === AFTER_RECORD) {
                        this.setBadgeText(data.id, 'OK');
                    } else {
                        this.setBadgeText(data.id, '');
                    }
                    break;
                default:
                    break;
            }
        });

        // 点击关闭提示
        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });
    }

    // 设置小图标文字
    setBadgeText(tabId, text, color = '#23ade5') {
        chrome.browserAction.setBadgeText({ text: String(text), tabId });
        chrome.browserAction.setBadgeBackgroundColor({ color });
    }

    // 修改CSP响应头
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
            { urls: [LIVE_PATTERN] },
            ['blocking', 'responseHeaders'],
        );
    }
}

export default new Background();
