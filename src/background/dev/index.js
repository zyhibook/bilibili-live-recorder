import 'crx-hotreload';

class Background {
    constructor() {
        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });
    }
}

export default new Background();
