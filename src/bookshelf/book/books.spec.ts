import { expect, test } from 'vitest'
import { Books } from './books'
import { BookBuilder } from '../../support/book-builder'
import { Match } from './search/expressions/match'
import { Contains } from './search/conditions/contains'

test.each([
    [new Match(new Contains('hunger')), ['The Hunger Games']],
    [new Match(new Contains('games')), ['The Hunger Games', 'Vintage Games']],
])('books.match(%o) => %o', (expr, expected) => {
    const books = new Books([
        new BookBuilder().with('title', 'The Hunger Games').build(),
        new BookBuilder().with('title', 'Vintage Games').build(),
        new BookBuilder().with('title', 'Dracula').build(),
    ])

    const result = books.matching(expr)

    expect(result.map((b) => b.metadata.title)).toEqual(expected)
})
