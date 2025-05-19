import { expect, test } from 'vitest'
import { BookBuilder } from '../../../../support/book-builder'
import { Link } from '../../link'
import { Match } from './match'

const book = new BookBuilder()
    .with('title', 'A Book Title')
    .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
    .with('series', { name: 'The Ultimate Series' })
    .with('lists', ['List A', 'List B'])
    .with('rating', 3.5)
    .with('published', new Date(2025, 5, 15))
    .build()

test.each([
    ['It should match exact title', new Match('A Book Title'), true],
    ['It should match partial title', new Match('book'), true],
    ['It should match exact author', new Match('Joe Schmoe'), true],
    ['It should match exact author (link)', new Match('J. Doe'), true],
    ['It should match partial author', new Match('joe'), true],
    ['It should match partial author (link)', new Match('doe'), true],
    ['It should match exact series', new Match('The Ultimate Series'), true],
    ['It should match exact series', new Match('ultimate'), true],
])('%s', (_, expression, expected) => {
    expect(expression.matches(book)).toBe(expected)
})
