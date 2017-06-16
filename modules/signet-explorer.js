(function () {
    'use strict';

    let _signet = typeof signet === 'object' ? signet : null;
    let _signetAssembler = typeof signetAssembler === 'object' ? signetAssembler : null;
    let _esprima = typeof esprima !== 'undefined' ? esprima : null;
    let missingModules = [];

    if (typeof require === 'function') {
        _signet = require('signet')();
        _signetAssembler = require('signet-assembler');
        _esprima = require('esprima');
    }

    if (_signet === null) { missingModules.push('signet'); }
    if (_signetAssembler === null) { missingModules.push('signetAssembler'); }
    if (_esprima === null) { missingModules.push('esprima'); }

    if (missingModules.length > 0) {
        let message = 'Signet Explorer is missing the following require modules';
        message += missingModules.join(', ');

        throw new Error(message);
    }

    const isFunction = _signet.isTypeOf('function');
    const isObjectInstance = _signet.isTypeOf('composite<not<null>, object>');
    const isString = _signet.isTypeOf('string');

    function buildType(node) {
        let typeDef = {
            name: '',
            type: '*',
            optional: false
        };

        if (node.type === 'Identifier') {
            typeDef.name = node.name;
        } else {
            typeDef.name = node.left.name;
            typeDef.type = typeof node.right.value;
            typeDef.optional = true;
        }

        return _signetAssembler.assembleType(typeDef);
    }

    function getParams(body) {
        return isObjectInstance(body.params) ? body.params : body.expression.params;
    }

    function buildSignature(fn) {
        let parseableStr = '(' + fn.toString() + ')()';
        let body = _esprima.parse(parseableStr).body[0].expression.callee;
        let params = getParams(body);

        const signatureParts = [
            params.map(buildType).join(', '),
            '*'
        ];

        return signatureParts.join(' => ');
    }

    function exploreFunction(fn) {
        if (!isFunction(fn)) {
            throw new Error('Unable to process value of type ' + typeof fn);
        }

        return isString(fn.signature) ? fn.signature : buildSignature(fn);
    }

    function exploreProperties(obj) {
        let setProp = (result, key) => (result[key] = exploreValue(obj[key]), result);
        return Object.keys(obj).reduce(setProp, {});
    }

    function getValueType(value) {
        return value === null ? 'null' : typeof value;
    }

    function exploreValue(value) {
        let exploreType = getValueType;
        exploreType = isFunction(value) ? exploreFunction : exploreType;
        exploreType = isObjectInstance(value) ? exploreProperties : exploreType;

        return exploreType(value);
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = {
            exploreFunction: exploreFunction,
            exploreValue: exploreValue
        };
    } else {
        window.exploreApi = exploreValue;
        window.exploreFunction = exploreFunction;
        window.exploreValue = exploreValue;
    }

})();
