'use strict';

const signetExplorer = require('./modules/signet-explorer');

global.exploreApi = signetExplorer.exploreValue;
global.exploreFunction = signetExplorer.exploreFunction;
global.exploreValue = signetExplorer.exploreValue;
