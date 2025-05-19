import { expect, test } from 'vitest'
import { MatchField } from './match-field'
import { BookBuilder } from '../../../../support/book-builder'
import { Link } from '../../link'
import { Equals } from '../conditions/equals'

const book = new BookBuilder()
    .with('title', 'A Book Title')
    .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
    .with('lists', ['List A', 'List B'])
    .with('rating', 3.5)
    .with('published', new Date(2025, 5, 15))
    .build()

test.each([
    ['It should match exact title', new MatchField('title', new Equals('A Book Title')), true],
    ['It must not match partial title', new MatchField('title', new Equals('Book')), false],
    ['It should match exact author', new MatchField('author', new Equals('Joe Schmoe')), true],
    ['It should match exact author (lowercase)', new MatchField('author', new Equals('joe schmoe')), true],
    ['It should match exact author (link)', new MatchField('author', new Equals('J. Doe')), true],
    ['It must not match partial author', new MatchField('author', new Equals('Joe')), false],
    ['It must not match partial author (link)', new MatchField('author', new Equals('Doe')), false],
    ['It should match exact rating', new MatchField('rating', new Equals('3.5')), true],
    ['It must not match partial rating', new MatchField('rating', new Equals('3')), false],
    ['It must not mach inexact rating', new MatchField('rating', new Equals('3.51')), false],
])('%s', (_, expression, expected) => {
    expect(expression.matches(book)).toBe(expected)
})
