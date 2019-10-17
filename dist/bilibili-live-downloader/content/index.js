/*!
 * bilibili-live-downloader v1.0.0
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(e){"function"==typeof define&&define.amd?define(e):e()}(function(){"use strict";var e=document.createElement("script");e.src=chrome.extension.getURL("injected/index.js"),e.onload=function(){return e.remove()},(document.head||document.body||document.documentElement).appendChild(e);var n=document.createElement("link");n.rel="stylesheet",n.type="text/css",n.href=chrome.extension.getURL("injected/index.css"),function(e){var n=0<arguments.length&&void 0!==e?e:0;return new Promise(function(e){return setTimeout(e,n)})}().then(function(){return document.head.appendChild(n)})});
