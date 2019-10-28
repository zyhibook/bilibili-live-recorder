const crx = require('puppeteer-crx');
const path = require('path');

const src = path.resolve(__dirname, './dist/bilibili-live-recorder');

crx(src).then(result => {
    console.log(`Packaged successfully: `, result);
});
