/*!
 * bilibili-live-recorder v2.0.4
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(){"use strict";var e=chrome.runtime.getManifest(),t=document.querySelector(".version"),c=document.querySelector(".feedback"),o=document.querySelector(".donate img"),r=document.querySelector(".footer");t.textContent=e.version,o.src=chrome.extension.getURL("icons/donate.png"),t.addEventListener("click",(function(){chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml"})})),c.addEventListener("click",(function(){chrome.tabs.create({url:"https://github.com/zhw2590582/bilibili-live-recorder"})})),r.addEventListener("click",(function(){chrome.tabs.create({url:"https://live.bilibili.com?blr"})}))}();
