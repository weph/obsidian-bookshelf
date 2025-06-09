import { beforeEach, describe, expect, test } from 'vitest'
import { ReadingJourneyItemInput, ReadingJourneyLog } from './reading-journey-log'
import { BookBuilder } from '../../support/book-builder'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../note/metadata'
import { Book } from '../book/book'
import { Note } from '../note/note'
import { DateTime } from 'luxon'
import { position } from './position/position'

const source = new FakeNote('', new StaticMetadata({}), [])

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

        expect(journey.map(String)).toEqual([
            '2025-02-01: The Shining: started',
            '2025-02-01: The Shining: 10-20 (11 pages)',
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10 (10 pages)',
            '2025-02-04: Dracula: abandoned',
            '2025-02-04: The Shining: 21-50 (30 pages)',
            '2025-02-04: The Shining: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20 (10 pages)',
            '2025-02-10: Dracula: 21-100 (80 pages)',
            '2025-02-10: Dracula: finished',
        ])
    })

    test('items on the same date should be returned in the order of addition', () => {
        log.add(progress('2025-01-01', dracula, null, 1, source))
        log.add(progress('2025-01-01', shining, null, 2, source))
        log.add(progress('2025-01-02', shining, null, 3, source))
        log.add(progress('2025-01-02', dracula, null, 4, source))

        const journey = log.readingJourney()

        expect(journey.map(String)).toEqual([
            '2025-01-01: Dracula: 1-1 (1 page)',
            '2025-01-01: The Shining: 1-2 (2 pages)',
            '2025-01-02: The Shining: 3-3 (1 page)',
            '2025-01-02: Dracula: 2-4 (3 pages)',
        ])
    })

    test('items should be connected properly even if added in arbitrary order', () => {
        log.add(progress('2025-01-01', dracula, null, 10, source))
        log.add(progress('2025-01-03', dracula, null, 30, source))
        log.add(progress('2025-01-02', dracula, null, 20, source))

        const journey = log.readingJourney()

        expect(journey.map(String)).toEqual([
            '2025-01-01: Dracula: 1-10 (10 pages)',
            '2025-01-02: Dracula: 11-20 (10 pages)',
            '2025-01-03: Dracula: 21-30 (10 pages)',
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

        expect(log.readingJourney().map(String)).toEqual([
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10 (10 pages)',
            '2025-02-04: Dracula: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20 (10 pages)',
            '2025-02-10: Dracula: 21-100 (80 pages)',
            '2025-02-10: Dracula: finished',
        ])
    })
})

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
