'use strict';

const assert = require('chai').assert;
const signet = require('signet')();

require('../index').before();

describe('QuokkaSignetExplorer', function () {
    
    describe('Function signatures', function () {
        
        it('should return signet signature from signed function', function () {
            const signedFn = signet.enforce('number, number => number', (a, b) => a + b);
            assert.equal(exploreFunction(signedFn), 'number, number => number');
        });

        it('should return signet-formatted signature for unsigned function', function () {
            function add(a, b = 1) { return a + b; }
            console.log(exploreFunction(add));
            assert.equal(exploreFunction(add), 'a:*, b:[number] => *');
        });

        it('should throw an error if value passed is not a function', function () {
            assert.throws(
                exploreFunction.bind(null, {}),
                'Unable to process value of type object');
        });

        it('should not blow up when a function is curried', function () {
            function myFn(a) {
                return function (b) {
                    return 'something' + a + b;
                };
            }

            assert.doesNotThrow(exploreFunction.bind(null, myFn('foo')));
        });

    });

    describe('API Objects', function () {
        
        it('should pass through to exploreFunction if object is a function', function () {
            const add = (a, b) => a + b;
            assert.equal(exploreApi(add), 'a:*, b:* => *');
        });

        it('should return info about all properties', function () {
            const api = {
                foo: {
                    bar: 'baz'
                },
                add: (a, b) => a + b,
                identity: a => a
            };

            const expected = {
                foo: {
                    bar: 'string'
                },
                add: 'a:*, b:* => *',
                identity: 'a:* => *'
            }


            let actual = exploreValue(api);
            console.log(exploreValue(api));

            assert.equal(JSON.stringify(actual), JSON.stringify(expected));
        });

    });

});

if (typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}