import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { notify, isLiveRoom } from '../../share';
import Storage from '../../share/storage';
import {
    GITHUB,
    WEBSTORE,
    RECORDING,
    AFTER_RECORD,
    BEFORE_RECORD,
    TITLE_REPLACE,
    OPEN_LIVE,
    BEFORE_DOWNLOAD,
    START_RECORD,
    STOP_RECORD,
    START_DOWNLOAD,
    FILE_NAME,
} from '../../share/constant';

const storage = new Storage();
export default new Vue({
    el: '#app',
    data: {
        tab: {},
        RECORDING,
        AFTER_RECORD,
        BEFORE_RECORD,
        liveRoom: true,
        panel: 'panel_basis',
        manifest: chrome.runtime.getManifest(),
        logo: chrome.extension.getURL('icons/icon48.png'),
        donate: chrome.extension.getURL('icons/donate.png'),
        config: {
            id: 0,
            url: '',
            name: '',
            chunk: 0,
            debug: '',
            format: 'flv',
            currentSize: 0,
            maxDuration: 10,
            currentDuration: 0,
            state: BEFORE_RECORD,
            action: BEFORE_DOWNLOAD,
        },
    },
    computed: {
        fileUrl() {
            return this.config.name + '.' + this.config.format;
        },
    },
    mounted() {
        chrome.tabs.query(
            {
                active: true,
                lastFocusedWindow: true,
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    this.tab = tab;
                    const roomId = isLiveRoom(tab.url);
                    this.liveRoom = !!roomId;
                    if (roomId) {
                        this.config.id = roomId;
                        this.config.url = tab.url;
                        this.config.name = tab.title.replace(TITLE_REPLACE, '');
                        storage.get(roomId).then(config => {
                            if (config) {
                                this.config = config;
                            }
                        });
                        storage.onChanged(roomId, config => {
                            this.config = config;
                            switch (config.state) {
                                case RECORDING:
                                    this.setBadgeText('ON', '#fb7299');
                                    break;
                                case AFTER_RECORD:
                                    this.setBadgeText('OK', '#23ade5');
                                    break;
                                case BEFORE_RECORD:
                                    this.setBadgeText('');
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
            },
        );
    },
    methods: {
        goWebstore() {
            chrome.tabs.create({ url: WEBSTORE });
        },
        goGithub() {
            chrome.tabs.create({ url: GITHUB });
        },
        goRoom() {
            chrome.tabs.create({ url: this.config.url });
        },
        showPanel(panel) {
            this.panel = panel;
        },
        setBadgeText(text, background) {
            chrome.browserAction.setBadgeText({ text: text, tabId: this.tab.id });
            chrome.browserAction.setBadgeBackgroundColor({ color: background || 'red' });
        },
        updateConfig(config) {
            storage.set(this.config.id, {
                ...this.config,
                ...config,
            });
        },
        startRecord() {
            if (this.liveRoom) {
                if (this.config.name.trim()) {
                    this.updateConfig({
                        action: START_RECORD,
                    });
                } else {
                    notify(FILE_NAME);
                }
            } else {
                notify(OPEN_LIVE);
            }
        },
        stopRecord() {
            this.updateConfig({
                action: STOP_RECORD,
            });
        },
        startDownload() {
            this.updateConfig({
                action: START_DOWNLOAD,
            });
        },
    },
});
