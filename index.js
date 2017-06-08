'use strict';

const signetExplorer = require('./modules/signet-explorer');

module.exports = {
    beforeEach: function () {
        global.exploreApi = signetExplorer.exploreValue;
        global.exploreFunction = signetExplorer.exploreFunction;
        global.exploreValue = signetExplorer.exploreValue;
    }
};
