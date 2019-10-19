/*!
 * bilibili-live-recorder v1.0.0
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Injected=t()}(this,(function(){"use strict";var e=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")};function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var n=function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e};return new(function(){function t(){e(this,t),this.proxyRead()}return n(t,[{key:"proxyRead",value:function(){var e=ReadableStreamDefaultReader.prototype.read;ReadableStreamDefaultReader.prototype.read=function(){var t=e.call(this);return t.then((function(e){var t=e.done,n=e.value;t||window.postMessage({type:"flv_buffer",data:n.slice()})})),t}}},{key:"proxyAppendBuffer",value:function(){var e=SourceBuffer.prototype.appendBuffer;SourceBuffer.prototype.appendBuffer=function(t){return window.postMessage({type:"mp4_buffer",data:new Uint8Array(t.slice())}),e.call(this,t)}}}]),t}())}));
