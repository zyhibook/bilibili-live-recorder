/*!
 * bilibili-live-recorder v1.0.0
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).Background=n()}(this,(function(){"use strict";var e=function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")};const n=e=>new Promise(t=>e.createReader().readEntries(e=>Promise.all(e.filter(e=>"."!==e.name[0]).map(e=>e.isDirectory?n(e):new Promise(n=>e.file(n)))).then(e=>[].concat(...e)).then(t))),t=(e,o)=>{(e=>n(e).then(e=>e.map(e=>e.name+e.lastModifiedDate).join()))(e).then(n=>{o&&o!==n?chrome.tabs.query({active:!0,currentWindow:!0},e=>{e[0]&&chrome.tabs.reload(e[0].id),chrome.runtime.reload()}):setTimeout(()=>t(e,n),1e3)})};chrome.management.getSelf(e=>{"development"===e.installType&&chrome.runtime.getPackageDirectoryEntry(e=>t(e))});return new function n(){e(this,n),chrome.notifications.onClicked.addListener((function(e){chrome.notifications.clear(e)}))}}));
