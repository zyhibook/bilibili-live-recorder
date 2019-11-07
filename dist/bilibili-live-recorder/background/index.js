/*!
 * bilibili-live-recorder v2.0.6
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(){"use strict";"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var e=function(e,n){return e(n={exports:{}},n.exports),n.exports}((function(e,n){
/*!
	 * csp-generator.js v1.0.2
	 * Github: https://github.com/zhw2590582/csp-generator#readme
	 * (c) 2017-2019 Harvey Zack
	 * Released under the MIT License.
	 */
e.exports=function(){var e=function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")};function n(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(){function t(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";e(this,t),this.csp=this.parse(n)}return function(e,t,r){t&&n(e.prototype,t),r&&n(e,r)}(t,[{key:"parse",value:function(e){return(0<arguments.length&&void 0!==e?e:"").split(";").reduce((function(e,n){var t=n.split(" ").filter((function(e){return e.trim()})),r=t[0],i=t.slice(1);return e[r]=i,e}),{})}},{key:"generate",value:function(){var e=this;return Object.keys(this.csp).reduce((function(n,t){return"".concat(n," ").concat(t," ").concat(e.csp[t].join(" "),";")}),"").trim()}},{key:"append",value:function(e,n){return this.csp[e]&&-1===this.csp[e].indexOf(n)?this.csp[e].push(n):this.csp[e]=[n],this}},{key:"delete",value:function(e,n){if(n){var t=(this.csp[e]||[]).indexOf(n);-1<t&&this.csp[e].splice(t,1)}else delete this.csp[e];return this}},{key:"get",value:function(e){return this.csp[e]}}]),t}()}()}));const n=e=>new Promise(t=>e.createReader().readEntries(e=>Promise.all(e.filter(e=>"."!==e.name[0]).map(e=>e.isDirectory?n(e):new Promise(n=>e.file(n)))).then(e=>[].concat(...e)).then(t))),t=(e,r)=>{(e=>n(e).then(e=>e.map(e=>e.name+e.lastModifiedDate).join()))(e).then(n=>{r&&r!==n?chrome.tabs.query({active:!0,currentWindow:!0},e=>{e[0]&&chrome.tabs.reload(e[0].id),chrome.runtime.reload()}):setTimeout(()=>t(e,n),1e3)})};chrome.management.getSelf(e=>{"development"===e.installType&&chrome.runtime.getPackageDirectoryEntry(e=>t(e))});var r=chrome.runtime.getManifest();chrome.webRequest.onHeadersReceived.addListener((function(n){var t=n.responseHeaders.find((function(e){var n=e.name.toLowerCase();return"content-security-policy-report-only"===n||"content-security-policy"===n}));if(t&&t.value){var r=new e(t.value);r.append("worker-src","blob:"),r.append("script-src","*.baidu.com"),r.append("img-src","*.baidu.com"),t.value=r.generate()}return{responseHeaders:n.responseHeaders}}),{urls:r.content_scripts[0].matches},["blocking","responseHeaders"])}();
