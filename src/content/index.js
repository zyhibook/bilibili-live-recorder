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

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  var bilibili = 'https://live.bilibili.com';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var FlvParser =
  /*#__PURE__*/
  function () {
    function FlvParser() {
      classCallCheck(this, FlvParser);

      this.data = new Uint8Array();
    }

    createClass(FlvParser, [{
      key: "load",
      value: function load() {//
      }
    }, {
      key: "download",
      value: function download() {//
      }
    }]);

    return FlvParser;
  }();

  var MP4Parser =
  /*#__PURE__*/
  function () {
    function MP4Parser() {
      classCallCheck(this, MP4Parser);

      this.data = new Uint8Array();
    }

    createClass(MP4Parser, [{
      key: "load",
      value: function load() {//
      }
    }, {
      key: "download",
      value: function download() {//
      }
    }]);

    return MP4Parser;
  }();

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
    var flv = new FlvParser();
    var mp4 = new MP4Parser();
    window.addEventListener('message', function (event) {
      if (event.origin !== bilibili) return;
      var _event$data = event.data,
          type = _event$data.type,
          data = _event$data.data;

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
  };

  var index = new Content();

  return index;

}));
//# sourceMappingURL=index.js.map
