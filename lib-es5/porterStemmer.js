'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * porterStemmer.js
 * 
 * PorterStemmer module is an implementation of Porter's Stemmer Algorithm, an 
 * algorithm used to remove the commoner morphological and inflexional endings 
 * from words in English, as a method of normalization in natural language 
 * processing.
 * 
 * Author: Eric Liu (https://github.com/eliucs)
 * 
 */

var PorterStemmer = function () {
    function PorterStemmer() {
        _classCallCheck(this, PorterStemmer);
    }

    _createClass(PorterStemmer, null, [{
        key: '_c',
        value: function _c() {
            return '[^aeiou]';
        }
    }, {
        key: '_v',
        value: function _v() {
            return '[aeiouy]';
        }
    }, {
        key: '_C',
        value: function _C() {
            return PorterStemmer._c() + '[^aeiouy]*';
        }
    }, {
        key: '_V',
        value: function _V() {
            return PorterStemmer._v() + '[aeiou]*';
        }
    }, {
        key: '_mgr0',
        value: function _mgr0() {
            return '^(' + PorterStemmer._C() + ')?' + ('' + PorterStemmer._V() + PorterStemmer._C());
        }
    }, {
        key: '_meq1',
        value: function _meq1() {
            return '^(' + PorterStemmer._C() + ')?' + PorterStemmer._V() + (PorterStemmer._C() + '(' + PorterStemmer._V() + ')?$');
        }
    }, {
        key: '_mgr1',
        value: function _mgr1() {
            return '^(' + PorterStemmer._C() + ')?' + PorterStemmer._V() + ('' + PorterStemmer._C() + PorterStemmer._V() + PorterStemmer._C());
        }
    }, {
        key: '_hv',
        value: function _hv() {
            return '^(' + PorterStemmer._C() + ')?' + PorterStemmer._v();
        }
    }, {
        key: '_step2',
        value: function _step2() {
            return {
                'ational': 'ate',
                'tional': 'tion',
                'enci': 'ence',
                'anci': 'ance',
                'izer': 'ize',
                'bli': 'ble',
                'alli': 'al',
                'entli': 'ent',
                'eli': 'e',
                'ousli': 'ous',
                'ization': 'ize',
                'ation': 'ate',
                'ator': 'ate',
                'alism': 'al',
                'iveness': 'ive',
                'fulness': 'ful',
                'ousness': 'ous',
                'aliti': 'al',
                'iviti': 'ive',
                'biliti': 'ble',
                'logi': 'log'
            };
        }
    }, {
        key: '_step3',
        value: function _step3() {
            return {
                'icate': 'ic',
                'ative': '',
                'alize': 'al',
                'iciti': 'ic',
                'ical': 'ic',
                'ful': '',
                'ness': ''
            };
        }
    }, {
        key: '_normalize',
        value: function _normalize(w) {
            var first = w.substr(0, 1);
            if (first == 'y') {
                w = first.toUpperCase() + w.substr(1);
            }
            return w.toLowerCase().replace(/[^a-zA-Z]+/g, '');
        }
    }, {
        key: '_doStep1a',
        value: function _doStep1a(w) {
            var re = /^(.+?)(ss|i)es$/;
            var re2 = /^(.+?)([^s])s$/;
            if (re.test(w)) {
                w = w.replace(re, '$1$2');
            } else if (re2.test(w)) {
                w = w.replace(re2, '$1$2');
            }
            return w;
        }
    }, {
        key: '_doStep1b',
        value: function _doStep1b(w) {
            var re = /^(.+?)eed$/;
            var re2 = /^(.+?)(ed|ing)$/;
            if (re.test(w)) {
                var fp = re.exec(w);
                re = new RegExp(PorterStemmer._mgr0());
                if (re.test(fp[1])) {
                    re = /.$/;
                    w = w.replace(re, '');
                }
            } else if (re2.test(w)) {
                var _fp = re2.exec(w);
                var stem = _fp[1];
                re2 = new RegExp(PorterStemmer._hv());
                if (re2.test(stem)) {
                    w = stem;
                    re2 = /(at|bl|iz)$/;
                    var re3 = new RegExp('([^aeiouylsz])\\1$');
                    var re4 = new RegExp('^' + PorterStemmer._C() + (PorterStemmer._v() + '[^aeiouwxy]$'));

                    if (re2.test(w)) {
                        w += 'e';
                    } else if (re3.test(w)) {
                        re = /.$/;
                        w = w.replace(re, '');
                    } else if (re4.test(w)) {
                        w += 'e';
                    }
                }
            }
            return w;
        }
    }, {
        key: '_doStep1c',
        value: function _doStep1c(w) {
            var re = new RegExp('^(.*' + PorterStemmer._v() + '.*)y$');
            if (re.test(w)) {
                var fp = re.exec(w);
                var stem = fp[1];
                w = stem + 'i';
            }
            return w;
        }
    }, {
        key: '_doStep2',
        value: function _doStep2(w) {
            var re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
            if (re.test(w)) {
                var fp = re.exec(w);
                var stem = fp[1];
                var suffix = fp[2];
                re = new RegExp(PorterStemmer._mgr0());
                if (re.test(stem)) {
                    w = stem + PorterStemmer._step2()[suffix];
                }
            }
            return w;
        }
    }, {
        key: '_doStep3',
        value: function _doStep3(w) {
            var re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
            if (re.test(w)) {
                var fp = re.exec(w);
                var stem = fp[1];
                var suffix = fp[2];
                re = new RegExp(PorterStemmer._mgr0());
                if (re.test(stem)) {
                    w = stem + PorterStemmer._step3()[suffix];
                }
            }
            return w;
        }
    }, {
        key: '_doStep4',
        value: function _doStep4(w) {
            var re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
            var re2 = /^(.+?)(s|t)(ion)$/;
            if (re.test(w)) {
                var fp = re.exec(w);
                var stem = fp[1];
                re = new RegExp(PorterStemmer._mgr1());
                if (re.test(stem)) {
                    w = stem;
                }
            } else if (re2.test(w)) {
                var _fp2 = re2.exec(w);
                var _stem = _fp2[1] + _fp2[2];
                re2 = new RegExp(PorterStemmer._mgr1());
                if (re2.test(_stem)) {
                    w = _stem;
                }
            }
            return w;
        }
    }, {
        key: '_doStep5',
        value: function _doStep5(w) {
            var re = /^(.+?)e$/;
            if (re.test(w)) {
                var fp = re.exec(w);
                var stem = fp[1];
                re = new RegExp(PorterStemmer._mgr1());
                var _re = new RegExp(PorterStemmer._meq1());
                var re3 = new RegExp('^' + PorterStemmer._C() + (PorterStemmer._v() + '[^aeiouwxy]$'));
                if (re.test(stem) || _re.test(stem) && !re3.test(stem)) {
                    w = stem;
                }
            }
            re = /ll$/;
            var re2 = new RegExp(PorterStemmer._mgr1());
            if (re.test(w) && re2.test(w)) {
                re = /.$/;
                w = w.replace(re, '');
            }
            return w;
        }
    }, {
        key: 'stem',
        value: function stem(w) {
            if (w.length < 3) {
                return w;
            }

            [PorterStemmer._normalize, PorterStemmer._doStep1a, PorterStemmer._doStep1b, PorterStemmer._doStep1c, PorterStemmer._doStep2, PorterStemmer._doStep3, PorterStemmer._doStep4, PorterStemmer._doStep5].forEach(function (fn) {
                w = fn(w);
            });

            return w;
        }
    }]);

    return PorterStemmer;
}();

module.exports = {
    PorterStemmer: PorterStemmer
};