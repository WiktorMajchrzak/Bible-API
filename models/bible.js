const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
    verses: [String],
    versesLength: {
        type: Number
    }
})

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true
    },
    chapters: [chapterSchema],
    chaptersLength: {
        type: Number
    }
})

const bibleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true,
    },
    language: {
        type: String,
        required: true
    },
    books: [bookSchema],
    booksLength: {
        type: Number
    }
})

module.exports = mongoose.model('Bible', bibleSchema)