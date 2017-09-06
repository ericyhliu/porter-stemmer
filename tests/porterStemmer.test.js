/**
 * 
 * porterStemmer.test.js
 * 
 * This module is the test suite for the Porter's Stemmer
 * implementation.
 * 
 */

const expect = require('expect');
const { PorterStemmer } = require('./../lib-es6/porterStemmer');
const tests = require('./test-data.json');

describe('Main Test', () => {
    Object.keys(tests).forEach((key) => {
        let val = tests[key];
        it(`should map ${key} -> ${val}`, () => {
            let result = PorterStemmer.stem(key);
            expect(result).toBe(val);
        });
    });
});
