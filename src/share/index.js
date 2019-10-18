export function notify(text, name) {
    chrome.notifications.create(String(Math.random()), {
        type: 'basic',
        iconUrl: chrome.extension.getURL('icons/icon128.png'),
        title: 'Bilibili 直播间录制器',
        message: name || '',
        contextMessage: text,
    });
}

export function badge(text) {
    chrome.browserAction.setBadgeText({ text: text });
    chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
}

export function getNowTime() {
    if (performance && typeof performance.now === 'function') {
        return performance.now();
    }
    return Date.now();
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function calculationRate(callback) {
    let totalSize = 0;
    let lastTime = getNowTime();
    return size => {
        totalSize += size;
        const thisTime = getNowTime();
        const diffTime = thisTime - lastTime;
        if (diffTime >= 1000) {
            callback((totalSize / diffTime) * 1000);
            lastTime = thisTime;
            totalSize = 0;
        }
    };
}

export function mergeBuffer(...buffers) {
    const Cons = buffers[0].constructor;
    return buffers.reduce((pre, val) => {
        const merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
        merge.set(pre, 0);
        merge.set(val, pre.byteLength | 0);
        return merge;
    }, new Cons());
}

export function download(url, name) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}
