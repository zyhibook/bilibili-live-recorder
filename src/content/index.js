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

  var BILIBILI = 'https://live.bilibili.com';
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function mergeBuffer() {
    for (var _len = arguments.length, buffers = new Array(_len), _key = 0; _key < _len; _key++) {
      buffers[_key] = arguments[_key];
    }

    var Cons = buffers[0].constructor;
    return buffers.reduce(function (pre, val) {
      var merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
      merge.set(pre, 0);
      merge.set(val, pre.byteLength | 0);
      return merge;
    }, new Cons());
  }

  var FlvRemuxer =
  /*#__PURE__*/
  function () {
    function FlvRemuxer(bg) {
      classCallCheck(this, FlvRemuxer);

      this.bg = bg;
      this.data = new Uint8Array(10);
    }

    createClass(FlvRemuxer, [{
      key: "load",
      value: function load(buf) {
        this.data = mergeBuffer(this.data, buf);
        this.bg.updateConfig({
          currentSize: (this.data.byteLength / 1024 / 1024).toFixed(3)
        });
      }
    }, {
      key: "stop",
      value: function stop() {//
      }
    }, {
      key: "download",
      value: function download() {//
      }
    }]);

    return FlvRemuxer;
  }();

  var Content =
  /*#__PURE__*/
  function () {
    function Content() {
      var _this = this;

      classCallCheck(this, Content);

      this.injectScript();
      this.injectStyle();
      this.config = {};
      this.flv = new FlvRemuxer(this);
      window.addEventListener('message', function (event) {
        if (event.origin !== BILIBILI) return;
        var _event$data = event.data,
            type = _event$data.type,
            data = _event$data.data;

        switch (type) {
          case MP4_BUFFER:
            break;

          case FLV_BUFFER:
            _this.flv.load(data);

            break;

          default:
            break;
        }
      });
      chrome.runtime.onMessage.addListener(function (request, sender, callback) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case START_RECORD:
            _this.config = data;
            break;

          case STOP_RECORD:
            _this.flv.stop();

            break;

          case START_DOWNLOAD:
            _this.flv.download();

          default:
            break;
        }

        callback();
      });
    }

    createClass(Content, [{
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
