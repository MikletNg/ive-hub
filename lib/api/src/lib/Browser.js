const chromium = require('chrome-aws-lambda');
// module.exports = class Broswer {
//     constructor() {
//         this._broswer = null;
//     }

//     async run() {
//         try {
// this._browser = await chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: chromium.headless,
// });
//             logger.log('Launch succesfully');
//         }
//         catch (e) {
//             throw e;
//         }
//     }

//     async stop() {
//         await this._broswer.stop();
//     }
// };

module.exports = async() => {
    return await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
};
