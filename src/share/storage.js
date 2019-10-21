export default class Storage {
    constructor() {
        this.name = 'bilibili-live-recorder';
    }

    get(key) {
        const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : storage;
    }

    set(key, value) {
        const storage = { ...this.get(), [key]: value };
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    del(key) {
        const storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    clean() {
        window.localStorage.removeItem(this.name);
    }
}
