(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Content = factory());
}(this, function () { 'use strict';

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
  function download(url, name) {
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(name) {
      classCallCheck(this, Storage);

      this.name = name;
    }

    createClass(Storage, [{
      key: "get",
      value: function get(key) {
        var storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : storage;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var storage = _objectSpread({}, this.get(), defineProperty({}, key, value));

        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "del",
      value: function del(key) {
        var storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "clean",
      value: function clean() {
        window.localStorage.removeItem(this.name);
      }
    }]);

    return Storage;
  }();

  // 常用
  var LIVE = 'https://live.bilibili.com';

  var BEFORE_RECORD = 'before_record';
  var RECORDING = 'recording';

  var TAB_INFO = 'tab_info';
  var START_RECORD = 'start_record';
  var STOP_RECORD = 'stop_record';
  var START_DOWNLOAD = 'start_download';
  var UPDATE_CONFIG = 'update_config';
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';
  var NOTIFY = 'notify';

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Content =
  /*#__PURE__*/
  function () {
    function Content() {
      var _this = this;

      classCallCheck(this, Content);

      this.injectScript();
      this.injectStyle();
      this.tab = null;
      this.worker = new Worker('./flv-remuxer.js');
      this.storage = new Storage('bilibili-live-recorder');
      this.config = this.storage.get(location.href);
      this.storage.del(location.href);

      if (this.config) {
        this.worker.postMessage({
          type: START_RECORD,
          data: this.config
        });
      } // 来自 worker


      this.worker.onmessage = function (event) {
        var _event$data = event.data,
            type = _event$data.type,
            data = _event$data.data;

        switch (type) {
          case NOTIFY:
            _this.notify(data);

            break;

          case UPDATE_CONFIG:
            _this.updateConfig(data);

            break;

          case START_DOWNLOAD:
            console.log('4');

            _this.download(data);

            break;

          default:
            break;
        }
      }; // 来自 popup


      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case TAB_INFO:
            _this.tab = data;
            break;

          case START_RECORD:
            var $video = document.querySelector('video');

            if ($video) {
              _this.storage.set(location.href, data);

              _this.worker.terminate();

              location.reload();
            } else {
              _this.notify({
                message: '未找到视频播放器'
              });

              _this.updateConfig({
                state: BEFORE_RECORD
              });
            }

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
        if (event.origin === LIVE && _this.config && _this.config.state === RECORDING) {
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
        }
      });
    }

    createClass(Content, [{
      key: "download",
      value: function download$1(data) {
        var name = this.config.name + '.' + this.config.format;

        download(data, name);

        this.updateConfig({
          state: BEFORE_RECORD
        });
      }
    }, {
      key: "notify",
      value: function notify(data) {
        chrome.runtime.sendMessage({
          type: NOTIFY,
          data: data
        });
      }
    }, {
      key: "updateConfig",
      value: function updateConfig(data) {
        this.config = _objectSpread$1({}, this.config, {}, data);
        chrome.runtime.sendMessage({
          type: UPDATE_CONFIG,
          data: this.config
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
