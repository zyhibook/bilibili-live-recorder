import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { bilibili, github, webstore } from '../../constant';

export default new Vue({
    el: '#app',
    data: {
        manifest: chrome.runtime.getManifest(),
        panel: 'panel_basis',
        state: 'before_record',
        isBilibili: true,
        range: 10,
        name: '',
    },
    mounted() {
        chrome.tabs.query(
            {
                active: true,
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    this.isBilibili = tab.url.startsWith(bilibili);
                    this.name = tab.title;
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
        showPanel(panel) {
            this.panel = panel;
        },
    },
});
