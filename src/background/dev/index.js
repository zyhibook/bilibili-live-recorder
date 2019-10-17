import 'crx-hotreload';

class Background {
    constructor() {
        console.log(this.constructor.name);
        chrome.browserAction.setBadgeText({ text: '5' });
        chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
    }
}

export default new Background();
