import 'crx-hotreload';

// 修改CSP请求头
const manifest = chrome.runtime.getManifest();
chrome.webRequest.onHeadersReceived.addListener(
    details => {
        const header = details.responseHeaders.find(event => {
            const name = event.name.toLowerCase();
            return name === 'content-security-policy-report-only' || name === 'content-security-policy';
        });

        if (header && header.value) {
            header.value = 'worker-src blob: ;' + header.value;
        }

        return { responseHeaders: details.responseHeaders };
    },
    { urls: manifest.content_scripts[0].matches },
    ['blocking', 'responseHeaders'],
);
