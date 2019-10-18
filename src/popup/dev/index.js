import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { notify, isLiveRoom } from '../../share';
import {
    GITHUB,
    WEBSTORE,
    RECORDING,
    STOP_RECORD,
    AFTER_RECORD,
    START_RECORD,
    BEFORE_RECORD,
    TITLE_REPLACE,
    UPDATE_CONFIG,
    START_DOWNLOAD,
    OPEN_LIVE,
    RECORD_CREATED,
    RECORD_STOP,
    RECORD_DOWNLOAD,
} from '../../share/constant';

export default new Vue({
    el: '#app',
    data: {
        RECORDING,
        AFTER_RECORD,
        BEFORE_RECORD,
        liveRoom: true,
        panel: 'panel_basis',
        manifest: chrome.runtime.getManifest(),
        logo: chrome.extension.getURL('icons/icon48.png'),
        donate: chrome.extension.getURL('icons/donate.png'),
        config: {
            url: '',
            name: '',
            room: '',
            chunk: 0,
            debug: '',
            duration: 10,
            format: 'flv',
            currentSize: 0,
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
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    const liveRoom = isLiveRoom(tab.url);
                    this.liveRoom = liveRoom;
                    if (liveRoom) {
                        this.config.url = tab.url;
                        this.config.name = tab.title.replace(TITLE_REPLACE, '');
                    }
                }
            },
        );

        chrome.runtime.onMessage.addListener(request => {
            const { type, data } = request;
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
        startRecord() {
            if (this.liveRoom) {
                chrome.runtime.sendMessage(
                    {
                        type: START_RECORD,
                        data: { ...this.config },
                    },
                    () => {
                        notify(RECORD_CREATED, this.fileUrl);
                    },
                );
            } else {
                notify(OPEN_LIVE);
            }
        },
        stopRecord() {
            chrome.runtime.sendMessage(
                {
                    type: STOP_RECORD,
                },
                () => {
                    notify(RECORD_STOP, this.fileUrl);
                },
            );
        },
        startDownload() {
            chrome.runtime.sendMessage(
                {
                    type: START_DOWNLOAD,
                },
                () => {
                    notify(RECORD_DOWNLOAD, this.fileUrl);
                },
            );
        },
    },
});
