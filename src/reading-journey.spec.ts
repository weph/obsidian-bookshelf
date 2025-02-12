import { describe, expect, test } from '@jest/globals'
import { AbsoluteReadingProgress, RelativeReadingProgress } from './reading-journey'
import { BookBuilder } from './support/book-builder'

const book = new BookBuilder().build()

describe('Absolute Reading Progress', () => {
    test('pages should include start and end page', () => {
        const subject = new AbsoluteReadingProgress(new Date(), book, null, 10, 20)

        expect(subject.pages).toBe(11)
    })
})

describe('Relative Reading Progress', () => {
    test('start page should be 1 if there is no previous reading progress', () => {
        const subject = new RelativeReadingProgress(new Date(), book, null, 10)

        expect(subject.startPage).toBe(1)
    })

    test('start page should be end page of the previous reading progress + 1', () => {
        const previous = new AbsoluteReadingProgress(new Date(), book, null, 1, 10)
        const subject = new RelativeReadingProgress(new Date(), book, previous, 10)

        expect(subject.startPage).toBe(11)
    })

    test('if there is no previous progress and the end page is 10, pages should be 10', () => {
        const subject = new RelativeReadingProgress(new Date(), book, null, 10)

        expect(subject.pages).toBe(10)
    })

    test('if the previous progress ended on page 10, and the end page is 26, pages should be 15', () => {
        const previous = new AbsoluteReadingProgress(new Date(), book, null, 1, 10)
        const subject = new RelativeReadingProgress(new Date(), book, previous, 25)

        expect(subject.pages).toBe(15)
    })
})
