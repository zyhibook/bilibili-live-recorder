export default class Storage {
    get(key, defaultValue) {
        return new Promise(resolve => {
            chrome.storage.local.get([String(key)], result => {
                if (result[key]) {
                    resolve(result[key]);
                } else if (defaultValue) {
                    this.set(key, defaultValue).then(value => {
                        resolve(value);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    set(key, value) {
        return new Promise(resolve => {
            chrome.storage.local.set(
                {
                    [key]: value,
                },
                () => {
                    resolve(value);
                },
            );
        });
    }

    remove(key) {
        chrome.storage.local.remove(String(key));
    }

    onChanged(key, callback) {
        chrome.storage.onChanged.addListener(changes => {
            if (changes[key] && changes[key].newValue) {
                callback(changes[key].newValue);
            }
        });
    }
}
