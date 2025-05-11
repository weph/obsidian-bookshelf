import { expect, test } from 'vitest'
import { FieldFilter } from './field-filter'
import { BookBuilder } from '../../../support/book-builder'
import { Link } from '../link'

const book = new BookBuilder()
    .with('title', 'A Book Title')
    .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
    .with('lists', ['List A', 'List B'])
    .with('rating', 3.5)
    .with('published', new Date(2025, 5, 15))
    .build()

test.each([
    ['It should match exact title', new FieldFilter('title', 'A Book Title'), true],
    ['It must not match partial title', new FieldFilter('title', 'Book'), false],
    ['It should match exact author', new FieldFilter('authors', 'Joe Schmoe'), true],
    ['It should match exact author (link)', new FieldFilter('authors', 'J. Doe'), true],
    ['It must not match partial author', new FieldFilter('authors', 'Joe'), false],
    ['It must not match partial author (link)', new FieldFilter('authors', 'Doe'), false],
    ['It should match exact rating', new FieldFilter('rating', '3.5'), true],
    ['It must not match partial rating', new FieldFilter('rating', '3'), false],
    ['It must not mach inexact rating', new FieldFilter('rating', '3.51'), false],
])('%s', (_, expression, expected) => {
    expect(expression.matches(book)).toBe(expected)
})
