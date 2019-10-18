import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { notify, isBilibiliRoom } from '../../share';
import { GITHUB, WEBSTORE, BEFORE_RECORD, START_RECORD, STOP_RECORD, START_DOWNLOAD } from '../../constant';

export default new Vue({
    el: '#app',
    data: {
        bilibiliRoom: true,
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
                    const bilibiliRoom = isBilibiliRoom(tab.url);
                    this.bilibiliRoom = bilibiliRoom;
                    if (bilibiliRoom) {
                        this.config.url = tab.url;
                        this.config.name = tab.title;
                    }
                }
            },
        );

        chrome.runtime.onMessage.addListener(request => {
            const { type, data } = request;
            switch (type) {
                case 'config':
                    this.config = data;
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
            if (this.bilibiliRoom) {
                chrome.runtime.sendMessage(
                    {
                        type: START_RECORD,
                        data: { ...this.config },
                    },
                    () => {
                        notify('录制任务创建成功！', this.fileUrl);
                    },
                );
            } else {
                notify('请先打开Bilibili直播间');
            }
        },
        stopRecord() {
            chrome.runtime.sendMessage(
                {
                    type: STOP_RECORD,
                    data: { ...this.config },
                },
                () => {
                    notify('录制任务已经停止', this.fileUrl);
                },
            );
        },
        startDownload() {
            chrome.runtime.sendMessage(
                {
                    type: START_DOWNLOAD,
                    data: { ...this.config },
                },
                () => {
                    notify('录制文件开始下载！', this.fileUrl);
                },
            );
        },
    },
});
