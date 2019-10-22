(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Background = factory());
}(this, function () { 'use strict';

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

  const filesInDirectory = dir => new Promise (resolve =>

      dir.createReader ().readEntries (entries =>

          Promise.all (entries.filter (e => e.name[0] !== '.').map (e =>

              e.isDirectory
                  ? filesInDirectory (e)
                  : new Promise (resolve => e.file (resolve))
          ))
          .then (files => [].concat (...files))
          .then (resolve)
      )
  );

  const timestampForFilesInDirectory = dir =>
          filesInDirectory (dir).then (files =>
              files.map (f => f.name + f.lastModifiedDate).join ());

  const reload = () => {

      chrome.tabs.query ({ active: true, currentWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5

          if (tabs[0]) { chrome.tabs.reload (tabs[0].id); }

          chrome.runtime.reload ();
      });
  };

  const watchChanges = (dir, lastTimestamp) => {

      timestampForFilesInDirectory (dir).then (timestamp => {

          if (!lastTimestamp || (lastTimestamp === timestamp)) {

              setTimeout (() => watchChanges (dir, timestamp), 1000); // retry after 1s

          } else {

              reload ();
          }
      });

  };

  chrome.management.getSelf (self => {

      if (self.installType === 'development') {

          chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir));
      }
  });

  // 常用
  var LIVE_PATTERN = '*://*.bilibili.com/*';
  var NOTIFY = 'notify';

  var Background =
  /*#__PURE__*/
  function () {
    function Background() {
      classCallCheck(this, Background);

      this.changeCSP(); // 来自 content

      chrome.runtime.onMessage.addListener(function (request) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case NOTIFY:
            chrome.notifications.create(String(Math.random()), {
              type: 'basic',
              message: data.message,
              contextMessage: data.title || '',
              title: chrome.runtime.getManifest().name,
              iconUrl: chrome.extension.getURL('icons/icon128.png')
            });
            break;

          default:
            break;
        }
      }); // 点击关闭提示

      chrome.notifications.onClicked.addListener(function (id) {
        chrome.notifications.clear(id);
      });
    } // 修改CSP响应头


    createClass(Background, [{
      key: "changeCSP",
      value: function changeCSP() {
        chrome.webRequest.onHeadersReceived.addListener(function (details) {
          var header = details.responseHeaders.find(function (e) {
            return e.name.toLowerCase() === 'content-security-policy-report-only';
          });

          if (header && header.value) {
            header.value = 'worker-src blob: ; ' + header.value;
          }

          return {
            responseHeaders: details.responseHeaders
          };
        }, {
          urls: [LIVE_PATTERN]
        }, ['blocking', 'responseHeaders']);
      }
    }]);

    return Background;
  }();

  var index = new Background();

  return index;

}));
//# sourceMappingURL=index.js.map
