/*!
 * bilibili-live-downloader v1.0.0
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Injected=t()}(this,(function(){"use strict";var e=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")};return new function t(){e(this,t);var n=SourceBuffer.prototype.appendBuffer;SourceBuffer.prototype.appendBuffer=function(e){return window.postMessage({type:"MP4Buffer",data:e.slice()}),n.call(this,e)};var a=ReadableStreamDefaultReader.prototype.read;ReadableStreamDefaultReader.prototype.read=function(){var e=a.call(this);return e.then((function(e){var t=e.done,n=e.value;t||window.postMessage({type:"FLVBuffer",data:n.slice()})})),e}}}));
