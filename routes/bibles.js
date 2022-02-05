const express = require('express')
const router = express.Router()
const Bible = require('../models/bible')

router.get('/', getBiblesProjection, getBibles, (req, res) => {
    res.json(res.bibles)
})

router.get('/:abbreviation', getBibleProjection, getBible, (req, res) => {
    res.json(res.bible)
})

router.get('/:abbreviation/:bookAbbreviation', getBookProjection, getBible, getBook, (req, res) => {
    res.json(res.book)
})

router.get('/:abbreviation/:bookAbbreviation/:chapter', getChapterProjection, getBible, getBook, getChapter, (req, res) => {
    res.json(res.chapter)
})

router.get('/:abbreviation/:bookAbbreviation/:chapter/:fromVerse-:toVerse', getVerseProjection, getBible, getBook, getChapter, getVerses, (req, res) => {
    res.json(res.verses)
})

router.get('/:abbreviation/:bookAbbreviation/:chapter/:verse', getVerseProjection, getBible, getBook, getChapter, getVerse, (req, res) => {
    res.json([res.verse])
})

function getBiblesProjection(req, res, next) {
    res.projection = { '_id': 0, '__v': 0, 'books': 0}
    next()
}

function getBibleProjection(req, res, next) {
    res.projection = { '_id': 0, '__v': 0, 'books._id': 0, 'books.chapters': 0 }
    next()
}

function getBookProjection(req, res, next) {
    res.projection = { '_id': 0, '__v': 0, 'books._id': 0, 'books.chapters._id': 0, 'books.chapters.verses': 0 }
    next()
}

function getChapterProjection(req, res, next) {
    res.projection = { '_id': 0, '__v': 0, 'books._id': 0, 'books.chapters._id': 0 }
    next()
}

function getVerseProjection(req, res, next) {
    res.projection = { '_id': 0, '__v': 0, 'books._id': 0, 'books.chapters._id': 0 }
    next()
}

async function getBibles(req, res, next) {
    try {
        bibles = await Bible.find({}, res.projection)
    }
    catch (err) {
        res.status(500).json({ message : err.message })
    }

    res.bibles = bibles
    next()
}

async function getBible(req, res, next) {
    let bible
    try {
        bible = await Bible.findOne({ abbreviation: req.params.abbreviation }, res.projection)
    } 
    catch(err) {
        return res.status(500).json({ message: err.message })
    }

    if(bible == null){
        return res.status(404).json({ message: 'Cannot find bible!' })
    }
    res.bible = bible
    next()
}

function getBook(req, res, next) {
    let book

    res.bible.books.forEach((item, index, arr) => {
        if(item.abbreviation == req.params.bookAbbreviation){
            book = item
            return
        }
    })

    if(book == null){
        return res.status(404).json({ message: 'Cannot find book!' })
    }
    res.book = book
    next()
}

function getChapter(req, res, next) {
    let chapter = res.book.chapters[req.params.chapter - 1]

    if(chapter == null){
        return res.status(404).json({ message: 'Cannot find chapter!' })
    }
    res.chapter = chapter
    next()
}

function getVerse(req, res, next) {
    let verse = res.chapter.verses[req.params.verse - 1]

    if(verse == null){
        return res.status(404).json({ message: 'Cannot find verse!' })
    }
    res.verse = verse
    next()
}

function getVerses(req, res, next) {
    if(req.params.toVerse > res.chapter.verses.length || req.params.fromVerse < 1){
        return res.status(404).json({ message: 'Cannot find verses!' })
    }

    let verses = res.chapter.verses.slice(req.params.fromVerse - 1, req.params.toVerse)
    res.verses = verses
    next()
}

module.exports = router
