import { expect, test } from '@jest/globals'
import { ReadingJourney } from './reading-journey'
import { BookBuilder } from '../support/book-builder'

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
