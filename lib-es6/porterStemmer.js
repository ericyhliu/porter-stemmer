/**
 * 
 * porterStemmer.js
 * 
 * This module is an implementation of Porter's Stemmer Algorithm, an algorithm used to
 * remove the commoner morphological and inflexional endings from words in English, as 
 * a method of normalization in natural language processing.
 * 
 * Author: Eric Liu (https://github.com/eliucs)
 * 
 */

class PorterStemmer {

    constructor() {
        this.c = '[^aeiou]';
        this.v = '[aeiouy]';
        this.C = `${this.c}[^aeiouy]*`;
        this.V = `${this.v}[aeiou]*`;
        this.mgr0 = `^(${this.C})?${this.V}${this.C}`;
        this.meq1 = `^(${this.C})?${this.V}${this.C}(${this.V})?$`;
        this.mgr1 = `^(${this.C})?${this.V}${this.C}${this.V}${this.C}`;
        this.hv = `^(${this.C})?${this.v}`;

        this.step1a = {
            'sses': 'ss',
            'ies': 'i',
            'ss': 'ss',
            's': ''
        };
    
        this.step1b = {
            'eed': 'ee',
            'ed': '',
            'ing': '',
            'at': 'ate',
            'bl': 'ble',
            'iz': 'ize'
        };
    
        this.step1c = {
            'y': 'i'
        };
    
        this.step2 = {
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
    
        this.step3 = {
            'icate': 'ic',
            'ative': '',
            'alize': 'al',
            'iciti': 'ic',
            'ical': 'ic',
            'ful': '',
            'ness': ''
        };
    
        this.step4 = {
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
    
        this.step5a = {
            'e': ''
        };
    }

    normalize(w) {
        return w.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    }

    hasDuplicatedLastLetter(w) {
        return w[w.length - 1] && w[w.length - 2] &&  w[w.length - 1] === w[w.length - 2];
    }

    hasEndingCVC(w) {
        return w[w.length - 1] && w[w.length - 2] && 
        w[w.length - 3] && 
        /[^aeiou]/.test(w[w.length - 3]) && 
        /[^aeiou]/.test(w[w.length - 1]) && 
        /[aeiouy]/.test(w[w.length - 2]);
    }

    doStep1a(w) {
        let step1aMatch = Object.keys(this.step1a)
        .filter((s) => {
            return new RegExp(`${s}$`).test(w)
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step1aMatch) {
            w = w.replace(new RegExp(`${step1aMatch}$`), 
                this.step1a[step1aMatch]);
        }
        return w;
    }

    doStep1b(w) {
        // Part 1:
        let doPart2 = false;
        if (w.endsWith('eed') && (new RegExp(this.mgr0).test(w.substr(0, 
            w.lastIndexOf('eed'))))) {
            w = w.replace(new RegExp('eed$'), this.step1b['eed']);
        } else if (w.endsWith('ed') && (new RegExp(this.hv).test(w.substr(0, 
            w.lastIndexOf('ed'))))) {
            w = w.replace(new RegExp('ed$'), this.step1b['ed']);
            doPart2 = true;
        } else if (w.endsWith('ing') && (new RegExp(this.hv).test(w.substr(0, 
            w.lastIndexOf('ing'))))) {
            w = w.replace(new RegExp('ing$'), this.step1b['ing']);
            doPart2 = true;
        }

        // Part 2 - only triggered when the second or third rule of the 
        // above is applied:
        if (doPart2) {
            if (w.endsWith('at')) {
                w = w.replace(new RegExp('at$'), this.step1b['at']);
            } else if (w.endsWith('bl')) {
                w = w.replace(new RegExp('bl$'), this.step1b['bl']);
            } else if (w.endsWith('iz')) {
                w = w.replace(new RegExp('iz$'), this.step1b['iz']);
            } else if (this.hasDuplicatedLastLetter(w) && 
                !(w.endsWith('l') || 
                  w.endsWith('s') ||
                  w.endsWith('z'))) {
                const c = w[w.length - 1];
                w = w.replace(new RegExp(`${c}${c}$`), c);
            } else if (this.hasEndingCVC(w) && (new RegExp(this.meq1).test(w))) {
                w += 'e';
            }
        }
        return w;
    }

    doStep1c(w) {
        if (w.endsWith('y') && (new RegExp(this.hv).test(w.substr(0, 
            w.lastIndexOf('y'))))) {
            w = w.replace(new RegExp('y$'), this.step1c['y']);
        }
        return w;
    }

    doStep2(w) {
        let step2Match = Object.keys(this.step2)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : 
                new RegExp(this.mgr0).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step2Match) {
            w = w.replace(new RegExp(`${step2Match}$`), 
                this.step2[step2Match]);
        }
        return w;
    }

    doStep3(w) {
        let step3Match = Object.keys(this.step3)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : 
                new RegExp(this.mgr0).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step3Match) {
            w = w.replace(new RegExp(`${step3Match}$`), 
                this.step3[step3Match]);
        }
        return w;
    }

    doStep4(w) {
        let step4Match = Object.keys(this.step4)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            // Handle case of (m > 1 && (*s or *t)) 'ION' -> <null>
            if (s === 'ion') {
                const pre = w.substr(0, last);
                return (last === -1) ? false : new RegExp(this.mgr1).test(pre)
                    && (pre.endsWith('s') || pre.endsWith('t'));
            }
            return (last === -1) ? false : 
                new RegExp(this.mgr1).test(w.substr(0, last));
        })
        .reduce((previous, current) => {
            return (previous.length > current.length) ? previous : current;
        }, false);

        if (step4Match) {
            w = w.replace(new RegExp(`${step4Match}$`), 
                this.step4[step4Match]);
        }
        return w;
    }

    doStep5a(w) {
        if (w.endsWith('e') && (new RegExp(this.mgr1).test(w.substr(0, 
            w.lastIndexOf('e'))))) {
            w = w.slice(0, -1);
        } else if (w.endsWith('e') && !(this.hasEndingCVC(w.slice(0, -1))) && 
            (new RegExp(this.meq1).test(w.substr(0, w.lastIndexOf('e'))))) {
            w = w.slice(0, -1);
        }
        return w;
    }

    doStep5b(w) {
        if (w.endsWith('l') && this.hasDuplicatedLastLetter(w) && 
            (new RegExp(this.mgr1).test(w.substr(0, w.length - 1)))) {
            const c = w[w.length - 1];
            w = w.replace(new RegExp(`${c}${c}$`), c);
        }
        return w;
    }

    stem(w) {
        w = this.normalize(w);
        w = this.doStep1a(w);
        w = this.doStep1b(w);
        w = this.doStep1c(w);
        w = this.doStep2(w);
        w = this.doStep3(w);
        w = this.doStep4(w);
        w = this.doStep5a(w);
        w = this.doStep5b(w);

        console.log(w);
        return w;
    }
}

let p = new PorterStemmer();
p.stem('roll');

module.exports = {
    PorterStemmer
};
