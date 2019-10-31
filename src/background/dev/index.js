import 'crx-hotreload';

// 修改B站CSP请求头
chrome.webRequest.onHeadersReceived.addListener(
    details => {
        let header = details.responseHeaders.find(event => {
            const name = event.name.toLowerCase();
            return name === 'content-security-policy-report-only' || name === 'content-security-policy';
        });
        if (header && header.value) {
            header.value = 'worker-src blob: ; ' + header.value;
        }
        return { responseHeaders: details.responseHeaders };
    },
    { urls: ['*://*.bilibili.com/*'] },
    ['blocking', 'responseHeaders'],
);
