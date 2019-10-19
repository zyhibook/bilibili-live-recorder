const FLV_BUFFER = 'flv_buffer';
const START_RECORD = 'start_record';
const START_DOWNLOAD = 'start_download';
const STOP_RECORD = 'stop_record';
const UPDATE_CONFIG = 'update_config';

let config = null;
let recording = false;
let videoDate = new Uint8Array(1024 * 1024);

let debugStr = '';
function debugLog(...args) {
    const d = new Date();
    const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    debugStr = `${debugStr}\\n\\n${time} -> ${args.map(item => JSON.stringify(item)).join('|')}`.trim();
    postMessage({
        type: UPDATE_CONFIG,
        data: {
            debug: debugStr,
        },
    });
}

onmessage = event => {
    const { type, data } = event.data;
    switch (type) {
        case FLV_BUFFER:
            break;
        case START_RECORD:
            recording = true;
            config = data;
            debugStr = '';
            config.debug = '';
            debugLog(START_RECORD, config);
            break;
        case STOP_RECORD: {
            recording = false;
            debugLog(STOP_RECORD);
            break;
        }
        case START_DOWNLOAD:
            debugLog(START_DOWNLOAD);
            postMessage({
                type: START_DOWNLOAD,
                data: videoDate,
            });
            break;
        default:
            break;
    }
};
