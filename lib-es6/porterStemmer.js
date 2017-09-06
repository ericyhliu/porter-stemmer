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

class PorterStemmer {

    constructor() {}

    static _c() {
        return '[^aeiou]';
    }

    static _v() {
        return '[aeiouy]';
    }

    static _C() {
        return `${PorterStemmer._c()}[^aeiouy]*`;
    }

    static _V() {
        return `${PorterStemmer._v()}[aeiou]*`;
    }

    static _mgr0() {
        return `^(${PorterStemmer._C()})?` + 
            `${PorterStemmer._V()}${PorterStemmer._C()}`; 
    }

    static _meq1() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._V()}` + 
            `${PorterStemmer._C()}(${PorterStemmer._V()})?$`;
    }

    static _mgr1() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._V()}` + 
            `${PorterStemmer._C()}${PorterStemmer._V()}${PorterStemmer._C()}`;
    }

    static _hv() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._v()}`;
    }

    static _step2() {
        return {
            'ational' : 'ate',
            'tional' : 'tion',
            'enci' : 'ence',
            'anci' : 'ance',
            'izer' : 'ize',
            'bli' : 'ble',
            'alli' : 'al',
            'entli' : 'ent',
            'eli' : 'e',
            'ousli' : 'ous',
            'ization' : 'ize',
            'ation' : 'ate',
            'ator' : 'ate',
            'alism' : 'al',
            'iveness' : 'ive',
            'fulness' : 'ful',
            'ousness' : 'ous',
            'aliti' : 'al',
            'iviti' : 'ive',
            'biliti' : 'ble',
            'logi' : 'log'
          };
    }

    static _step3() {
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

    static _normalize(w) {
        const first = w.substr(0, 1);
        if (first == 'y') {
          w = first.toUpperCase() + w.substr(1);
        }
        return w.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    }

    static _doStep1a(w) {
        let re = /^(.+?)(ss|i)es$/;
        let re2 = /^(.+?)([^s])s$/;
        if (re.test(w)) { 
          w = w.replace(re, '$1$2'); 
        } else if (re2.test(w)) {
          w = w.replace(re2, '$1$2'); 
        }
        return w;
    }

    static _doStep1b(w) {
        let re = /^(.+?)eed$/;
        let re2 = /^(.+?)(ed|ing)$/;
        if (re.test(w)) {
          let fp = re.exec(w);
          re = new RegExp(PorterStemmer._mgr0());
          if (re.test(fp[1])) {
            re = /.$/;
            w = w.replace(re, '');
          }
        } else if (re2.test(w)) {
          let fp = re2.exec(w);
          let stem = fp[1];
          re2 = new RegExp(PorterStemmer._hv());
          if (re2.test(stem)) {
            w = stem;
            re2 = /(at|bl|iz)$/;
            let re3 = new RegExp('([^aeiouylsz])\\1$');
            let re4 = new RegExp(`^${PorterStemmer._C()}` + 
                `${PorterStemmer._v()}[^aeiouwxy]$`);
    
            if (re2.test(w)) { 
              w += 'e'; 
            } else if (re3.test(w)) { 
              re = /.$/; 
              w = w.replace(re,''); 
            } else if (re4.test(w)) { 
              w += 'e'; 
            }
          }
        }
        return w;
    }

    static _doStep1c(w) {
        let re = new RegExp(`^(.*${PorterStemmer._v()}.*)y$`);
        if (re.test(w)) {
          let fp = re.exec(w);
          let stem = fp[1];
          w = stem + 'i';
        }
        return w;
    }

    static _doStep2(w) {
        let re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(w)) {
          let fp = re.exec(w);
          let stem = fp[1];
          let suffix = fp[2];
          re = new RegExp(PorterStemmer._mgr0());
          if (re.test(stem)) {
            w = stem + PorterStemmer._step2()[suffix];
          }
        }
        return w;
    }

    static _doStep3(w) {
        let re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(w)) {
          let fp = re.exec(w);
          let stem = fp[1];
          let suffix = fp[2];
          re = new RegExp(PorterStemmer._mgr0());
          if (re.test(stem)) {
            w = stem + PorterStemmer._step3()[suffix];
          }
        }
        return w;
    }

    static _doStep4(w) {
        let re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        let re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(w)) {
          let fp = re.exec(w);
          let stem = fp[1];
          re = new RegExp(PorterStemmer._mgr1());
          if (re.test(stem)) {
            w = stem;
          }
        } else if (re2.test(w)) {
          let fp = re2.exec(w);
          let stem = fp[1] + fp[2];
          re2 = new RegExp(PorterStemmer._mgr1());
          if (re2.test(stem)) {
            w = stem;
          }
        }
        return w;
    }

    static _doStep5(w) {
        let re = /^(.+?)e$/;
        if (re.test(w)) {
          let fp = re.exec(w);
          let stem = fp[1];
          re = new RegExp(PorterStemmer._mgr1());
          let re2 = new RegExp(PorterStemmer._meq1());
          let re3 = new RegExp(`^${PorterStemmer._C()}` + 
            `${PorterStemmer._v()}[^aeiouwxy]$`);
          if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
            w = stem;
          }
        }
        re = /ll$/;
        let re2 = new RegExp(PorterStemmer._mgr1());
        if (re.test(w) && re2.test(w)) {
          re = /.$/;
          w = w.replace(re, '');
        }
        return w;
    }

    static stem(w) {
        if (w.length < 3) { 
            return w; 
        }

        [
            PorterStemmer._normalize, 
            PorterStemmer._doStep1a,
            PorterStemmer._doStep1b,
            PorterStemmer._doStep1c,
            PorterStemmer._doStep2,
            PorterStemmer._doStep3,
            PorterStemmer._doStep4,
            PorterStemmer._doStep5
        ]
        .forEach((fn) => {
            w = fn(w);
        });
        
        return w;
    }

    static stemAsync(w, callback) {
        if (w.length < 3) {
            return callback(w, undefined);
        }

        try {
            [
                PorterStemmer._normalize, 
                PorterStemmer._doStep1a,
                PorterStemmer._doStep1b,
                PorterStemmer._doStep1c,
                PorterStemmer._doStep2,
                PorterStemmer._doStep3,
                PorterStemmer._doStep4,
                PorterStemmer._doStep5
            ]
            .forEach((fn) => {
                w = fn(w);
            });

            return callback(w, undefined);
        } catch (e) {
            return callback(undefined, true);
        }
    }

    static stemAsyncPromise(w) {
        return new Promise((resolve, reject) => {
            if (w.length < 3) {
                return resolve(w);
            }

            try {
                [
                    PorterStemmer._normalize, 
                    PorterStemmer._doStep1a,
                    PorterStemmer._doStep1b,
                    PorterStemmer._doStep1c,
                    PorterStemmer._doStep2,
                    PorterStemmer._doStep3,
                    PorterStemmer._doStep4,
                    PorterStemmer._doStep5
                ]
                .forEach((fn) => {
                    w = fn(w);
                });

                return resolve(w);
            } catch (e) {
                return reject(e);
            }
        });
    }
}

module.exports = {
    PorterStemmer
};
