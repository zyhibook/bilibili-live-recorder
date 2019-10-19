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

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  // 常用地址
  var LIVE = 'https://live.bilibili.com';

  var TAB_INFO = 'tab_info';
  var START_RECORD = 'start_record';
  var STOP_RECORD = 'stop_record';
  var START_DOWNLOAD = 'start_download';
  var UPDATE_CONFIG = 'update_config';
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer'; // 语言

  var Content =
  /*#__PURE__*/
  function () {
    function Content() {
      var _this = this;

      classCallCheck(this, Content);

      this.injectScript();
      this.injectStyle();
      this.tab = null;
      this.config = null;
      this.worker = new Worker(URL.createObjectURL(new Blob(["\"use strict\";var FLV_BUFFER=\"flv_buffer\",START_RECORD=\"start_record\",START_DOWNLOAD=\"start_download\",STOP_RECORD=\"stop_record\";onmessage=function onmessage(a){var b=a.data,c=b.type,d=b.data;switch(c){case FLV_BUFFER:break;case START_DOWNLOAD:break;case START_RECORD:break;case STOP_RECORD:break;default:}};"]))); // 来自 worker

      this.worker.onmessage = function (event) {
        var _event$data = event.data,
            type = _event$data.type,
            data = _event$data.data;
      }; // 来自 popup


      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case TAB_INFO:
            _this.tab = data;
            break;

          case START_RECORD:
            _this.config = data;

            _this.worker.postMessage({
              type: START_RECORD,
              data: data
            });

            break;

          case START_DOWNLOAD:
            _this.config = data;

            _this.worker.postMessage({
              type: START_DOWNLOAD,
              data: data
            });

            break;

          case STOP_RECORD:
            _this.config = data;

            _this.worker.postMessage({
              type: STOP_RECORD,
              data: data
            });

            break;

          default:
            break;
        }

        sendResponse(_this.config);
      }); // 来自 injected

      window.addEventListener('message', function (event) {
        if (event.origin !== LIVE) return;
        var _event$data2 = event.data,
            type = _event$data2.type,
            data = _event$data2.data;

        switch (type) {
          case MP4_BUFFER:
            break;

          case FLV_BUFFER:
            _this.worker.postMessage({
              type: FLV_BUFFER,
              data: data
            });

            break;

          default:
            break;
        }
      });
    }

    createClass(Content, [{
      key: "updateConfig",
      value: function updateConfig(config) {
        chrome.runtime.sendMessage({
          type: UPDATE_CONFIG,
          data: config
        });
      }
    }, {
      key: "injectScript",
      value: function injectScript() {
        var $script = document.createElement('script');
        $script.src = chrome.extension.getURL('injected/index.js');

        $script.onload = function () {
          return $script.remove();
        };

        document.documentElement.appendChild($script);
      }
    }, {
      key: "injectStyle",
      value: function injectStyle() {
        var $style = document.createElement('link');
        $style.rel = 'stylesheet';
        $style.type = 'text/css';
        $style.href = chrome.extension.getURL('injected/index.css');
        sleep().then(function () {
          return document.head.appendChild($style);
        });
      }
    }]);

    return Content;
  }();

  var index = new Content();

  return index;

}));
//# sourceMappingURL=index.js.map
