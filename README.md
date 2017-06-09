# Quokka Signet Explorer

Quokka plugin for exploring API endpoints to identify function signatures and API property types

## Installation ##

Install Quokka.js (free or pro)

### 1. NPM setup ###

First install Quokka Signet Explorer via npm:

`npm i quokka-signet-explorer --save-dev`

### 2a. Quokka Setup ###

Next, add the plugin to your Quokka configuration:

```
({
    "plugins": [
        "quokka-signet-explorer"
    ]
})
```

### 2b. OR Wallaby Setup ###

If you are running Wallaby, you can use Quokka Signet Explorer.  Just require it in your setup file and then run the setup method with all of your other setup scripts:

```
const quokkaSignetExplorer = require('quokkaSignetExplorer');

module.exports = function () {
    return {
        setup: function () {
            quokkaSignetExplorer.setup();
            /* other setup goes in here too! */
        }
    };
}
```

### That's it! ###

To run Quokka, open a file and type `ctrl/command+k, q`.

## API ##

Three functions are exposed on the node global scope.  In any code you are running, you can get information about functions, objects and modules:

- exploreApi -- `exportedModule:* => variant<string, object>`
    - alias of exploreValue
    - returns either an object containing property keys with value types or a string describing the type of value provided
- exploreFunction -- `functionToExplore:function => string`
    - returns a signet signature string describing the function input values
- exploreValue -- `valueToExplore:* => variant<string, object>`
    - returns either an object containing property keys with value types or a string describing the type of value provided 

### Example ###

```
    const api = {
        foo: {
            bar: 'baz'
        },
        add: (a, b = 1) => a + b,
        identity: a => a
    };

    exploreFunction(api.add); // a:*, b:[number] => *
    exploreApi(api);

    /*
     * {
     *     foo: {
     *         bar: 'string'
     *     },
     *     add: 'a:*, b:[number] => *',
     *     identity: 'a:* => *'
     * }
     */


```

## Changelog ##

### v1.0.0 ###

- First release of Quokka Signet Explorer
