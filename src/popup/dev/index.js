import './index.scss';

const manifest = chrome.runtime.getManifest();
const $version = document.querySelector('.version');
const $feedback = document.querySelector('.feedback');
const $donate = document.querySelector('.donate img');
const $footer = document.querySelector('.footer');

$version.textContent = manifest.version;

$donate.src = chrome.extension.getURL('icons/donate.png');

$version.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml' });
});

$feedback.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/zhw2590582/bilibili-live-recorder' });
});

$footer.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://live.bilibili.com?blr' });
});
