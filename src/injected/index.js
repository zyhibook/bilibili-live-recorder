(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Injected = factory());
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

  // 常用
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';

  var Injected =
  /*#__PURE__*/
  function () {
    function Injected() {
      classCallCheck(this, Injected);

      this.proxyRead();
    }

    createClass(Injected, [{
      key: "proxyRead",
      value: function proxyRead() {
        var read = ReadableStreamDefaultReader.prototype.read;

        ReadableStreamDefaultReader.prototype.read = function () {
          var promiseResult = read.call(this);
          promiseResult.then(function (_ref) {
            var done = _ref.done,
                value = _ref.value;
            if (done) return;
            window.postMessage({
              type: FLV_BUFFER,
              data: value.slice()
            });
          });
          return promiseResult;
        };
      }
    }, {
      key: "proxyAppendBuffer",
      value: function proxyAppendBuffer() {
        var appendBuffer = SourceBuffer.prototype.appendBuffer;

        SourceBuffer.prototype.appendBuffer = function (buf) {
          window.postMessage({
            type: MP4_BUFFER,
            data: new Uint8Array(buf.slice())
          });
          return appendBuffer.call(this, buf);
        };
      }
    }]);

    return Injected;
  }();

  var index = new Injected();

  return index;

}));
//# sourceMappingURL=index.js.map
