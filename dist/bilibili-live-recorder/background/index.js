/*!
 * bilibili-live-downloader v1.0.0
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Background=t()}(this,(function(){"use strict";var e=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")};const t=e=>new Promise(o=>e.createReader().readEntries(e=>Promise.all(e.filter(e=>"."!==e.name[0]).map(e=>e.isDirectory?t(e):new Promise(t=>e.file(t)))).then(e=>[].concat(...e)).then(o))),o=(e,n)=>{(e=>t(e).then(e=>e.map(e=>e.name+e.lastModifiedDate).join()))(e).then(t=>{n&&n!==t?chrome.tabs.query({active:!0,currentWindow:!0},e=>{e[0]&&chrome.tabs.reload(e[0].id),chrome.runtime.reload()}):setTimeout(()=>o(e,t),1e3)})};chrome.management.getSelf(e=>{"development"===e.installType&&chrome.runtime.getPackageDirectoryEntry(e=>o(e))});return new function t(){e(this,t),console.log(this.constructor.name),chrome.browserAction.setBadgeText({text:"5"}),chrome.browserAction.setBadgeBackgroundColor({color:"red"})}}));
