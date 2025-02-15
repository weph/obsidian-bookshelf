import { describe, expect, test } from '@jest/globals'
import { ReadingProgress } from './reading-journey-log'
import { BookBuilder } from '../support/book-builder'

const book = new BookBuilder().build()

describe('Reading Progress', () => {
    describe('Start page', () => {
        test('given value should be used', () => {
            const subject = new ReadingProgress(new Date(), book, null, 5, 10, '')

            expect(subject.startPage).toBe(5)
        })
    })

    describe('No start page', () => {
        test('start page should be 1 if there is no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, 10, '')

            expect(subject.startPage).toBe(1)
        })

        test('start page should be end page of the previous reading progress + 1', () => {
            const previous = new ReadingProgress(new Date(), book, null, 1, 10, '')
            const subject = new ReadingProgress(new Date(), book, previous, null, 10, '')

            expect(subject.startPage).toBe(11)
        })
    })

    describe('Pages (difference between end and start page + 1)', () => {
        test('start page', () => {
            const subject = new ReadingProgress(new Date(), book, null, 5, 12, '')

            expect(subject.pages).toBe(8)
        })

        test('no start page, no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, 10, '')

            expect(subject.pages).toBe(10)
        })

        test('no start page, but previous reading progress', () => {
            const previous = new ReadingProgress(new Date(), book, null, 1, 10, '')
            const subject = new ReadingProgress(new Date(), book, previous, null, 25, '')

            expect(subject.pages).toBe(15)
        })
    })
})
