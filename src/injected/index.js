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

  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';

  var Injected = function Injected() {
    classCallCheck(this, Injected);

    var appendBuffer = SourceBuffer.prototype.appendBuffer;

    SourceBuffer.prototype.appendBuffer = function (buf) {
      window.postMessage({
        type: MP4_BUFFER,
        data: new Uint8Array(buf.slice())
      });
      return appendBuffer.call(this, buf);
    };

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
  };

  var index = new Injected();

  return index;

}));
//# sourceMappingURL=index.js.map
