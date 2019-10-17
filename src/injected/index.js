(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var appendBuffer = SourceBuffer.prototype.appendBuffer;

    SourceBuffer.prototype.appendBuffer = function (buf) {
      window.postMessage({
        type: 'MP4Buffer',
        data: buf.slice()
      });
      return appendBuffer.call(this, buf);
    };

    var read = ReadableStreamDefaultReader.prototype.read;

    ReadableStreamDefaultReader.prototype.read = function () {
      var promiseResult = read.call(this);
      promiseResult.then(function (result) {
        window.postMessage({
          type: 'FLVBuffer',
          data: result
        });
      });
      return promiseResult;
    };

}));
//# sourceMappingURL=index.js.map
