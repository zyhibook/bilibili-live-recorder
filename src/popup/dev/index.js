import 'normalize.css';
import './index.scss';
import { bilibili, github, webstore } from '../../constant';

class Popup {
    constructor() {
        this.$headerItems = Array.from(document.querySelectorAll('.header .item'));
        this.$mainPanels = Array.from(document.querySelectorAll('.main .panel'));
        this.$fileName = document.querySelector('.fileName');
        this.$disabled = document.querySelector('.disabled');
        this.$limit = document.querySelector('.limit');
        this.$limitSize = document.querySelector('.limit_size');
        this.$limitDuration = document.querySelector('.limit_duration');
        this.$size = document.querySelector('.size');
        this.$duration = document.querySelector('.duration');
        this.$fileSize = document.querySelector('.fileSize');
        this.$fileDuration = document.querySelector('.fileDuration');
        this.$version = document.querySelector('.version');
        this.$feedback = document.querySelector('.feedback');

        this.initInfo();
        this.initSwitch();
        this.initLimit();

        const { version } = chrome.runtime.getManifest();
        this.$version.textContent = version;
        this.$version.addEventListener('click', () => {
            chrome.tabs.create({ url: webstore });
        });
        this.$feedback.addEventListener('click', () => {
            chrome.tabs.create({ url: github });
        });
    }

    initInfo() {
        chrome.tabs.query(
            {
                active: true,
            },
            tabs => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    if (tab.url.startsWith(bilibili)) {
                        this.$fileName.value = tab.title;
                    } else {
                        // this.$disabled.classList.add('show');
                    }
                }
            },
        );
    }

    initSwitch() {
        this.$headerItems.forEach(($item, $index) => {
            $item.addEventListener('click', () => {
                this.$headerItems.forEach(item => {
                    if ($item === item) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                this.$mainPanels.forEach((item, index) => {
                    if ($index === index) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            });
        });
    }

    initLimit() {
        this.$fileSize.addEventListener('change', () => {
            this.$size.textContent = this.$fileSize.value + 'M';
        });
        this.$fileDuration.addEventListener('change', () => {
            this.$duration.textContent = this.$fileDuration.value + '分钟';
        });
        this.$limit.addEventListener('change', () => {
            [this.$limitSize, this.$limitDuration].forEach($item => {
                if ($item.classList.contains(this.$limit.value)) {
                    $item.classList.add('active');
                } else {
                    $item.classList.remove('active');
                }
            });
        });
    }
}

export default new Popup();
