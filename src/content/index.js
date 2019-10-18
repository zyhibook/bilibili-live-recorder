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

  function isLiveRoom(url) {
    var urlObj = new URL(url);
    var isBilibili = urlObj.origin === BILIBILI;
    var roomId = urlObj.pathname.slice(1);
    var isRoom = /^\d+$/.test(roomId);
    return isBilibili && isRoom ? roomId : false;
  }
  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage() {
      classCallCheck(this, Storage);
    }

    createClass(Storage, [{
      key: "get",
      value: function get(key, defaultValue) {
        var _this = this;

        return new Promise(function (resolve) {
          chrome.storage.local.get([String(key)], function (result) {
            if (result[key]) {
              resolve(result[key]);
            } else if (defaultValue) {
              _this.set(key, defaultValue).then(function (value) {
                resolve(value);
              });
            } else {
              resolve();
            }
          });
        });
      }
    }, {
      key: "set",
      value: function set(key, value) {
        return new Promise(function (resolve) {
          chrome.storage.local.set(defineProperty({}, key, value), function () {
            resolve(value);
          });
        });
      }
    }, {
      key: "remove",
      value: function remove(key) {
        chrome.storage.local.remove(String(key));
      }
    }, {
      key: "onChanged",
      value: function onChanged(key, callback) {
        chrome.storage.onChanged.addListener(function (changes) {
          if (changes[key] && changes[key].newValue) {
            callback(changes[key].newValue);
          }
        });
      }
    }]);

    return Storage;
  }();

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
      value: function load(buf) {//
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
      this.storage = new Storage();
      this.flv = new FlvRemuxer(this);
      this.roomId = isLiveRoom(location.href);

      if (this.roomId) {
        this.storage.get(this.roomId).then(function (config) {
          if (config) {
            _this.config = config;
          }
        });
        this.storage.onChanged(this.roomId, function (config) {
          _this.config = config;
        });
        window.addEventListener('beforeunload', function () {
          _this.storage.remove(_this.roomId);
        });
      }

      window.addEventListener('message', function (event) {
        if (event.origin !== BILIBILI) return;
        var _event$data = event.data,
            type = _event$data.type,
            data = _event$data.data;
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
