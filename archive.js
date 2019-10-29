const crx = require('puppeteer-crx');
const path = require('path');
const { name } = require('./package.json');

crx(path.resolve(__dirname, `./dist/${name}`)).then(result => {
    Object.keys(result)
        .filter(key => result[key])
        .forEach(key => {
            console.log(`Packaged ${key} successfully in ${result[key]}`);
        });
});
