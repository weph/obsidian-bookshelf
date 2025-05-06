import { describe, expect, test } from 'vitest'
import { ReadingProgress } from './reading-progress'
import { position } from './position/position'
import { BookBuilder } from '../../support/book-builder'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../note/metadata'

const book = new BookBuilder().build()
const source = new FakeNote('', new StaticMetadata({}), [])

describe('Start page', () => {
    test('given value should be used', () => {
        const subject = new ReadingProgress(new Date(), book, null, position(5), position(10), source)

        expect(subject.startPage).toBe(5)
    })
})

describe('No start page', () => {
    test('start page should be 1 if there is no previous reading progress', () => {
        const subject = new ReadingProgress(new Date(), book, null, null, position(10), source)

        expect(subject.startPage).toBe(1)
    })

    test('start page should be end page of the previous reading progress + 1', () => {
        const previous = new ReadingProgress(new Date(), book, null, position(1), position(10), source)
        const subject = new ReadingProgress(new Date(), book, previous, null, position(10), source)

        expect(subject.startPage).toBe(11)
    })

    test('start page should be 1 if previous reading progress is from a different book part', () => {
        const previous = new ReadingProgress(new Date(), book, null, position('x'), position('xx'), source)
        const subject = new ReadingProgress(new Date(), book, previous, null, position(10), source)

        expect(subject.startPage).toBe(1)
    })
})

describe('Pages (difference between end and start page + 1)', () => {
    describe('page numbers', () => {
        test('start and end', () => {
            const subject = new ReadingProgress(new Date(), book, null, position(5), position(12), source)

            expect(subject.pages).toBe(8)
        })

        test('no start, no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, position(10), source)

            expect(subject.pages).toBe(10)
        })

        test('no start, but previous reading progress', () => {
            const previous = new ReadingProgress(new Date(), book, null, position(1), position(10), source)
            const subject = new ReadingProgress(new Date(), book, previous, null, position(25), source)

            expect(subject.pages).toBe(15)
        })
    })

    describe('percentages', () => {
        describe('total pages unknown', () => {
            test('start and end', () => {
                const subject = new ReadingProgress(new Date(), book, null, position('5%'), position('12%'), source)

                expect(subject.pages).toBe(null)
            })

            test('no start, no previous reading progress', () => {
                const subject = new ReadingProgress(new Date(), book, null, null, position('12%'), source)

                expect(subject.pages).toBe(null)
            })

            test('no start, but previous reading progress', () => {
                const previous = new ReadingProgress(new Date(), book, null, position('1%'), position('10%'), source)
                const subject = new ReadingProgress(new Date(), book, previous, null, position('25%'), source)

                expect(subject.pages).toBe(null)
            })
        })

        describe('total pages known', () => {
            const book = new BookBuilder().with('pages', 200).build()

            test('start and end, total pages known', () => {
                const subject = new ReadingProgress(new Date(), book, null, position('5%'), position('12%'), source)

                expect(subject.pages).toBe(15)
            })

            test('no start, no previous reading progress', () => {
                const subject = new ReadingProgress(new Date(), book, null, null, position('12%'), source)

                expect(subject.pages).toBe(24)
            })

            test('no start, but previous reading progress', () => {
                const previous = new ReadingProgress(new Date(), book, null, position('1%'), position('10%'), source)
                const subject = new ReadingProgress(new Date(), book, previous, null, position('25%'), source)

                expect(subject.pages).toBe(29)
            })
        })
    })
})
