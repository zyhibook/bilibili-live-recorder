/*!
 * bilibili-live-recorder v2.0.2
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(){"use strict";var e=chrome.runtime.getManifest(),t=document.querySelector(".version"),c=document.querySelector(".feedback");t.textContent=e.version,t.addEventListener("click",(function(){chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml"})})),c.addEventListener("click",(function(){chrome.tabs.create({url:"https://github.com/zhw2590582/bilibili-live-recorder"})}))}();
