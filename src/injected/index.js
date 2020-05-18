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

  var Injected = /*#__PURE__*/function () {
    function Injected() {
      classCallCheck(this, Injected);

      this.blobs = [];
      this.src = '';
      this.timer = null;
      this.video = null;
      this.stream = null;
      this.mediaRecorder = null;

      if (/^https?:\/\/live/i.test(window.location.href)) {
        this.createUI();
        this.bindEvent();
      }
    }

    createClass(Injected, [{
      key: "log",
      value: function log(msg) {
        throw new Error("\u5F55\u64AD\u59EC --> ".concat(msg));
      }
    }, {
      key: "durationToTime",
      value: function durationToTime(duration) {
        var m = String(Math.floor(duration / 60)).slice(-5);
        var s = String(duration % 60);
        return "".concat(m.length === 1 ? "0".concat(m) : m, ":").concat(s.length === 1 ? "0".concat(s) : s);
      }
    }, {
      key: "mergeBlobs",
      value: function mergeBlobs() {
        var _this = this;

        var blobs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var size = this.size;
        var result = new Blob([]);
        var tasks = blobs.map(function (blob) {
          return function () {
            return new Promise(function (resolve) {
              setTimeout(function () {
                result = new Blob([result, blob]);
                _this.$wait.textContent = "".concat(Math.floor((result.size / size || 0) * 100), "%");
                resolve();
              }, 0);
            });
          };
        });
        return new Promise(function (resolve) {
          (function loop() {
            var task = tasks.shift();

            if (task) {
              task().then(loop);
            } else {
              resolve(result);
            }
          })();
        });
      }
    }, {
      key: "createUI",
      value: function createUI() {
        var _this2 = this;

        this.$container = document.createElement('div');
        this.$container.classList.add('bilibili-live-recorder');
        this.$container.innerHTML = "\n            <div class=\"blr-states\">\n                <div class=\"blr-state blr-state-before-record blr-active\">\u5F00\u59CB</div>\n                <div class=\"blr-state blr-state-recording\">\u505C\u6B62</div>\n                <div class=\"blr-state blr-state-after-record\">\u4E0B\u8F7D</div>\n                <div class=\"blr-state blr-state-wait\">0%</div>\n            </div>\n            <div class=\"blr-monitors\">\n                <div class=\"blr-monitor blr-monitor-top\">\n                    <div class=\"blr-monitor-name\">\u65F6\u957F\uFF1A</div>\n                    <div class=\"blr-monitor-value blr-duration\">00:00</div>\n                </div>\n                <div class=\"blr-monitor blr-monitor-bottom\">\n                    <div class=\"blr-monitor-name\">\u5927\u5C0F\uFF1A</div>\n                    <div class=\"blr-monitor-value blr-size\">0.00M</div>\n                </div>\n            </div>\n        ";
        this.$states = Array.from(this.$container.querySelectorAll('.blr-state'));
        this.$beforeRecord = this.$container.querySelector('.blr-state-before-record');
        this.$recording = this.$container.querySelector('.blr-state-recording');
        this.$afterRecord = this.$container.querySelector('.blr-state-after-record');
        this.$wait = this.$container.querySelector('.blr-state-wait');
        this.$duration = this.$container.querySelector('.blr-duration');
        this.$size = this.$container.querySelector('.blr-size');
        this.$monitor = this.$container.querySelector('.blr-monitor');
        this.$container.classList.add('blr-focus');
        document.body.appendChild(this.$container);
        setTimeout(function () {
          _this2.$container.classList.remove('blr-focus');
        }, 3000);
      }
    }, {
      key: "bindEvent",
      value: function bindEvent() {
        var _this3 = this;

        this.$beforeRecord.addEventListener('click', function () {
          _this3.start();
        });
        this.$recording.addEventListener('click', function () {
          _this3.stop();
        });
        this.$afterRecord.addEventListener('click', function () {
          if (_this3.blobs.length) {
            _this3.download().then(function () {
              _this3.reset();
            });
          } else {
            _this3.reset();
          }
        });
        var isDroging = false;
        var lastPageX = 0;
        var lastPageY = 0;
        var lastPlayerLeft = 0;
        var lastPlayerTop = 0;
        this.$monitor.addEventListener('mousedown', function (event) {
          isDroging = true;
          lastPageX = event.pageX;
          lastPageY = event.pageY;
          lastPlayerLeft = _this3.$container.offsetLeft;
          lastPlayerTop = _this3.$container.offsetTop;
        });
        document.addEventListener('mousemove', function (event) {
          if (isDroging) {
            var x = event.pageX - lastPageX;
            var y = event.pageY - lastPageY;
            _this3.$container.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
          }
        });
        document.addEventListener('mouseup', function (event) {
          if (isDroging) {
            isDroging = false;
            _this3.$container.style.transform = 'translate(0, 0)';
            var x = lastPlayerLeft + event.pageX - lastPageX;
            var y = lastPlayerTop + event.pageY - lastPageY;
            _this3.$container.style.left = "".concat(x, "px");
            _this3.$container.style.top = "".concat(y, "px");
          }
        });
      }
    }, {
      key: "start",
      value: function start() {
        var _this4 = this;

        clearInterval(this.timer);
        if (this.mediaRecorder) this.mediaRecorder.stop();
        var videos = Array.from(document.querySelectorAll('video'));

        if (videos.length) {
          this.video = videos.find(function (item) {
            return item.captureStream;
          });

          if (this.video) {
            try {
              this.src = this.video.src;
              this.video.crossOrigin = 'anonymous';
              this.stream = this.video.captureStream();
              this.changeState('recording');

              if (MediaRecorder && MediaRecorder.isTypeSupported(Injected.options.mimeType)) {
                this.mediaRecorder = new MediaRecorder(this.stream, Injected.options);

                this.mediaRecorder.ondataavailable = function (event) {
                  _this4.blobs.push(event.data);

                  var size = _this4.size / 1024 / 1024;
                  _this4.$size.textContent = "".concat(size.toFixed(2).slice(-8), "M");
                  _this4.$duration.textContent = _this4.durationToTime(_this4.blobs.filter(function (item) {
                    return item.size > 1024;
                  }).length);
                };

                this.mediaRecorder.start(1000);
                this.timer = setInterval(function () {
                  if (_this4.video && _this4.video.src && _this4.src !== _this4.video.src) {
                    if (_this4.blobs.length) {
                      _this4.start();
                    } else {
                      _this4.stop();
                    }
                  }
                }, 1000);
              } else {
                this.reset();
                this.log("\u4E0D\u652F\u6301\u5F55\u5236\u683C\u5F0F\uFF1A".concat(Injected.options.mimeType));
              }
            } catch (error) {
              this.reset();
              this.log("\u5F55\u5236\u89C6\u9891\u6D41\u5931\u8D25\uFF1A".concat(error.message.trim()));
            }
          } else {
            this.reset();
            this.log('未发现视频流');
          }
        } else {
          this.reset();
          this.log('未发现视频元素');
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        clearInterval(this.timer);
        this.changeState('after-record');

        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
        }
      }
    }, {
      key: "download",
      value: function download() {
        this.changeState('wait');
        return this.mergeBlobs(this.blobs).then(function (blob) {
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "".concat(document.title || Date.now(), ".webm");
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        clearInterval(this.timer);
        this.changeState('before-record');
        this.blobs = [];
        this.src = '';
        this.timer = null;
        this.video = null;
        this.stream = null;
        this.mediaRecorder = null;
        this.$duration.textContent = '00:00';
        this.$size.textContent = '0.00M';
        this.$wait.textContent = '0%';
      }
    }, {
      key: "changeState",
      value: function changeState(state) {
        this.$states.forEach(function (item) {
          if (item.classList.contains("blr-state-".concat(state))) {
            item.classList.add('blr-active');
          } else {
            item.classList.remove('blr-active');
          }
        });
      }
    }, {
      key: "size",
      get: function get() {
        return this.blobs.reduce(function (size, item) {
          return size + item.size;
        }, 0);
      }
    }], [{
      key: "options",
      get: function get() {
        return {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 5000000,
          mimeType: 'video/webm; codecs="vp8, opus"'
        };
      }
    }]);

    return Injected;
  }();

  var index = new Injected();

  return index;

}());
//# sourceMappingURL=index.js.map
