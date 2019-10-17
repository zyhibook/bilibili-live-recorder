import { sleep } from '../../share';
import FLVParser from './FLVParser';
import MP4Parser from './MP4Parser';

const $script = document.createElement('script');
$script.src = chrome.extension.getURL('injected/index.js');
$script.onload = () => $script.remove();
(document.head || document.body || document.documentElement).appendChild($script);

const $style = document.createElement('link');
$style.rel = 'stylesheet';
$style.type = 'text/css';
$style.href = chrome.extension.getURL('injected/index.css');
sleep().then(() => document.head.appendChild($style));

const flv = new FLVParser();
const mp4 = new MP4Parser();
window.addEventListener('message', event => {
    if (event.origin !== 'https://live.bilibili.com') return;
    const { type, data } = event.data;
    switch (type) {
        case 'MP4Buffer':
            mp4.load(data);
            break;
        case 'FLVBuffer':
            flv.load(data);
            break;
        case 'MP4Download':
            mp4.download();
            break;
        case 'FLVDownload':
            flv.download();
            break;
        default:
            break;
    }
});
