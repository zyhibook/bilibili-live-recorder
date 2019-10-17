import { sleep } from '../../share';

const $script = document.createElement('script');
$script.src = chrome.extension.getURL('injected/index.js');
$script.onload = () => $script.remove();
(document.head || document.body || document.documentElement).appendChild($script);

const $style = document.createElement('link');
$style.rel = 'stylesheet';
$style.type = 'text/css';
$style.href = chrome.extension.getURL('injected/index.css');
sleep().then(() => document.head.appendChild($style));

window.addEventListener('message', event => {
    if (event.origin !== 'https://live.bilibili.com') return;
    const { type, data } = event.data;
    switch (type) {
        case 'buffer':
            console.log(data);
            break;
        default:
            break;
    }
});
