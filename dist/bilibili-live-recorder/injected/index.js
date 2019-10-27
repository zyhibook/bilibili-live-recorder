/*!
 * bilibili-live-recorder v2.0.2
 * Github: undefined
 * (c) 2018-2019 Harvey Zack
 * Released under the MIT License.
 */

var bilibiliLiveRecorderInjected=function(){"use strict";var e=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")};function t(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var r=function(e,r,a){return r&&t(e.prototype,r),a&&t(e,a),e};function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise((function(t){return setTimeout(t,e)}))}var n=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e};function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}var o=function(){function t(r){e(this,t),this.name=r}return r(t,[{key:"get",value:function(e){var t=JSON.parse(window.localStorage.getItem(this.name))||{};return e?t[e]:t}},{key:"set",value:function(e,t){var r=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(r,!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},this.get(),n({},e,t));window.localStorage.setItem(this.name,JSON.stringify(r))}},{key:"del",value:function(e){var t=this.get();delete t[e],window.localStorage.setItem(this.name,JSON.stringify(t))}},{key:"clean",value:function(){window.localStorage.removeItem(this.name)}}]),t}();return new(function(){function t(){var r=this;e(this,t),this.name="bilibili-live-recorder",this.storage=new o(this.name),this.worker=new Worker(URL.createObjectURL(new Blob(['"use strict";function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}// 合并数据\nfunction mergeBuffer(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];var d=b[0].constructor;return b.reduce(function(a,b){var c=new d((0|a.byteLength)+(0|b.byteLength));return c.set(a,0),c.set(b,0|a.byteLength),c},new d)}// 读取长度\nfunction readBufferSum(a){var b=!(1<arguments.length&&arguments[1]!==void 0)||arguments[1];return a.reduce(function(c,d,e){return c+(b?d:d-128)*Math.pow(256,a.length-e-1)},0)}// 获取时间戳\nfunction getTagTime(a){var b=a[4],c=a[5],d=a[6],e=a[7];return d|c<<8|b<<16|e<<24}// 时长转时间\nfunction durationToTime(a){var b=(Math.floor(a/60)+"").slice(-5),c=a%60+"";return"".concat(1===b.length?"0".concat(b):b,":").concat(1===c.length?"0".concat(c):c)}// FLV解封装类\nvar Flv=/*#__PURE__*/function(){function a(){_classCallCheck(this,a),this.index=0,this.tasks=[],this.timer=null,this.loading=!1,this.running=!1,this.tagLength=0,this.tagStartTime=0,this.resultDuration=0,this.data=new Uint8Array,this.header=new Uint8Array,this.scripTag=new Uint8Array,this.videoAndAudioTags=[],function a(){var b=this;this.timer=setTimeout(function(){b.running&&b.loading&&b.report(),a.call(b)},1e3)}.call(this)}// 最终合成视频\nreturn _createClass(a,[{key:"report",// 汇报状态\nvalue:function report(){postMessage({type:"report",data:{duration:durationToTime(Math.floor(this.resultDuration/1e3)),size:(this.resultSize/1024/1024).toFixed(2).slice(-8)}})}// 判断数据是否足够\n},{key:"readable",value:function readable(a){return this.data.length-this.index>=a}// 按字节读取\n},{key:"read",value:function read(a){var b=this.index+a,c=this.data.subarray(this.index,b);return this.index=b,c}// 加载视频流\n},{key:"load",value:function load(a){this.loading=!0,this.tasks.push(this.demuxer.bind(this,a)),this.running||function a(){var b=this,c=this.tasks.shift();c&&this.loading?(this.running=!0,c().then(function(){setTimeout(a.bind(b),0)})):this.running=!1}.call(this)}// 数据解封装\n},{key:"demuxer",value:function demuxer(a){var b=this;return new Promise(function(c,d){if(!b.loading)return void c();for(b.data=mergeBuffer(b.data,a),!b.header.length&&b.readable(13)&&(b.header=b.read(13));b.index<b.data.length;){var e=0,f=0,g=new Uint8Array,h=b.index;if(b.readable(11))g=mergeBuffer(g,b.read(11)),f=g[0],e=readBufferSum(g.subarray(1,4));else return b.index=h,void c();if(b.readable(e+4)){g=mergeBuffer(g,b.read(e));var i=b.read(4);g=mergeBuffer(g,i);var j=readBufferSum(i);if(j!==e+11)return b.stop(),postMessage({type:"error"}),void d(new Error("bilibili-live-recorder: Prev tag size does not match in tag type: ".concat(f)))}else return b.index=h,void c();if(b.tagLength+=1,18===f)b.scripTag=g;else{var k=getTagTime(g);// 取第一帧的时间为开始时间\nb.tagStartTime||(b.tagStartTime=k);var l=k-b.tagStartTime;// 前10帧内，凡是时间差大于1秒的都重新修正开始时间\n10>=b.tagLength&&1e3<=l-b.resultDuration&&(b.tagStartTime=k),b.resultDuration=k-b.tagStartTime;// 每10M为一个元素，因为文件太大会引起合并时的长时间阻塞\nvar m=b.videoAndAudioTags[b.videoAndAudioTags.length-1];m?10485760<=m.byteLength?b.videoAndAudioTags.push(g):b.videoAndAudioTags[b.videoAndAudioTags.length-1]=mergeBuffer(m,g):b.videoAndAudioTags.push(g)}b.data=b.data.subarray(b.index),b.index=0}c()})}// 停止解封装\n},{key:"stop",value:function stop(){this.loading=!1,clearTimeout(this.timer),this.report()}// 下载当前视频\n},{key:"download",value:function download(){postMessage({type:"report",data:{duration:durationToTime(0),size:0 .toFixed(2)}}),postMessage({type:"download",data:URL.createObjectURL(new Blob([this.resultData]))})}},{key:"resultData",get:function get(){return mergeBuffer.apply(void 0,[this.header,this.scripTag].concat(_toConsumableArray(this.videoAndAudioTags)))}// 当前视频时长\n},{key:"resultSize",get:function get(){return this.header.byteLength+this.scripTag.byteLength+this.videoAndAudioTags.reduce(function(a,b){return a+=b.byteLength,a},0)}}]),a}(),flv=new Flv;onmessage=function onmessage(a){var b=a.data,c=b.type,d=b.data;switch(c){case"load":flv.load(d);break;case"stop":flv.stop();break;case"download":flv.download();break;default:}};']))),this.loading=!1,this.worker.onmessage=function(e){var t,a,n,i=e.data,o=i.type,s=i.data;switch(o){case"report":r.$duration.textContent=s.duration,r.$size.textContent=s.size+"M";break;case"download":t=s,a="".concat(document.title,".flv"),(n=document.createElement("a")).style.display="none",n.href=t,n.download=a,document.body.appendChild(n),n.click(),document.body.removeChild(n),r.changeState("before-record"),r.worker.terminate();break;case"error":r.loading=!1,r.changeState("after-record")}},this.storage.get(location.href)&&(this.storage.del(location.href),this.loading=!0,this.intercept()),this.createUI()}return r(t,[{key:"createUI",value:function(){var e=this;if(!document.body)return a(100).then((function(){return e.createUI()}));this.$container=document.createElement("div"),this.$container.classList.add(this.name),this.$container.innerHTML='\n            <div class="blr-states">\n                <div class="blr-state blr-state-before-record blr-active">开始</div>\n                <div class="blr-state blr-state-recording">停止</div>\n                <div class="blr-state blr-state-after-record">下载</div>\n                <div class="blr-state blr-state-wait">稍等</div>\n            </div>\n            <div class="blr-monitors">\n                <div class="blr-monitor blr-monitor-top">\n                    <div class="blr-monitor-name">时长：</div>\n                    <div class="blr-monitor-value blr-duration">00:00</div>\n                </div>\n                <div class="blr-monitor blr-monitor-bottom">\n                    <div class="blr-monitor-name">大小：</div>\n                    <div class="blr-monitor-value blr-size">0.00M</div>\n                </div>\n            </div>\n        ',this.$states=Array.from(this.$container.querySelectorAll(".blr-state")),this.$beforeRecord=this.$container.querySelector(".blr-state-before-record"),this.$recording=this.$container.querySelector(".blr-state-recording"),this.$afterRecord=this.$container.querySelector(".blr-state-after-record"),this.$duration=this.$container.querySelector(".blr-duration"),this.$size=this.$container.querySelector(".blr-size"),this.$monitor=this.$container.querySelector(".blr-monitor"),this.loading?this.changeState("recording"):location.href.includes("blr")&&(this.storage.clean(),this.$container.classList.add("blr-focus"),a(1e4).then((function(){e.$container.classList.remove("blr-focus")})));var t=this.storage.get("x"),r=this.storage.get("y");t&&r&&(this.$container.style.left="".concat(t,"px"),this.$container.style.top="".concat(r,"px")),document.body.appendChild(this.$container),this.bindEvent()}},{key:"changeState",value:function(e){this.$states.forEach((function(t){t.classList.contains("blr-state-".concat(e))?t.classList.add("blr-active"):t.classList.remove("blr-active")}))}},{key:"bindEvent",value:function(){var e=this;this.$beforeRecord.addEventListener("click",(function(){document.querySelector("video")&&(e.storage.set(location.href,1),location.reload())})),this.$recording.addEventListener("click",(function(){e.loading=!1,e.changeState("after-record"),e.worker.postMessage({type:"stop"})})),this.$afterRecord.addEventListener("click",(function(){e.loading=!1,e.changeState("wait"),e.worker.postMessage({type:"download"})}));var t=!1,r=0,a=0,n=0,i=0;this.$monitor.addEventListener("mousedown",(function(){t=!0,r=event.pageX,a=event.pageY,n=e.$container.offsetLeft,i=e.$container.offsetTop})),document.addEventListener("mousemove",(function(n){if(t){var i=n.pageX-r,o=n.pageY-a;e.$container.style.transform="translate(".concat(i,"px, ").concat(o,"px)")}})),document.addEventListener("mouseup",(function(){if(t){t=!1,e.$container.style.transform="translate(0, 0)";var o=n+event.pageX-r,s=i+event.pageY-a;e.$container.style.left="".concat(o,"px"),e.$container.style.top="".concat(s,"px"),e.storage.set("x",o),e.storage.set("y",s)}}))}},{key:"intercept",value:function(){var e=ReadableStreamDefaultReader.prototype.read,t=this;ReadableStreamDefaultReader.prototype.read=function(){var r=e.call(this);return r.then((function(e){var r=e.done,a=e.value;!r&&t.loading&&t.worker.postMessage({type:"load",data:a.slice()})})),r}}}]),t}())}();
