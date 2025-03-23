import { beforeEach, describe, expect, test } from '@jest/globals'
import { ReadingJourneyItem, ReadingJourneyLog, ReadingProgress } from './reading-journey-log'
import { BookBuilder } from '../../support/book-builder'

const book = new BookBuilder().build()
const source = ''

describe('Reading Progress', () => {
    describe('Start page', () => {
        test('given value should be used', () => {
            const subject = new ReadingProgress(new Date(), book, null, 5, 10, source)

            expect(subject.startPage).toBe(5)
        })
    })

    describe('No start page', () => {
        test('start page should be 1 if there is no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, 10, source)

            expect(subject.startPage).toBe(1)
        })

        test('start page should be end page of the previous reading progress + 1', () => {
            const previous = new ReadingProgress(new Date(), book, null, 1, 10, source)
            const subject = new ReadingProgress(new Date(), book, previous, null, 10, source)

            expect(subject.startPage).toBe(11)
        })
    })

    describe('Pages (difference between end and start page + 1)', () => {
        test('start page', () => {
            const subject = new ReadingProgress(new Date(), book, null, 5, 12, source)

            expect(subject.pages).toBe(8)
        })

        test('no start page, no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, 10, source)

            expect(subject.pages).toBe(10)
        })

        test('no start page, but previous reading progress', () => {
            const previous = new ReadingProgress(new Date(), book, null, 1, 10, source)
            const subject = new ReadingProgress(new Date(), book, previous, null, 25, source)

            expect(subject.pages).toBe(15)
        })
    })
})

describe('Reading journey', () => {
    let log: ReadingJourneyLog
    const dracula = new BookBuilder().with('title', 'Dracula').build()
    const shining = new BookBuilder().with('title', 'The Shining').build()

    beforeEach(() => {
        log = new ReadingJourneyLog()
    })

    test('should be ordered by date', () => {
        log.addActionToJourney(date(2025, 2, 3), dracula, 'started', source)
        log.addReadingProgress(date(2025, 2, 3), dracula, 1, 10, source)
        log.addActionToJourney(date(2025, 2, 4), dracula, 'abandoned', source)
        log.addActionToJourney(date(2025, 2, 5), dracula, 'started', source)
        log.addReadingProgress(date(2025, 2, 4), shining, null, 50, source)
        log.addActionToJourney(date(2025, 2, 4), shining, 'abandoned', source)
        log.addReadingProgress(date(2025, 2, 5), dracula, null, 20, source)
        log.addReadingProgress(date(2025, 2, 10), dracula, null, 100, source)
        log.addActionToJourney(date(2025, 2, 10), dracula, 'finished', source)
        log.addActionToJourney(date(2025, 2, 1), shining, 'started', source)
        log.addReadingProgress(date(2025, 2, 1), shining, 10, 20, source)

        const journey = log.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-02-01: The Shining: started',
            '2025-02-01: The Shining: 10-20',
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10',
            '2025-02-04: Dracula: abandoned',
            '2025-02-04: The Shining: 21-50',
            '2025-02-04: The Shining: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20',
            '2025-02-10: Dracula: 21-100',
            '2025-02-10: Dracula: finished',
        ])
    })

    test('items on the same date should be returned in the order of addition', () => {
        log.addReadingProgress(date(2025, 1, 1), dracula, null, 1, source)
        log.addReadingProgress(date(2025, 1, 1), shining, null, 2, source)
        log.addReadingProgress(date(2025, 1, 2), shining, null, 3, source)
        log.addReadingProgress(date(2025, 1, 2), dracula, null, 4, source)

        const journey = log.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-1',
            '2025-01-01: The Shining: 1-2',
            '2025-01-02: The Shining: 3-3',
            '2025-01-02: Dracula: 2-4',
        ])
    })

    test('items should be connected properly even if added in arbitrary order', () => {
        log.addReadingProgress(date(2025, 1, 1), dracula, null, 10, source)
        log.addReadingProgress(date(2025, 1, 3), dracula, null, 30, source)
        log.addReadingProgress(date(2025, 1, 2), dracula, null, 20, source)

        const journey = log.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-10',
            '2025-01-02: Dracula: 11-20',
            '2025-01-03: Dracula: 21-30',
        ])
    })

    test('can be removed by source', () => {
        log.addActionToJourney(date(2025, 2, 3), dracula, 'started', '2025-02-03.md')
        log.addReadingProgress(date(2025, 2, 3), dracula, 1, 10, '2025-02-03.md')
        log.addActionToJourney(date(2025, 2, 4), dracula, 'abandoned', '2025-02-04.md')
        log.addActionToJourney(date(2025, 2, 5), dracula, 'started', '2025-02-05.md')
        log.addReadingProgress(date(2025, 2, 4), shining, null, 50, 'the-shining.md')
        log.addActionToJourney(date(2025, 2, 4), shining, 'abandoned', 'the-shining.md')
        log.addReadingProgress(date(2025, 2, 5), dracula, null, 20, '2025-02-06.md')
        log.addReadingProgress(date(2025, 2, 10), dracula, null, 100, '2025-02-10.md')
        log.addActionToJourney(date(2025, 2, 10), dracula, 'finished', '2025-02-10.md')
        log.addActionToJourney(date(2025, 2, 1), shining, 'started', 'the-shining.md')
        log.addReadingProgress(date(2025, 2, 1), shining, 10, 20, 'the-shining.md')

        log.removeBySource('the-shining.md')

        expect(log.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10',
            '2025-02-04: Dracula: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20',
            '2025-02-10: Dracula: 21-100',
            '2025-02-10: Dracula: finished',
        ])
    })
})

function readingProgressAsString(value: ReadingJourneyItem): string {
    if (value.action !== 'progress') {
        return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.action}`
    }

    return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.startPage}-${value.endPage}`
}

function date(year: number, month: number, day: number): Date {
    return new Date(year, month - 1, day, 0, 0, 0, 0)
}
