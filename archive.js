// eslint-disable-next-line import/no-extraneous-dependencies
const zipFolder = require('zip-folder');

zipFolder('./dist/bilibili-live-recorder', './dist/bilibili-live-recorder.zip', err => {
    if (err) throw err;
});
