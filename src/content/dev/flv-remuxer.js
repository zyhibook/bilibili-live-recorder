const FLV_BUFFER = 'flv_buffer';
const START_RECORD = 'start_record';
const START_DOWNLOAD = 'start_download';
const STOP_RECORD = 'stop_record';

onmessage = event => {
    const { type, data } = event.data;
    switch (type) {
        case FLV_BUFFER:
            break;
        case START_DOWNLOAD:
            break;
        case START_RECORD:
            break;
        case STOP_RECORD:
            break;
        default:
            break;
    }
};
