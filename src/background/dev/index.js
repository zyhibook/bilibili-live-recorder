import 'crx-hotreload';
import {
    START_RECORD,
    STOP_RECORD,
    RECORDING,
    AFTER_RECORD,
    START_DOWNLOAD,
    BEFORE_RECORD,
} from '../../share/constant';

class Background {
    constructor() {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            const { type, data } = request;
            switch (type) {
                case START_RECORD:
                    this.config = data;
                    this.updateConfig({
                        state: RECORDING,
                    });
                    break;
                case STOP_RECORD:
                    this.updateConfig({
                        state: AFTER_RECORD,
                    });
                    break;
                case START_DOWNLOAD:
                    this.updateConfig({
                        state: BEFORE_RECORD,
                    });
                default:
                    break;
            }
            callback();
        });

        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });
    }

    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
        };
    }
}

export default new Background();
