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
    RECORD_CREATED,
    RECORD_STOP,
    RECORD_DOWNLOAD,
} from '../../share/constant';

const storage = new Storage();
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
            id: 0,
            url: '',
            name: '',
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
                lastFocusedWindow: true,
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
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
        startRecord() {
            if (this.liveRoom) {
                storage
                    .set(this.config.id, {
                        ...this.config,
                        state: RECORDING,
                    })
                    .then(() => {
                        notify(RECORD_CREATED, this.fileUrl);
                    });
            } else {
                notify(OPEN_LIVE);
            }
        },
        stopRecord() {
            storage
                .set(this.config.id, {
                    ...this.config,
                    state: AFTER_RECORD,
                })
                .then(() => {
                    notify(RECORD_STOP, this.fileUrl);
                });
        },
        startDownload() {
            storage
                .set(this.config.id, {
                    ...this.config,
                    state: BEFORE_RECORD,
                })
                .then(() => {
                    notify(RECORD_DOWNLOAD, this.fileUrl);
                });
        },
    },
});
