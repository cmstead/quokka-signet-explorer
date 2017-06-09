'use strict';

const signet = require('signet')();
const signetAssembler = require('signet-assembler');
const esprima = require('esprima');

const isFunction = signet.isTypeOf('function');
const isObjectInstance = signet.isTypeOf('composite<not<null>, object>');
const isString = signet.isTypeOf('string');

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
    return isObjectInstance(body.params) ? body.params : body.expression.params;
}

function buildSignature(fn){
    let parseableStr = '(' + fn.toString() + ')()';
    let body = esprima.parse(parseableStr).body[0].expression.callee;
    let params = getParams(body);

    const signatureParts = [
        params.map(buildType).join(', '),
        '*'
    ];

    return signatureParts.join(' => ');
}

function exploreFunction(fn) {
    if(!isFunction(fn)) {
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

module.exports = {
    exploreFunction: exploreFunction,
    exploreValue: exploreValue
};