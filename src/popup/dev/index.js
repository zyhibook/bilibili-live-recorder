import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { notify } from '../../share';
import {
    GITHUB,
    TAB_INFO,
    WEBSTORE,
    RECORDING,
    AFTER_RECORD,
    BEFORE_RECORD,
    TITLE_REPLACE,
    OPEN_LIVE,
    START_RECORD,
    STOP_RECORD,
    START_DOWNLOAD,
    FILE_NAME,
    LIVE_ROOM_PATTERN,
} from '../../share/constant';

export default new Vue({
    el: '#app',
    data: {
        tab: {},
        RECORDING,
        AFTER_RECORD,
        BEFORE_RECORD,
        isLiveRoom: true,
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

                    const isLiveRoom = LIVE_ROOM_PATTERN.test(tab.url);
                    this.isLiveRoom = isLiveRoom;
                    if (!isLiveRoom) return;

                    this.config.id = tab.id;
                    this.config.url = tab.url;
                    this.config.name = tab.title.replace(TITLE_REPLACE, '');

                    this.sendMessage(
                        {
                            type: TAB_INFO,
                            data: tab,
                        },
                        config => {
                            if (config) {
                                this.config = config;
                            }
                        },
                    );
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
        showPanel(panel) {
            this.panel = panel;
        },
        setBadgeText(text, background) {
            chrome.browserAction.setBadgeText({ text: text, tabId: this.tab.id });
            chrome.browserAction.setBadgeBackgroundColor({ color: background || 'red' });
        },
        sendMessage(data, callback = () => null) {
            chrome.tabs.sendMessage(this.tab.id, data, callback);
        },
        startRecord() {
            if (this.isLiveRoom) {
                if (this.config.name.trim()) {
                    this.sendMessage(
                        {
                            type: START_RECORD,
                            data: {
                                ...this.config,
                                state: RECORDING,
                            },
                        },
                        config => {
                            if (config) {
                                this.config = config;
                                this.setBadgeText('ON', '#fb7299');
                            }
                        },
                    );
                } else {
                    notify(FILE_NAME);
                }
            } else {
                notify(OPEN_LIVE);
            }
        },
        stopRecord() {
            this.sendMessage(
                {
                    type: STOP_RECORD,
                    data: {
                        ...this.config,
                        state: AFTER_RECORD,
                    },
                },
                config => {
                    if (config) {
                        this.config = config;
                        this.setBadgeText('OK', '#23ade5');
                    }
                },
            );
        },
        startDownload() {
            this.sendMessage(
                {
                    type: START_DOWNLOAD,
                    data: {
                        ...this.config,
                        state: BEFORE_RECORD,
                    },
                },
                config => {
                    if (config) {
                        this.config = config;
                        this.setBadgeText('');
                    }
                },
            );
        },
    },
});
