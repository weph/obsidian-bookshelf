import { beforeEach, describe, expect, test } from 'vitest'
import { ReadingJourneyItem, ReadingJourneyItemInput, ReadingJourneyLog, ReadingProgress } from './reading-journey-log'
import { BookBuilder } from '../../support/book-builder'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../metadata/metadata'
import { Book } from '../book'
import { Note } from '../note'
import { DateTime } from 'luxon'
import { position } from './position/position'

const book = new BookBuilder().build()
const source = new FakeNote('', new StaticMetadata({}), [])

describe('Reading Progress', () => {
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
    })

    describe('Pages (difference between end and start page + 1)', () => {
        test('start page', () => {
            const subject = new ReadingProgress(new Date(), book, null, position(5), position(12), source)

            expect(subject.pages).toBe(8)
        })

        test('no start page, no previous reading progress', () => {
            const subject = new ReadingProgress(new Date(), book, null, null, position(10), source)

            expect(subject.pages).toBe(10)
        })

        test('no start page, but previous reading progress', () => {
            const previous = new ReadingProgress(new Date(), book, null, position(1), position(10), source)
            const subject = new ReadingProgress(new Date(), book, previous, null, position(25), source)

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
        log.add(started('2025-02-03', dracula, source))
        log.add(progress('2025-02-03', dracula, 1, 10, source))
        log.add(abandoned('2025-02-04', dracula, source))
        log.add(started('2025-02-05', dracula, source))
        log.add(progress('2025-02-04', shining, null, 50, source))
        log.add(abandoned('2025-02-04', shining, source))
        log.add(progress('2025-02-05', dracula, null, 20, source))
        log.add(progress('2025-02-10', dracula, null, 100, source))
        log.add(finished('2025-02-10', dracula, source))
        log.add(started('2025-02-01', shining, source))
        log.add(progress('2025-02-01', shining, 10, 20, source))

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
        log.add(progress('2025-01-01', dracula, null, 1, source))
        log.add(progress('2025-01-01', shining, null, 2, source))
        log.add(progress('2025-01-02', shining, null, 3, source))
        log.add(progress('2025-01-02', dracula, null, 4, source))

        const journey = log.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-1',
            '2025-01-01: The Shining: 1-2',
            '2025-01-02: The Shining: 3-3',
            '2025-01-02: Dracula: 2-4',
        ])
    })

    test('items should be connected properly even if added in arbitrary order', () => {
        log.add(progress('2025-01-01', dracula, null, 10, source))
        log.add(progress('2025-01-03', dracula, null, 30, source))
        log.add(progress('2025-01-02', dracula, null, 20, source))

        const journey = log.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-10',
            '2025-01-02: Dracula: 11-20',
            '2025-01-03: Dracula: 21-30',
        ])
    })

    test('can be removed by source', () => {
        const dailyNote1 = new FakeNote('2025-02-03.md', new StaticMetadata({}), [])
        const dailyNote2 = new FakeNote('2025-02-04.md', new StaticMetadata({}), [])
        const dailyNote3 = new FakeNote('2025-02-05.md', new StaticMetadata({}), [])
        const shiningNote = new FakeNote('the-shining.md', new StaticMetadata({}), [])
        const dailyNote4 = new FakeNote('2025-02-06.md', new StaticMetadata({}), [])
        const dailyNote5 = new FakeNote('2025-02-10.md', new StaticMetadata({}), [])
        log.add(started('2025-02-03', dracula, dailyNote1))
        log.add(progress('2025-02-03', dracula, 1, 10, dailyNote1))
        log.add(abandoned('2025-02-04', dracula, dailyNote2))
        log.add(started('2025-02-05', dracula, dailyNote3))
        log.add(progress('2025-02-04', shining, null, 50, shiningNote))
        log.add(abandoned('2025-02-05', shining, shiningNote))
        log.add(progress('2025-02-05', dracula, null, 20, dailyNote4))
        log.add(progress('2025-02-10', dracula, null, 100, dailyNote5))
        log.add(finished('2025-02-10', dracula, dailyNote5))
        log.add(started('2025-02-01', shining, shiningNote))
        log.add(progress('2025-02-01', shining, 10, 20, shiningNote))

        log.removeBySource(shiningNote)

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

function started(date: string, book: Book, source: Note): ReadingJourneyItemInput {
    return action('started', date, book, source)
}

function finished(date: string, book: Book, source: Note): ReadingJourneyItemInput {
    return action('finished', date, book, source)
}

function abandoned(date: string, book: Book, source: Note): ReadingJourneyItemInput {
    return action('abandoned', date, book, source)
}

function action(
    action: 'started' | 'finished' | 'abandoned',
    date: string,
    book: Book,
    source: Note,
): ReadingJourneyItemInput {
    return { action, date: DateTime.fromISO(date).toJSDate(), book, source }
}

function progress(
    date: string,
    book: Book,
    startPage: number | null,
    endPage: number,
    source: Note,
): ReadingJourneyItemInput {
    return {
        action: 'progress',
        date: DateTime.fromISO(date).toJSDate(),
        book,
        start: startPage ? position(startPage) : null,
        end: position(endPage),
        source,
    }
}
