import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import {
    LIVE,
    GITHUB,
    TAB_INFO,
    WEBSTORE,
    RECORDING,
    DOWNLOADING,
    AFTER_RECORD,
    BEFORE_RECORD,
    TITLE_PATTERN,
    START_RECORD,
    STOP_RECORD,
    START_DOWNLOAD,
    UPDATE_CONFIG,
    LIVE_ROOM_PATTERN,
} from '../../share/constant';

const baseConfig = {
    id: 0,
    url: '',
    name: '',
    format: 'flv',
    currentSize: 0,
    maxDuration: 10,
    expectedSize: 0,
    currentDuration: 0,
    downloadRate: 0,
    writeRate: 0,
    state: BEFORE_RECORD,
};

export default new Vue({
    el: '#app',
    data: {
        tab: {},
        RECORDING,
        DOWNLOADING,
        AFTER_RECORD,
        BEFORE_RECORD,
        isLiveRoom: false,
        panel: 'panel_basis',
        manifest: chrome.runtime.getManifest(),
        logo: chrome.extension.getURL('icons/icon48.png'),
        donate: chrome.extension.getURL('icons/donate.png'),
        config: baseConfig,
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
                            if (config) {
                                this.config = config;
                            }
                        },
                    );

                    // 来自 content
                    chrome.runtime.onMessage.addListener(request => {
                        const { type, data } = request;
                        if (tab.id !== data.id) return;
                        switch (type) {
                            case UPDATE_CONFIG:
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
        sendMessage(data, callback = () => null) {
            chrome.tabs.sendMessage(this.tab.id, data, callback);
        },
        startRecord() {
            const config = {
                ...baseConfig,
                name: this.config.name.trim() || Date.now(),
                state: RECORDING,
            };
            this.config = config;
            this.sendMessage({
                type: START_RECORD,
                data: config,
            });
        },
        stopRecord() {
            const config = {
                ...this.config,
                state: AFTER_RECORD,
            };
            this.config = config;
            this.sendMessage({
                type: STOP_RECORD,
                data: config,
            });
        },
        startDownload() {
            const config = {
                ...this.config,
                state: DOWNLOADING,
            };
            this.config = config;
            this.sendMessage({
                type: START_DOWNLOAD,
                data: config,
            });
        },
    },
});
