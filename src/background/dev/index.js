import 'crx-hotreload';

class Background {
    constructor() {
        console.log(this.constructor.name);
        chrome.browserAction.setBadgeText({ text: 'ON' });
        chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
    }
}

export default new Background();
