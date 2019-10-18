(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Content = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  var BILIBILI = 'https://live.bilibili.com';
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  var Content = function Content() {
    classCallCheck(this, Content);

    var $script = document.createElement('script');
    $script.src = chrome.extension.getURL('injected/index.js');

    $script.onload = function () {
      return $script.remove();
    };

    (document.head || document.body || document.documentElement).appendChild($script);
    var $style = document.createElement('link');
    $style.rel = 'stylesheet';
    $style.type = 'text/css';
    $style.href = chrome.extension.getURL('injected/index.css');
    sleep().then(function () {
      return document.head.appendChild($style);
    });
    window.addEventListener('message', function (event) {
      if (event.origin !== BILIBILI) return;
      var _event$data = event.data,
          type = _event$data.type,
          data = _event$data.data;

      switch (type) {
        case MP4_BUFFER:
          chrome.runtime.sendMessage({
            type: MP4_BUFFER,
            data: data
          });
          break;

        case FLV_BUFFER:
          chrome.runtime.sendMessage({
            type: FLV_BUFFER,
            data: data
          });
          break;

        default:
          break;
      }
    });
  };

  var index = new Content();

  return index;

}));
//# sourceMappingURL=index.js.map
