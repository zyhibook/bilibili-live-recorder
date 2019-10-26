import 'crx-hotreload';

chrome.webRequest.onHeadersReceived.addListener(
    details => {
        let header = details.responseHeaders.find(e => e.name.toLowerCase() === 'content-security-policy-report-only');
        if (header && header.value) {
            header.value = 'worker-src blob: ; ' + header.value;
        }
        return { responseHeaders: details.responseHeaders };
    },
    { urls: ['*://*.bilibili.com/*'] },
    ['blocking', 'responseHeaders'],
);
