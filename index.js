'use strict';

const signetExplorer = require('./modules/signet-explorer');
let setupRunCount = 0;

function before() {
    global.exploreApi = signetExplorer.exploreValue;
    global.exploreFunction = signetExplorer.exploreFunction;
    global.exploreValue = signetExplorer.exploreValue;
}

module.exports = {
    before: before,
    setup: function () {
        if(setupRunCount === 0) {
            before();
            setupRunCount++;
        }
    }
};
