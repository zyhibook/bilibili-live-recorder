import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import filenamify from 'filenamify';
import { bilibili, github, webstore } from '../../constant';
import { notify } from '../../share';

export default new Vue({
    el: '#app',
    data: {
        manifest: chrome.runtime.getManifest(),
        logo: chrome.extension.getURL('icons/icon48.png'),
        donate: chrome.extension.getURL('icons/donate.png'),
        panel: 'panel_basis',
        state: 'before_record',
        isBilibili: true,
        config: {
            name: '',
            format: 'flv',
            url: '',
            duration: 10,
            room: '',
        },
        file: {
            duration: 0,
            size: 0,
            debug: '',
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
                    const url = new URL(tab.url);
                    this.isBilibili = url.origin === bilibili;
                    this.config.name = tab.title;
                    this.config.url = url.origin + url.pathname;
                    this.config.room = url.pathname.slice(1);
                }
            },
        );
    },
    methods: {
        goWebstore() {
            chrome.tabs.create({ url: webstore });
        },
        goGithub() {
            chrome.tabs.create({ url: github });
        },
        goRoom() {
            chrome.tabs.create({ url: this.config.url });
        },
        showPanel(panel) {
            this.panel = panel;
        },
        startRecord() {
            if (this.isBilibili && this.config.room) {
                this.config.name = filenamify(this.config.name);
                this.state = 'start_record';
                notify('录制任务创建成功！', this.fileUrl);
            } else {
                notify('请先打开Bilibili直播间');
            }
        },
        stopRecord() {
            this.state = 'after_record';
            notify('录制任务已经停止，可以下载了', this.fileUrl);
        },
        startDownload() {
            this.state = 'before_record';
            notify('录制文件开始下载！', this.fileUrl);
        },
    },
});
