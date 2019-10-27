(function () {
    'use strict';

    var manifest = chrome.runtime.getManifest();
    var $version = document.querySelector('.version');
    var $feedback = document.querySelector('.feedback');
    var $donate = document.querySelector('.donate img');
    var $footer = document.querySelector('.footer');
    $version.textContent = manifest.version;
    $donate.src = chrome.extension.getURL('icons/donate.png');
    $version.addEventListener('click', function () {
      chrome.tabs.create({
        url: 'https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml'
      });
    });
    $feedback.addEventListener('click', function () {
      chrome.tabs.create({
        url: 'https://github.com/zhw2590582/bilibili-live-recorder'
      });
    });
    $footer.addEventListener('click', function () {
      chrome.tabs.create({
        url: 'https://live.bilibili.com?blr'
      });
    });

}());
//# sourceMappingURL=index.js.map
