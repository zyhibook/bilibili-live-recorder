(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Content = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function download(url, name) {
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(name) {
      classCallCheck(this, Storage);

      this.name = name;
    }

    createClass(Storage, [{
      key: "get",
      value: function get(key) {
        var storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : storage;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var storage = _objectSpread({}, this.get(), defineProperty({}, key, value));

        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "del",
      value: function del(key) {
        var storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "clean",
      value: function clean() {
        window.localStorage.removeItem(this.name);
      }
    }]);

    return Storage;
  }();

  // 常用
  var LIVE = 'https://live.bilibili.com';

  var BEFORE_RECORD = 'before_record';
  var RECORDING = 'recording';

  var TAB_INFO = 'tab_info';
  var START_RECORD = 'start_record';
  var STOP_RECORD = 'stop_record';
  var START_DOWNLOAD = 'start_download';
  var UPDATE_CONFIG = 'update_config';
  var MP4_BUFFER = 'mp4_buffer';
  var FLV_BUFFER = 'flv_buffer';
  var NOTIFY = 'notify';

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Content =
  /*#__PURE__*/
  function () {
    function Content() {
      var _this = this;

      classCallCheck(this, Content);

      this.injectScript();
      this.injectStyle();
      this.tab = null;
      this.worker = new Worker(URL.createObjectURL(new Blob(["\"use strict\";function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError(\"Invalid attempt to spread non-iterable instance\")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||\"[object Arguments]\"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError(\"Cannot call a class as a function\")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,\"value\"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var NOTIFY=\"notify\",FLV_BUFFER=\"flv_buffer\",STOP_RECORD=\"stop_record\",RESET_RECORD=\"reset_record\",START_RECORD=\"start_record\",AFTER_RECORD=\"after_record\",UPDATE_CONFIG=\"update_config\",START_DOWNLOAD=\"start_download\",FLVParser=/*#__PURE__*/function(){function a(){var b=this;_classCallCheck(this,a),this.data=new Uint8Array,this.header=new Uint8Array,this.scripTag=new Uint8Array,this.videoAndAudioTags=new Uint8Array,this.tagStartTime=0,this.resultDuration=0,this.recording=!1,this.config={},this.index=0,this.tasks=[],this.running=!1,this.downloadRate=a.createRate(function(a){b.recording&&postMessage({type:UPDATE_CONFIG,data:{downloadRate:a.toFixed(3)}})}),this.expectedSizeRate=a.createRate(function(a){b.recording&&postMessage({type:UPDATE_CONFIG,data:{expectedSize:a.toFixed(3)}})},!1),this.writeRate=a.createRate(function(a){b.recording&&postMessage({type:UPDATE_CONFIG,data:{writeRate:a.toFixed(3)}})}),this.durationRate=a.createRate(function(a){b.recording&&postMessage({type:UPDATE_CONFIG,data:{currentDuration:a.toFixed(3)}})},!1),this.sizeRate=a.createRate(function(a){b.recording&&postMessage({type:UPDATE_CONFIG,data:{currentSize:a.toFixed(3)}})},!1)}return _createClass(a,null,[{key:\"mergeBuffer\",value:function mergeBuffer(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];var d=b[0].constructor;return b.reduce(function(a,b){var c=new d((0|a.byteLength)+(0|b.byteLength));return c.set(a,0),c.set(b,0|a.byteLength),c},new d)}},{key:\"readBufferSum\",value:function readBufferSum(a){var b=!(1<arguments.length&&void 0!==arguments[1])||arguments[1];return a.reduce(function(c,d,e){var f=Math.pow;return c+(b?d:d-128)*f(256,a.length-e-1)},0)}},{key:\"numToFloat64Arr\",value:function numToFloat64Arr(a){return _toConsumableArray(new Uint8Array(new Float64Array([a]).buffer)).reverse()}},{key:\"readBufferString\",value:function readBufferString(a){var c,b=String.fromCharCode;return(c=b).call.apply(c,[String].concat(_toConsumableArray(a)))}},{key:\"getNowTime\",value:function getNowTime(){return performance&&\"function\"==typeof performance.now?performance.now():Date.now()}},{key:\"createRate\",value:function createRate(b){var c=!(1<arguments.length&&void 0!==arguments[1])||arguments[1],d=0,e=a.getNowTime();return function(){var f=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1;d+=f;var g=a.getNowTime(),h=g-e;1e3<=h&&(b(c?1e3*(d/h):f),e=g,d=0)}}}]),_createClass(a,[{key:\"getTagTime\",value:function getTagTime(a){var b=a[4],c=a[5],d=a[6],e=a[7];return d|c<<8|b<<16|e<<24}},{key:\"setTagTime\",value:function setTagTime(a){var b=new Uint8Array(4),c=new Uint8Array(new Uint32Array([a]).buffer);return b[0]=c[2],b[1]=c[1],b[2]=c[0],b[3]=c[3],b}},{key:\"notify\",value:function notify(a){postMessage({type:NOTIFY,data:{title:this.config.name||\"\",message:a+\"\"}})}},{key:\"readable\",value:function readable(a){return this.data.length-this.index>=a}},{key:\"read\",value:function read(a){for(var b=new Uint8Array(a),c=0;c<a;c+=1)b[c]=this.data[this.index],this.index+=1;return b}},{key:\"remuxer\",value:function remuxer(b){var c=this;return new Promise(function(d,e){if(!c.recording)return void d();for(c.downloadRate(b.byteLength/1024/1024),c.data=a.mergeBuffer(c.data,b),!c.header.length&&c.readable(13)&&(c.header=c.read(13));c.index<c.data.length;){var f=0,g=0,h=new Uint8Array,i=c.index;if(c.readable(11))h=a.mergeBuffer(h,c.read(11)),g=h[0],f=a.readBufferSum(h.subarray(1,4));else return c.index=i,void d();if(c.readable(f+4)){h=a.mergeBuffer(h,c.read(f));var j=c.read(4);h=a.mergeBuffer(h,j);var k=a.readBufferSum(j);if(k!==f+11)return c.recording=!1,c.notify(\"\u89C6\u9891\u5F55\u5236\u5931\u8D25\uFF0C\u4F60\u53EF\u4EE5\u4E0B\u8F7D\u5DF2\u7ECF\u5F55\u5236\u597D\u7684\u90E8\u5206\"),postMessage({type:UPDATE_CONFIG,data:{state:AFTER_RECORD}}),void e(new Error(\"Prev tag size does not match in tag type: \".concat(g)))}else return c.index=i,void d();if(18===g?c.scripTag=h:c.videoAndAudioTags=a.mergeBuffer(c.videoAndAudioTags,h),c.resultDuration=a.getNowTime()-c.recordStartTime,c.writeRate(h.byteLength/1024/1024),c.sizeRate(c.resultData.byteLength/1024/1024),c.durationRate(c.resultDuration/1e3/60),c.expectedSizeRate(1e3*(60*c.config.maxDuration)*(c.resultData.byteLength/1024/1024/c.resultDuration)),c.resultDuration>=1e3*(60*c.config.maxDuration))return c.recording=!1,c.notify(\"\u89C6\u9891\u5F55\u5236\u5B8C\u6210\uFF0C\u53EF\u4EE5\u4E0B\u8F7D\u4E86\uFF01\"),postMessage({type:UPDATE_CONFIG,data:{state:AFTER_RECORD}}),void d();c.data=c.data.subarray(c.index),c.index=0}d()})}},{key:FLV_BUFFER,value:function value(a){this.recording&&(this.tasks.push(this.remuxer.bind(this,a)),!this.running&&function a(){var b=this,c=this.tasks.shift();c?(this.running=!0,c().then(function(){setTimeout(a.bind(b),0)})):this.running=!1}.call(this))}},{key:START_RECORD,value:function value(b){this.recording=!0,this.config=b,this.recordStartTime=a.getNowTime()}},{key:STOP_RECORD,value:function value(){this.recording=!1}},{key:START_DOWNLOAD,value:function value(){postMessage({type:START_DOWNLOAD,data:URL.createObjectURL(new Blob([this.resultData]))})}},{key:RESET_RECORD,value:function value(){this.data=new Uint8Array,this.header=new Uint8Array,this.scripTag=new Uint8Array,this.videoAndAudioTags=new Uint8Array,this.tagStartTime=0,this.resultDuration=0,this.recording=!1,this.config={},this.index=0,this.tasks=[],this.running=!1}},{key:\"resultData\",get:function get(){return a.mergeBuffer(this.header,this.scripTag,this.videoAndAudioTags)}},{key:\"resultSize\",get:function get(){return this.header.byteLength+this.scripTag.byteLength+this.videoAndAudioTags.byteLength}}]),a}(),flv=new FLVParser;onmessage=function onmessage(a){var b=a.data,c=b.type,d=b.data;switch(c){case FLV_BUFFER:flv[FLV_BUFFER](d);break;case START_RECORD:flv[START_RECORD](d);break;case STOP_RECORD:flv[STOP_RECORD](d);break;case START_DOWNLOAD:flv[START_DOWNLOAD](d);break;case RESET_RECORD:flv[RESET_RECORD](d);break;default:}};"])));
      this.storage = new Storage('bilibili-live-recorder');
      this.config = this.storage.get(location.href);
      this.storage.del(location.href);

      if (this.config) {
        this.worker.postMessage({
          type: START_RECORD,
          data: this.config
        });
        this.updateConfig(this.config);
      } // 来自 worker


      this.worker.onmessage = function (event) {
        var _event$data = event.data,
            type = _event$data.type,
            data = _event$data.data;

        switch (type) {
          case NOTIFY:
            _this.notify(data);

            break;

          case UPDATE_CONFIG:
            _this.updateConfig(data);

            break;

          case START_DOWNLOAD:
            _this.download(data);

            break;

          default:
            break;
        }
      }; // 来自 popup


      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case TAB_INFO:
            _this.tab = data;
            sendResponse(_this.config);
            break;

          case START_RECORD:
            var $video = document.querySelector('video');

            if ($video) {
              _this.storage.set(location.href, data);

              location.reload();
            } else {
              _this.notify({
                message: '未找到视频播放器'
              });

              _this.updateConfig({
                state: BEFORE_RECORD
              });
            }

            break;

          case START_DOWNLOAD:
            _this.worker.postMessage({
              type: START_DOWNLOAD
            });

            break;

          case STOP_RECORD:
            _this.worker.postMessage({
              type: STOP_RECORD
            });

            break;

          default:
            break;
        }
      }); // 来自 injected

      window.addEventListener('message', function (event) {
        if (event.origin === LIVE && _this.config && _this.config.state === RECORDING) {
          var _event$data2 = event.data,
              type = _event$data2.type,
              data = _event$data2.data;

          switch (type) {
            case MP4_BUFFER:
              break;

            case FLV_BUFFER:
              _this.worker.postMessage({
                type: FLV_BUFFER,
                data: data
              });

              break;

            default:
              break;
          }
        }
      });
    }

    createClass(Content, [{
      key: "download",
      value: function download$1(data) {
        var name = this.config.name + '.' + this.config.format;

        download(data, name);

        this.updateConfig({
          state: BEFORE_RECORD
        });
      }
    }, {
      key: "notify",
      value: function notify(data) {
        chrome.runtime.sendMessage({
          type: NOTIFY,
          data: data
        });
      }
    }, {
      key: "updateConfig",
      value: function updateConfig(data) {
        this.config = _objectSpread$1({}, this.config, {}, data);
        chrome.runtime.sendMessage({
          type: UPDATE_CONFIG,
          data: this.config
        });
      }
    }, {
      key: "injectScript",
      value: function injectScript() {
        var $script = document.createElement('script');
        $script.src = chrome.extension.getURL('injected/index.js');

        $script.onload = function () {
          return $script.remove();
        };

        document.documentElement.appendChild($script);
      }
    }, {
      key: "injectStyle",
      value: function injectStyle() {
        var $style = document.createElement('link');
        $style.rel = 'stylesheet';
        $style.type = 'text/css';
        $style.href = chrome.extension.getURL('injected/index.css');
        sleep().then(function () {
          return document.head.appendChild($style);
        });
      }
    }]);

    return Content;
  }();

  var index = new Content();

  return index;

}));
//# sourceMappingURL=index.js.map
