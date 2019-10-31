/*!
 * bilibili-live-recorder v2.0.4
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(){"use strict";const e=r=>new Promise(t=>r.createReader().readEntries(r=>Promise.all(r.filter(e=>"."!==e.name[0]).map(r=>r.isDirectory?e(r):new Promise(e=>r.file(e)))).then(e=>[].concat(...e)).then(t))),r=(t,n)=>{(r=>e(r).then(e=>e.map(e=>e.name+e.lastModifiedDate).join()))(t).then(e=>{n&&n!==e?chrome.tabs.query({active:!0,currentWindow:!0},e=>{e[0]&&chrome.tabs.reload(e[0].id),chrome.runtime.reload()}):setTimeout(()=>r(t,e),1e3)})};chrome.management.getSelf(e=>{"development"===e.installType&&chrome.runtime.getPackageDirectoryEntry(e=>r(e))}),chrome.webRequest.onHeadersReceived.addListener((function(e){var r=e.responseHeaders.find((function(e){var r=e.name.toLowerCase();return"content-security-policy-report-only"===r||"content-security-policy"===r}));return r&&r.value&&(r.value="worker-src blob: ; "+r.value),{responseHeaders:e.responseHeaders}}),{urls:["*://*.bilibili.com/*"]},["blocking","responseHeaders"])}();
