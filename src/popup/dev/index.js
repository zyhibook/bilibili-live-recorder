import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import {
    LIVE,
    GITHUB,
    TAB_INFO,
    WEBSTORE,
    RECORDING,
    AFTER_RECORD,
    BEFORE_RECORD,
    TITLE_PATTERN,
    START_RECORD,
    STOP_RECORD,
    START_DOWNLOAD,
    UPDATE_CONFIG,
    LIVE_ROOM_PATTERN,
} from '../../share/constant';

export default new Vue({
    el: '#app',
    data: {
        tab: {},
        RECORDING,
        AFTER_RECORD,
        BEFORE_RECORD,
        isLiveRoom: false,
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
            downloadRate: 0,
            writeRate: 0,
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
                    this.config.id = tab.id;
                    this.config.url = tab.url;
                    const isLiveRoom = LIVE_ROOM_PATTERN.test(tab.url);
                    this.isLiveRoom = isLiveRoom;
                    this.config.name = tab.title.replace(TITLE_PATTERN, '');
                    if (!isLiveRoom) return;

                    // 发到 content
                    this.sendMessage(
                        {
                            type: TAB_INFO,
                            data: tab,
                        },
                        config => {
                            console.log(config);
                            if (config) {
                                this.config = config;
                            }
                        },
                    );

                    // 来自 content
                    chrome.runtime.onMessage.addListener(request => {
                        const { type, data } = request;
                        switch (type) {
                            case UPDATE_CONFIG:
                                if (this.config.state !== RECORDING) return;
                                this.config = {
                                    ...this.config,
                                    ...data,
                                };
                                break;
                            default:
                                break;
                        }
                    });
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
        goLive() {
            chrome.tabs.create({ url: LIVE });
        },
        showPanel(panel) {
            this.panel = panel;
        },
        openDebug() {
            const base64 = btoa(unescape(encodeURIComponent(this.config.debug)));
            const debug = 'data:text/plain;charset=UTF-8;base64,' + base64;
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
            const config = {
                ...this.config,
                name: this.config.name.trim() ? this.config.name.trim() : Date.now(),
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
