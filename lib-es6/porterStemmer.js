/**
 * 
 * porterStemmer.js
 * 
 * PorterStemmer module is an implementation of Porter's Stemmer Algorithm, an algorithm used to
 * remove the commoner morphological and inflexional endings from words in English, as 
 * a method of normalization in natural language processing.
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
        return `^(${PorterStemmer._C()})?${PorterStemmer._V()}
            ${PorterStemmer._C()}`;
    }

    static _meq1() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._V()}
            ${PorterStemmer._C()}(${PorterStemmer._V()})?$`;
    }

    static _mgr1() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._V()}
            ${PorterStemmer._C()}${PorterStemmer._V()}
            ${PorterStemmer._C()}`;
    }

    static _hv() {
        return `^(${PorterStemmer._C()})?${PorterStemmer._v()}`;
    }

    static _step1a() {
        return {
            'sses': 'ss',
            'ies': 'i',
            'ss': 'ss',
            's': ''
        };
    }

    static _step1b() {
        return {
            'eed': 'ee',
            'ed': '',
            'ing': '',
            'at': 'ate',
            'bl': 'ble',
            'iz': 'ize'
        };
    }

    static _step1c() {
        return {
            'y': 'i'
        };
    }

    static _step2() {
        return {
            'ational': 'ate',
            'tional': 'tion',
            'enci': 'ence',
            'anci': 'ance',
            'izer': 'ize',
            'abli': 'able',
            'alli': 'al',
            'entli': 'ent',
            'eli': 'e',
            'ousli': 'ous',
            'ization': 'ize',
            'ation': 'ate',
            'alism': 'al',
            'iveness': 'ive',
            'fulness': 'ful',
            'ousness': 'ous',
            'aliti': 'al',
            'iviti': 'ive',
            'biliti': 'ble'
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

    static _step4() {
        return {
            'al': '',
            'ance': '',
            'ence': '',
            'er': '',
            'ic': '',
            'able': '',
            'ible': '',
            'ant': '',
            'ement': '',
            'ment': '',
            'ent': '',
            'ion': '',
            'ou': '',
            'ism': '',
            'ate': '',
            'iti': '',
            'ous': '',
            'ive': '',
            'ize': ''
        };
    }

    static _normalize(w) {
        return w.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    }

    static _hasDuplicatedLastLetter(w) {
        return w[w.length - 1] && w[w.length - 2] &&  w[w.length - 1] === w[w.length - 2];
    }

    static _hasEndingCVC(w) {
        return w[w.length - 1] && w[w.length - 2] && 
        w[w.length - 3] && 
        /[^aeiou]/.test(w[w.length - 3]) && 
        /[^aeiou]/.test(w[w.length - 1]) && 
        /[aeiouy]/.test(w[w.length - 2]);
    }

    static _doStep1a(w) {
        let step1aMatch = Object.keys(PorterStemmer._step1a())
        .filter((s) => {
            return new RegExp(`${s}$`).test(w)
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step1aMatch) {
            w = w.replace(new RegExp(`${step1aMatch}$`), 
                PorterStemmer._step1a()[step1aMatch]);
        }
        return w;
    }

    static _doStep1b(w) {
        // Part 1:
        let doPart2 = false;
        if (w.endsWith('eed') && (new RegExp(PorterStemmer._mgr0()).test(w.substr(0, 
            w.lastIndexOf('eed'))))) {
            w = w.replace(new RegExp('eed$'), PorterStemmer._step1b()['eed']);
        } else if (w.endsWith('ed') && (new RegExp(PorterStemmer._hv()).test(w.substr(0, 
            w.lastIndexOf('ed'))))) {
            w = w.replace(new RegExp('ed$'), PorterStemmer._step1b()['ed']);
            doPart2 = true;
        } else if (w.endsWith('ing') && (new RegExp(PorterStemmer._hv()).test(w.substr(0, 
            w.lastIndexOf('ing'))))) {
            w = w.replace(new RegExp('ing$'), PorterStemmer._step1b()['ing']);
            doPart2 = true;
        }

        // Part 2 - only triggered when the second or third rule of the 
        // above is applied:
        if (doPart2) {
            if (w.endsWith('at')) {
                w = w.replace(new RegExp('at$'), PorterStemmer._step1b()['at']);
            } else if (w.endsWith('bl')) {
                w = w.replace(new RegExp('bl$'), PorterStemmer._step1b()['bl']);
            } else if (w.endsWith('iz')) {
                w = w.replace(new RegExp('iz$'), PorterStemmer._step1b()['iz']);
            } else if (PorterStemmer._hasDuplicatedLastLetter(w) && 
                !(w.endsWith('l') || 
                  w.endsWith('s') ||
                  w.endsWith('z'))) {
                const c = w[w.length - 1];
                w = w.replace(new RegExp(`${c}${c}$`), c);
            } else if (PorterStemmer._hasEndingCVC(w) && (new RegExp(PorterStemmer._meq1()).test(w))) {
                w += 'e';
            }
        }
        return w;
    }

    static _doStep1c(w) {
        if (w.endsWith('y') && (new RegExp(PorterStemmer._hv()).test(w.substr(0, 
            w.lastIndexOf('y'))))) {
            w = w.replace(new RegExp('y$'), PorterStemmer._step1c()['y']);
        }
        return w;
    }

    static _doStep2(w) {
        let step2Match = Object.keys(PorterStemmer._step2())
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : 
                new RegExp(PorterStemmer._mgr0()).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step2Match) {
            w = w.replace(new RegExp(`${step2Match}$`), 
                PorterStemmer._step2()[step2Match]);
        }
        return w;
    }

    static _doStep3(w) {
        let step3Match = Object.keys(PorterStemmer._step3())
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : 
                new RegExp(PorterStemmer._mgr0()).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step3Match) {
            w = w.replace(new RegExp(`${step3Match}$`), 
                PorterStemmer._step3()[step3Match]);
        }
        return w;
    }

    static _doStep4(w) {
        let step4Match = Object.keys(PorterStemmer._step4())
        .filter((s) => {
            const last = w.lastIndexOf(s);
            // Handle case of (m > 1 && (*s or *t)) 'ION' -> <null>
            if (s === 'ion') {
                const pre = w.substr(0, last);
                return (last === -1) ? false : new RegExp(PorterStemmer._mgr1()).test(pre)
                    && (pre.endsWith('s') || pre.endsWith('t'));
            }
            return (last === -1) ? false : 
                new RegExp(PorterStemmer._mgr1()).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step4Match) {
            w = w.replace(new RegExp(`${step4Match}$`), 
                PorterStemmer._step4()[step4Match]);
        }
        return w;
    }

    static _doStep5a(w) {
        if (w.endsWith('e') && (new RegExp(PorterStemmer._mgr1()).test(w.substr(0, 
            w.lastIndexOf('e'))))) {
            w = w.slice(0, -1);
        } else if (w.endsWith('e') && !(PorterStemmer._hasEndingCVC(w.slice(0, -1))) && 
            (new RegExp(PorterStemmer._meq1()).test(w.substr(0, w.lastIndexOf('e'))))) {
            w = w.slice(0, -1);
        }
        return w;
    }

    static _doStep5b(w) {
        if (w.endsWith('l') && PorterStemmer._hasDuplicatedLastLetter(w) && 
            (new RegExp(PorterStemmer._mgr1()).test(w.substr(0, w.length - 1)))) {
            const c = w[w.length - 1];
            w = w.replace(new RegExp(`${c}${c}$`), c);
        }
        return w;
    }

    static stem(w) {
        const fnlist = [
            PorterStemmer._normalize, 
            PorterStemmer._doStep1a,
            PorterStemmer._doStep1b,
            PorterStemmer._doStep1c,
            PorterStemmer._doStep2,
            PorterStemmer._doStep3,
            PorterStemmer._doStep4,
            PorterStemmer._doStep5a,
            PorterStemmer._doStep5b
        ];

        fnlist.forEach((fn) => {
            w = fn(w);
        });

        console.log(w);
        return w;
    }
}

module.exports = {
    PorterStemmer
};
