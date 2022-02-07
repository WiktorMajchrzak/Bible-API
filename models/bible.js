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
    title: {
        type: String,
        required: true
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

bibleSchema.index({ 'abbreviation': 1, 'books.abbreviation': 1}, { unique: true });

module.exports = mongoose.model('Bible', bibleSchema)