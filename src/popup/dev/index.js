import 'normalize.css';
import './index.scss';
import Vue from 'vue/dist/vue';
import { bilibili, github, webstore } from '../../constant';

export default new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        panel: 'panel_basis',
        state: 'before_record',
    },
    mounted() {
        chrome.tabs.query(
            {
                active: true,
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    console.log(tab);
                    // const { version } = chrome.runtime.getManifest();
                    // this.$version.textContent = version;
                    // this.$version.addEventListener('click', () => {
                    //     chrome.tabs.create({ url: webstore });
                    // });
                    // this.$feedback.addEventListener('click', () => {
                    //     chrome.tabs.create({ url: github });
                    // });
                }
            },
        );
    },
    methods: {
        showPanel(panel) {
            this.panel = panel;
        },
    },
});
