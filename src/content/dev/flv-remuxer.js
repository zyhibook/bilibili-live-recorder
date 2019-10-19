onmessage = event => {
    const { type, data } = event.data;
    switch (type) {
        case 'load':
            break;
        case 'download':
            console.log(type);
            break;
        case 'record':
            console.log(type);
            postMessage('hi');
            break;
        case 'stop':
            console.log(type);
            break;
        default:
            break;
    }
};
