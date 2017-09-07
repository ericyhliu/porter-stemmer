# Porter's Stemmer

In natural language processing, stemming is used to reduce a word to their
stem, which is the word in some root form. For example, we say that the words
'playing', 'played', 'play' and 'player' have the same stem, namely 'play'.
Stemming is useful for normalizing words and eliminating superflousness in 
the language's grammar and vocabulary.

Porter's Stemming Algorithm, also known as the Porter Stemmer, is a 
stemming algorithm first published in 1980 by Martin F. Porter in
'C.J. van Rijsbergen, S.E. Robertson and M.F. Porter, 1980. *New models in 
probabilistic information retrieval.* London: British Library. (British Library 
Research and Development Report, no. 5587).' and the paper can be viewed
[here](https://tartarus.org/martin/PorterStemmer/def.txt).

## Usage

Minimal usage:

```
PorterStemmer.stem('someTestWord');
```

Asynchronous (callback) version:

```
PorterStemmer.stemAsync('someTestWord', (result, error) => {
    if (error) {
        // Handle error...
    }
    // Do something...
});
```

Asynchronous (Promise) version:

```
PorterStemmer.stemAsyncPromise('someTestWord')
.then((result) => {
    // Do someting...
})
.catch((error) => {
    // Handle error...
});
```

## Testing

Uses `babel` to transpile ES6 code to ES5 code, `gulp` to minify the ES5 code 
and `mocha` for testing:

```
npm test
```

