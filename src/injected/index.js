var bilibiliLiveRecorderInjected = (function () {
  'use strict';

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

  var Injected =
  /*#__PURE__*/
  function () {
    function Injected() {
      classCallCheck(this, Injected);

      this.name = 'bilibili-live-recorder';
      this.storage = new Storage(this.name);
      this.createUI();

      if (this.storage.get(location.href)) {
        this.storage.del(location.href);
        this.intercept();
      }
    } // 创建UI


    createClass(Injected, [{
      key: "createUI",
      value: function createUI() {
        this.$container = document.createElement('div');
        this.$container.classList.add(this.name);
        this.$container.innerHTML = "\n            <div class=\"".concat(this.name, "-states\">\n                <div class=\"").concat(this.name, "-state ").concat(this.name, "-state-before-record show\">\u5F00\u59CB\u5F55\u5236</div>\n                <div class=\"").concat(this.name, "-state ").concat(this.name, "-state-recording\">\u505C\u6B62\u5F55\u5236</div>\n                <div class=\"").concat(this.name, "-state ").concat(this.name, "-state-after-record\">\u4E0B\u8F7D\u89C6\u9891</div>\n            </div>\n            <div class=\"").concat(this.name, "-monitor\">\n                <div class=\"").concat(this.name, "-monitor-top\">\u65F6\u957F\uFF1A24:23:59</div>\n                <div class=\"").concat(this.name, "-monitor-bottom\">\u5927\u5C0F\uFF1A12.345M</div>\n            </div>\n            <div class=\"").concat(this.name, "-handle\"></div>\n        ");
        document.body.appendChild(this.$container);
      } // 开始录制

    }, {
      key: "start",
      value: function start() {
        this.storage.set(location.href, 1);
      } // 拦截视频流

    }, {
      key: "intercept",
      value: function intercept() {
        var read = ReadableStreamDefaultReader.prototype.read;
        var that = this;

        ReadableStreamDefaultReader.prototype.read = function () {
          var promiseResult = read.call(this);
          promiseResult.then(function (_ref) {
            var done = _ref.done,
                value = _ref.value;
            if (done) return;
            that.read(value.slice());
          });
          return promiseResult;
        };
      }
    }, {
      key: "read",
      value: function read(uint8) {//
      }
    }]);

    return Injected;
  }();

  var index = new Injected();

  return index;

}());
//# sourceMappingURL=index.js.map
