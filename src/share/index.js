export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
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

export function mergeBuffer(...buffers) {
    const Cons = buffers[0].constructor;
    return buffers.reduce((pre, val) => {
        const merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
        merge.set(pre, 0);
        merge.set(val, pre.byteLength | 0);
        return merge;
    }, new Cons());
}

export function readBufferSum(array, uint = true) {
    return array.reduce((totle, num, index) => totle + (uint ? num : num - 128) * 256 ** (array.length - index - 1), 0);
}

export function getTagTime(tag) {
    const ts2 = tag[4];
    const ts1 = tag[5];
    const ts0 = tag[6];
    const ts3 = tag[7];
    return ts0 | (ts1 << 8) | (ts2 << 16) | (ts3 << 24);
}
