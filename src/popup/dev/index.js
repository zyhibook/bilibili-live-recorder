import 'normalize.css';
import './index.scss';

const manifest = chrome.runtime.getManifest();
const $version = document.querySelector('.version');
const $feedback = document.querySelector('.feedback');

$version.textContent = manifest.version;

$version.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml' });
});

$feedback.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/zhw2590582/bilibili-live-recorder' });
});
