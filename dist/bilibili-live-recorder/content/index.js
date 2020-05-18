/*!
 * bilibili-live-recorder v2.1.1
 * Github: https://github.com/zhw2590582/bilibili-live-recorder
 * (c) 2018-2020 Harvey Zack
 * Released under the MIT License.
 */

!function(){"use strict";var e=document.createElement("script");e.src=chrome.extension.getURL("injected/index.js"),e.onload=function(){return e.remove()},document.documentElement.appendChild(e);var n=document.createElement("link");n.rel="stylesheet",n.type="text/css",n.href=chrome.extension.getURL("injected/index.css"),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise((function(n){return setTimeout(n,e)}))}().then((function(){return document.head.appendChild(n)}))}();
