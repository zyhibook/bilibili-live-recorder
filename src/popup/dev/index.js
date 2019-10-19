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
    TITLE_PATTERN,
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
                    this.isLiveRoom = LIVE_ROOM_PATTERN.test(tab.url);
                    this.config.id = tab.id;
                    this.config.url = tab.url;
                    this.config.name = tab.title.replace(TITLE_PATTERN, '');

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
        openDebug() {
            const debug = URL.createObjectURL(new Blob([this.config.debug]));
            chrome.tabs.create({ url: debug });
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
                    const config = {
                        ...this.config,
                        state: RECORDING,
                    };
                    this.sendMessage(
                        {
                            type: START_RECORD,
                            data: config,
                        },
                        () => {
                            this.config = config;
                            this.setBadgeText('ON', '#fb7299');
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
            const config = {
                ...this.config,
                state: AFTER_RECORD,
            };
            this.sendMessage(
                {
                    type: STOP_RECORD,
                    data: config,
                },
                () => {
                    this.config = config;
                    this.setBadgeText('OK', '#23ade5');
                },
            );
        },
        startDownload() {
            const config = {
                ...this.config,
                state: BEFORE_RECORD,
            };
            this.sendMessage(
                {
                    type: START_DOWNLOAD,
                    data: config,
                },
                () => {
                    this.config = config;
                    this.setBadgeText('');
                },
            );
        },
    },
});
