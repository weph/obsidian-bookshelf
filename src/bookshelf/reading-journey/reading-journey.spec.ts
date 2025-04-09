import { describe, expect, test } from 'vitest'
import { ReadingJourney } from './reading-journey'
import { BookBuilder } from '../../support/book-builder'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../note/metadata'
import { ReadingJourneyItem } from './reading-journey-log'

const source = new FakeNote('', new StaticMetadata({}), [])

test('map', () => {
    const book = new BookBuilder().build()
    const date = new Date(2025, 1, 1)
    const journey = new ReadingJourney([
        { action: 'started', date, book, source },
        { action: 'finished', date, book, source },
    ])

    const result = journey.map((i) => i.action)

    expect(result).toEqual(['started', 'finished'])
})

test('filter', () => {
    const date = new Date(2025, 1, 1)
    const journey = new ReadingJourney([
        { action: 'started', date, book: new BookBuilder().with('title', 'Dracula').build(), source },
        { action: 'finished', date, book: new BookBuilder().with('title', 'The Shining').build(), source },
        { action: 'started', date, book: new BookBuilder().with('title', 'Frankenstein').build(), source },
        { action: 'finished', date, book: new BookBuilder().with('title', 'Frankenstein').build(), source },
    ])

    const result = journey.filter((i) => i.action === 'started')

    expect(result.items().map((i) => `${i.action}: ${i.book.metadata.title}`)).toEqual([
        'started: Dracula',
        'started: Frankenstein',
    ])
})

describe('empty', () => {
    test('empty journey => true', () => {
        expect(new ReadingJourney([]).empty()).toBeTruthy()
    })

    test('non-empty journey => false', () => {
        const date = new Date(2025, 1, 1)
        const book = new BookBuilder().with('title', 'Dracula').build()
        const journey = new ReadingJourney([{ action: 'started', date, book, source }])

        expect(journey.empty()).toBeFalsy()
    })
})

describe('lastItem', () => {
    test('should return null if journey is empty', () => {
        const journey = new ReadingJourney([])

        expect(journey.lastItem()).toBeNull()
    })

    test('should return last item', () => {
        const date = new Date(2025, 1, 1)
        const book = new BookBuilder().with('title', 'Dracula').build()
        const item1: ReadingJourneyItem = { action: 'started', date, book, source }
        const item2: ReadingJourneyItem = { action: 'finished', date, book, source }
        const item3: ReadingJourneyItem = { action: 'started', date, book, source }
        const journey = new ReadingJourney([item1, item2, item3])

        expect(journey.lastItem()).toBe(item3)
    })
})

describe('Tag Usage', () => {
    test('should be empty if no tags have been used', () => {
        const date = new Date(2025, 1, 1)
        const thriller = new BookBuilder().with('tags', undefined).build()
        const horror = new BookBuilder().with('tags', undefined).build()
        const nonFiction = new BookBuilder().with('tags', undefined).build()
        const journey = new ReadingJourney([
            { action: 'started', date, book: thriller, source },
            { action: 'finished', date, book: thriller, source },
            { action: 'started', date, book: horror, source },
            { action: 'finished', date, book: horror, source },
            { action: 'started', date, book: nonFiction, source },
        ])

        const result = journey.tagUsage()

        expect(Object.fromEntries(result.entries())).toEqual({})
    })

    test('tags should be counted only per book', () => {
        const date = new Date(2025, 1, 1)
        const thriller = new BookBuilder().with('tags', ['fiction', 'thriller']).build()
        const journey = new ReadingJourney([
            { action: 'started', date, book: thriller, source },
            { action: 'finished', date, book: thriller, source },
        ])

        const result = journey.tagUsage()

        expect(Object.fromEntries(result.entries())).toEqual({
            fiction: 1,
            thriller: 1,
        })
    })

    test('tags should be counted across different books', () => {
        const date = new Date(2025, 1, 1)
        const thriller = new BookBuilder().with('tags', ['fiction', 'thriller']).build()
        const horror = new BookBuilder().with('tags', ['fiction', 'horror']).build()
        const nonFiction = new BookBuilder().with('tags', ['nonfiction']).build()
        const journey = new ReadingJourney([
            { action: 'started', date, book: thriller, source },
            { action: 'finished', date, book: thriller, source },
            { action: 'started', date, book: horror, source },
            { action: 'finished', date, book: horror, source },
            { action: 'started', date, book: nonFiction, source },
        ])

        const result = journey.tagUsage()

        expect(Object.fromEntries(result.entries())).toEqual({
            fiction: 2,
            thriller: 1,
            horror: 1,
            nonfiction: 1,
        })
    })
})
