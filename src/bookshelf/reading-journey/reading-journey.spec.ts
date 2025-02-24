import { describe, expect, test } from '@jest/globals'
import { ReadingJourney } from './reading-journey'
import { BookBuilder } from '../../support/book-builder'

test('map', () => {
    const book = new BookBuilder().build()
    const date = new Date(2025, 1, 1)
    const source = ''
    const journey = new ReadingJourney([
        { action: 'started', date, book, source },
        { action: 'finished', date, book, source },
    ])

    const result = journey.map((i) => i.action)

    expect(result).toEqual(['started', 'finished'])
})

test('filter', () => {
    const date = new Date(2025, 1, 1)
    const source = ''
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

describe('Tag Usage', () => {
    test('should be empty if no tags have been used', () => {
        const date = new Date(2025, 1, 1)
        const source = ''
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
        const source = ''
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
        const source = ''
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
