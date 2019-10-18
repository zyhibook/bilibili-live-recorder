import 'crx-hotreload';
import { START_RECORD, STOP_RECORD, START_DOWNLOAD, MP4_BUFFER, FLV_BUFFER } from '../../share/constant';

class Background {
    constructor() {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            const { type, data } = request;
            switch (type) {
                case START_RECORD:
                    // console.log(data);
                    break;
                case STOP_RECORD:
                    // console.log(data);
                    break;
                case START_DOWNLOAD:
                    // console.log(data);
                    break;
                case MP4_BUFFER:
                    // console.log(data);
                    break;
                case FLV_BUFFER:
                    // console.log(data);
                    break;
                default:
                    break;
            }
            callback();
        });

        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });
    }
}

export default new Background();
