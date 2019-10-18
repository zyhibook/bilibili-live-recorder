(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Background = factory());
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

  var BEFORE_RECORD = 'before_record';
  var START_RECORD = 'start_record';
  var RECORDING = 'recording';
  var STOP_RECORD = 'stop_record';
  var AFTER_RECORD = 'after_record';
  var START_DOWNLOAD = 'start_download';

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Background =
  /*#__PURE__*/
  function () {
    function Background() {
      var _this = this;

      classCallCheck(this, Background);

      chrome.runtime.onMessage.addListener(function (request, sender, callback) {
        var type = request.type,
            data = request.data;

        switch (type) {
          case START_RECORD:
            _this.config = data;

            _this.updateConfig({
              state: RECORDING
            });

            break;

          case STOP_RECORD:
            _this.updateConfig({
              state: AFTER_RECORD
            });

            break;

          case START_DOWNLOAD:
            _this.updateConfig({
              state: BEFORE_RECORD
            });

          default:
            break;
        }

        callback();
      });
      chrome.notifications.onClicked.addListener(function (id) {
        chrome.notifications.clear(id);
      });
    }

    createClass(Background, [{
      key: "updateConfig",
      value: function updateConfig(config) {
        this.config = _objectSpread({}, this.config, {}, config);
      }
    }]);

    return Background;
  }();

  var index = new Background();

  return index;

}));
//# sourceMappingURL=index.js.map
