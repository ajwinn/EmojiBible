'use strict'

const emojis = require("emojilib")
const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'

let pos = require('pos');
let inf = require('inflection')


module.exports = function createEmojiTranslate() {
    return new EmojiTranslate()
}

function EmojiTranslate() {}
EmojiTranslate.prototype = Object.create(Object.prototype)

EmojiTranslate.prototype.translate = function(text) {

    // ADAM ADDED
    let words = new pos.Lexer().lex(text);
    let tagger = new pos.Tagger();
    let taggedWords = tagger.tag(words);

    let translatedText = []
    for (var idx in taggedWords) {

        if (taggedWords[idx][1] == 'NNS') {
            var translated_word = translateWord(inf.singularize(taggedWords[idx][0]))
        } else {
            var translated_word = translateWord(taggedWords[idx][0])
        }

        translatedText.push(translated_word)
    }

    return translatedText.join(' ')
}

function translateWord(word) {
    
    // word = normalizeWord(word[0])
    let result = word
    for (var key in emojis) {
        if (emojis.hasOwnProperty(key)) {
            let emoji = emojis[key],
                keywords = emoji.keywords || []
            if (keywords.indexOf(word.toLowerCase()) !== -1) {
                result = emoji.char + ' '
                break
            }
        }
    }

    return result
}

function normalizeWord(word) {
    while (SYMBOLS.indexOf(word[0]) !== -1) {
        word = word.slice(1, word.length)
    }

    while (SYMBOLS.indexOf(word[word.length - 1]) !== -1) {
        word = word.slice(0, word.length - 1)
    }

    // plural?
    if (word.length > 2 && word[word.length - 1] == 's') {
        word = word.slice(0, word.length - 1)
    }

    return word
}
