(function () {
    'use strict';

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

    var manifest = chrome.runtime.getManifest();
    chrome.webRequest.onHeadersReceived.addListener(function (details) {
      var header = details.responseHeaders.find(function (event) {
        var name = event.name.toLowerCase();
        return name === 'content-security-policy-report-only' || name === 'content-security-policy';
      });

      if (header) {
        details.responseHeaders.splice(details.responseHeaders.indexOf(header), 1);
      }

      return {
        responseHeaders: details.responseHeaders
      };
    }, {
      urls: manifest.content_scripts[0].matches
    }, ['blocking', 'responseHeaders']);

}());
//# sourceMappingURL=index.js.map
