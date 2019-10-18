import 'crx-hotreload';

class Background {
    constructor() {
        chrome.notifications.onClicked.addListener(id => {
            chrome.notifications.clear(id);
        });

        // chrome.extension.getBackgroundPage()
    }
}

export default new Background();
