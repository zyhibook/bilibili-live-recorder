// eslint-disable-next-line import/no-extraneous-dependencies
const zipFolder = require('zip-folder');
const { name } = require('./package.json');

zipFolder(`./dist/${name}`, `./dist/${name}.zip`, err => {
    if (err) throw err;
});
