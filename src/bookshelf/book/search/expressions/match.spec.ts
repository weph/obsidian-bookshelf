import { expect, test } from 'vitest'
import { BookBuilder } from '../../../../support/book-builder'
import { Link } from '../../link'
import { Match } from './match'
import { Contains } from '../conditions/contains'

const book = new BookBuilder()
    .with('title', 'A Book Title')
    .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
    .with('series', { name: 'The Ultimate Series' })
    .with('lists', ['List A', 'List B'])
    .with('rating', 3.5)
    .with('published', new Date(2025, 5, 15))
    .build()

test.each([
    ['It should match exact title', new Match(new Contains('A Book Title')), true],
    ['It should match partial title', new Match(new Contains('book')), true],
    ['It should match exact author', new Match(new Contains('Joe Schmoe')), true],
    ['It should match exact author (link)', new Match(new Contains('J. Doe')), true],
    ['It should match partial author', new Match(new Contains('joe')), true],
    ['It should match partial author (link)', new Match(new Contains('doe')), true],
    ['It should match exact series', new Match(new Contains('The Ultimate Series')), true],
    ['It should match exact series', new Match(new Contains('ultimate')), true],
])('%s', (_, expression, expected) => {
    expect(expression.matches(book)).toBe(expected)
})
