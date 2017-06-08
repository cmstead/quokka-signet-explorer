'use strict';

const signet = require('signet')();
const signetAssembler = require('signet-assembler');
const esprima = require('esprima');

function buildType(node) {
    let typeDef = {
        name: '',
        type: '*',
        optional: false
    };

    if(node.type === 'Identifier') {
        typeDef.name = node.name;
    } else {
        typeDef.name = node.left.name;
        typeDef.type = typeof node.right.value;
        typeDef.optional = true;
    }

    return signetAssembler.assembleType(typeDef);
}

function getParams(body) {
    return signet.isTypeOf('object')(body.params) ? body.params : body.expression.params;
}

function buildSignature(fn){
    let body = esprima.parse(fn.toString()).body[0];
    let params = getParams(body);

    const signatureParts = [
        params.map(buildType).join(', '),
        '*'
    ];

    return signatureParts.join(' => ');
}

function exploreFunction(fn) {
    if(signet.isTypeOf('not<function>')(fn)) {
        throw new Error('Unable to process value of type ' + typeof fn);
    }

    return signet.isTypeOf('string')(fn.signature) ? fn.signature : buildSignature(fn);
};

function exploreProperties(obj) {
    return Object.keys(obj).reduce(function (result, key) {
        result[key] = exploreValue(obj[key]);
        return result;
    }, {});
}

function exploreValue(obj) {
    if(signet.isTypeOf('function')(obj)) {
        return exploreFunction(obj);
    } else if(signet.isTypeOf('composite<not<null>, object>')(obj)) {
        return exploreProperties(obj);
    } else {
        return typeof obj;
    }
}

module.exports = {
    exploreFunction: exploreFunction,
    exploreValue: exploreValue
};