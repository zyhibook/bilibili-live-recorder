(function () {
  'use strict';

  var manifest = chrome.runtime.getManifest();
  var $version = document.querySelector('.version');
  var $feedback = document.querySelector('.feedback');
  $version.textContent = manifest.version;
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

}());
//# sourceMappingURL=index.js.map
