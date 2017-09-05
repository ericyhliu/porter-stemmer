/**
 * 
 * porterStemmer.js
 * 
 * This module is an implementation of Porter's Stemmer, an algorithm used to
 * remove the commoner morphological and inflexional endings from words in 
 * English, as a method of normalization.
 * 
 */

class PorterStemmer {

    constructor() {
        const c = '[^aeiou]';
        const v = '[aeiouy]';
        const C = `${c}[^aeiouy]*`;
        const V = `${v}[aeiou]*`;
        this.mgr0 = `^(${C})?${V}${C}`;
        this.meq1 = `^(${C})?${V}${C}(${V})?$`;
        this.mgr1 = `^(${C})?${V}${C}${V}${C}`;
        this.hasVowel = `^(${C})?${v}`;

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

    stem(w) {
        let original = w;

        // Normalize w:
        w = w.toLowerCase().replace(/[^a-zA-Z]+/g, '');
        console.log(w);

        // Step 1a:
        console.log('\n--Step 1--')
        let step1aMatch = Object.keys(this.step1a)
        .filter((s) => {
            return new RegExp(`${s}$`).test(w)
        })
        .map((s) => {
            return {
                stem: s,
                len: s.length
            };
        })
        .reduce((prev, current) => {
            return (prev.len > current.len) ? prev : current;
        }, false);
        console.log(step1aMatch);

        if (step1aMatch) {
            w = w.replace(new RegExp(`${step1aMatch.stem}$`), 
                this.step1a[step1aMatch.stem]);
        }
        console.log(w);

        // Step 1b:
        // (m > 0) EED -> EE
        let secondOrThird = false;
        if (w.endsWith('eed') && (new RegExp(this.mgr0).test(w.substr(0, 
            w.lastIndexOf('eed'))))) {
            w = w.replace(new RegExp('eed$'), this.step1b['eed']);
        } else if (w.endsWith('ed') && (new RegExp(this.hasVowel).test(w.substr(0, 
            w.lastIndexOf('ed'))))) {
            w = w.replace(new RegExp('ed$'), this.step1b['ed']);
            secondOrThird = true;
        } else if (w.endsWith('ing') && (new RegExp(this.hasVowel).test(w.substr(0, 
            w.lastIndexOf('ing'))))) {
            w = w.replace(new RegExp('ing$'), this.step1b['ing']);
            secondOrThird = true;
        }

        // Only triggered when the second or third rule of Step 1b is applied:
        if (w.endsWith('at')) {
            w = w.replace(new RegExp('at$'), this.step1b['at']);
        } else if (w.endsWith('bl')) {
            w = w.replace(new RegExp('bl$'), this.step1b['bl']);
        } else if (w.endsWith('iz')) {
            w = w.replace(new RegExp('iz$'), this.step1b['ize']);
        } else if (w[w.length - 1] && w[w.length - 2] && 
            w[w.length - 1] === w[w.length - 2] && 
            !(w[w.length - 1] === 'l' || w[w.length - 1] === 's' || w[w.length - 1] === 'z')) {
            w = w.replace(new RegExp(`${w[w.length - 1]}${w[w.length - 1]}$`), w[w.length - 1]);
        } else if ((new RegExp(this.meq1).test(w)) && w[w.length - 1] && w[w.length - 2] && 
            w[w.length - 3] && /[^aeiou]/.test(w[w.length - 3]) && /[^aeiou]/.test(w[w.length - 1])
            && /[aeiouy]/.test(w[w.length - 2])) {
            w += 'e';
        }

        // Step 1c:
        if (w.endsWith('y') && (new RegExp(this.hasVowel).test(w.substr(0, 
            w.lastIndexOf('y'))))) {
            w = w.replace(new RegExp('y$'), this.step1c['i']);
        }

        // Step 2:
        console.log('\n--Step 2--');
        let step2Match = Object.keys(this.step2)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : new RegExp(this.mgr0).test(w.substr(0, last));
        })
        .map((s) => {
            return {
                stem: s,
                len: s.length
            };
        })
        .reduce((prev, current) => {
            return (prev.len > current.len) ? prev : current;
        }, false);
        console.log(step2Match);

        if (step2Match) {
            w = w.replace(new RegExp(`${step2Match.stem}$`), 
                this.step2[step2Match.stem]);
        }
        console.log(w);

        // Step 3:
        console.log('\n--Step 3--');
        let step3Match = Object.keys(this.step3)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            return (last === -1) ? false : new RegExp(this.mgr0).test(w.substr(0, last));
        })
        .map((s) => {
            return {
                stem: s,
                len: s.length
            };
        })
        .reduce((prev, current) => {
            return (prev.len > current.len) ? prev : current;
        }, false);
        console.log(step3Match);

        if (step3Match) {
            w = w.replace(new RegExp(`${step3Match.stem}$`), 
                this.step3[step3Match.stem]);
        }
        console.log(w);

        // Step 4:
        console.log('\n--Step 4--');
        let step4Match = Object.keys(this.step4)
        .filter((s) => {
            const last = w.lastIndexOf(s);
            // Handle case of (m > 1 && (*S or *T)) ION -> <null>
            if (s === 'ion') {
                const pre = w.substr(0, last);
                return (last === -1) ? false : new RegExp(this.mgr1).test(pre)
                    && (pre.endsWith('s') || pre.endsWith('t'));
            }
            return (last === -1) ? false : new RegExp(this.mgr1).test(w.substr(0, last));
        })
        .map((s) => {
            return {
                stem: s,
                len: s.length
            };
        })
        .reduce((prev, current) => {
            return (prev.len > current.len) ? prev : current;
        }, false);
        console.log(step4Match);

        if (step4Match) {
            w = w.replace(new RegExp(`${step4Match.stem}$`), 
                this.step4[step4Match.stem]);
        }
        console.log(w);

        // Step 5a:
        if (w.endsWith('e') && (new RegExp(this.mgr1).test(w.substr(0, w.lastIndexOf('e'))))) {
            w = w.slice(0, w.length - 1);
        } else if (w.endsWith('e') && !(w[w.length - 2] && w[w.length - 3] && 
            w[w.length - 4] && /[^aeiou]/.test(w[w.length - 4]) && /[^aeiou]/.test(w[w.length - 2])
            && /[aeiouy]/.test(w[w.length - 3])) && (new RegExp(this.meq1).test(w.substr(0, w.lastIndexOf('e'))))) {
            w = w.slice(0, w.length - 1);
        }

        // Step 5b:
        if (w.endsWith('l') && w[w.length - 1] && w[w.length - 2] && w[w.length - 1] === w[w.length - 2] && 
            (new RegExp(this.mgr1).test(w.substr(0, w.length - 1)))) {
            w = w.replace(new RegExp(`${w[w.length - 1]}${w[w.length - 1]}$`), w[w.length - 1]);
        }
        console.log(w);

        return w;
    }

}

module.exports = {
    PorterStemmer
};
