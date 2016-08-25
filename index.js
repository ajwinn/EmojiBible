'use strict'

var fs = require('fs');
var exec = require('child_process').execSync

let EmojiTranslate   = require('./lib'),
    bible_books = require('./lib/bible.js'),
    emojiTranslator = new EmojiTranslate()

let bible = fs.readFileSync('./bible.txt').toString();
let verses = bible.split('\n');

// verses = verses.slice(0,5)

let output = [];



  verses.forEach(function (v) {
    var split_at = v.lastIndexOf('|')+1;
    var book_chap_verse = v.slice(0,split_at).replace(/\|\|/g,'_');
    book_chap_verse =book_chap_verse.slice(0,book_chap_verse.length - 1);

    var separated = book_chap_verse.split('_');
    var first_two_numbers = separated[0][0] + separated[0][1]
    var book = bible_books[parseInt(first_two_numbers)-1]
    if (separated[2] == '1' ){
      fs.appendFileSync('./emoji_bible.txt','************************************\n')
      var chap_desc = '    '+book+ ' : Chapter ' + separated[1] + '\n';
      fs.appendFileSync('./emoji_bible.txt',chap_desc);
      fs.appendFileSync('./emoji_bible.txt','************************************\n')
    }

    var v_clean = v.slice(split_at)
    var book_abbr = book.includes(' ') ? book.slice(0,4).replace(' ','').toUpperCase() : book.slice(0,2).toUpperCase();
    var translation = emojiTranslator.translate(v_clean)
    translation = translation.replace(/ \, /g,', ');
    translation = translation.replace(/ \' /g,"'");
    // translation = translation.replace(/ \./g,".");
    // translation = translation.replace(/ \" \w/g,' "');
    // translation = translation.replace(/(\w) \" /g,'" ');
    // console.log('writing verse');
    var v_to_write = book_abbr + '.' + separated[1] + ':' + separated[2] + ' ' + translation + '\n'
    
    // console.log(v_to_write);
    fs.appendFileSync('./emoji_bible.txt',v_to_write);

  })



//console.log(emojiTranslator.translate('the house is on fire!'))
// the 🚪 is on 📛
