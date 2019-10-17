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
