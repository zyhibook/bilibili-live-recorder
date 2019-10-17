(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Popup = factory());
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

  var bilibili = 'https://live.bilibili.com';
  var github = 'https://github.com/zhw2590582/bilibili-live-downloader';
  var webstore = 'https://chrome.google.com/webstore/category/extensions';

  var Popup =
  /*#__PURE__*/
  function () {
    function Popup() {
      classCallCheck(this, Popup);

      this.$headerItems = Array.from(document.querySelectorAll('.header .item'));
      this.$mainPanels = Array.from(document.querySelectorAll('.main .panel'));
      this.$fileName = document.querySelector('.fileName');
      this.$disabled = document.querySelector('.disabled');
      this.$limit = document.querySelector('.limit');
      this.$limitSize = document.querySelector('.limit_size');
      this.$limitDuration = document.querySelector('.limit_duration');
      this.$size = document.querySelector('.size');
      this.$duration = document.querySelector('.duration');
      this.$fileSize = document.querySelector('.fileSize');
      this.$fileDuration = document.querySelector('.fileDuration');
      this.$version = document.querySelector('.version');
      this.$feedback = document.querySelector('.feedback');
      this.initInfo();
      this.initSwitch();
      this.initLimit();

      var _chrome$runtime$getMa = chrome.runtime.getManifest(),
          version = _chrome$runtime$getMa.version;

      this.$version.textContent = version;
      this.$version.addEventListener('click', function () {
        chrome.tabs.create({
          url: webstore
        });
      });
      this.$feedback.addEventListener('click', function () {
        chrome.tabs.create({
          url: github
        });
      });
    }

    createClass(Popup, [{
      key: "initInfo",
      value: function initInfo() {
        var _this = this;

        chrome.tabs.query({
          active: true
        }, function (tabs) {
          if (tabs && tabs[0]) {
            var tab = tabs[0];

            if (tab.url.startsWith(bilibili)) {
              _this.$fileName.value = tab.title;
            }
          }
        });
      }
    }, {
      key: "initSwitch",
      value: function initSwitch() {
        var _this2 = this;

        this.$headerItems.forEach(function ($item, $index) {
          $item.addEventListener('click', function () {
            _this2.$headerItems.forEach(function (item) {
              if ($item === item) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });

            _this2.$mainPanels.forEach(function (item, index) {
              if ($index === index) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });
          });
        });
      }
    }, {
      key: "initLimit",
      value: function initLimit() {
        var _this3 = this;

        this.$fileSize.addEventListener('change', function () {
          _this3.$size.textContent = _this3.$fileSize.value + 'M';
        });
        this.$fileDuration.addEventListener('change', function () {
          _this3.$duration.textContent = _this3.$fileDuration.value + '分钟';
        });
        this.$limit.addEventListener('change', function () {
          [_this3.$limitSize, _this3.$limitDuration].forEach(function ($item) {
            if ($item.classList.contains(_this3.$limit.value)) {
              $item.classList.add('active');
            } else {
              $item.classList.remove('active');
            }
          });
        });
      }
    }]);

    return Popup;
  }();

  var index = new Popup();

  return index;

}));
//# sourceMappingURL=index.js.map
