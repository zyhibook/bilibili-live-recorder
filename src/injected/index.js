(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var appendBuffer = SourceBuffer.prototype.appendBuffer;

    SourceBuffer.prototype.appendBuffer = function (buf) {
      window.postMessage({
        type: 'buffer',
        data: buf.slice()
      });
      return appendBuffer.call(this, buf);
    };

}));
//# sourceMappingURL=index.js.map
