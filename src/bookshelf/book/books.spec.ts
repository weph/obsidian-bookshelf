import { expect, test } from 'vitest'
import { Books, Query } from './books'
import { BookBuilder } from '../../support/book-builder'

function query(values: Partial<Query>): Query {
    return { search: '', list: null, status: null, ...values }
}

test.each([
    [query({ search: 'mocking' }), ['Mockingjay']],
    [query({ search: 'games' }), ['Mockingjay', 'Vintage Games']],
    [query({ search: 'games', status: 'reading' }), ['Vintage Games']],
    [query({ search: '', list: 'YA' }), ['Mockingjay']],
])('books.match(%o) => %o', (query, expected) => {
    const books = new Books([
        new BookBuilder()
            .with('title', 'Mockingjay')
            .with('series', { name: 'Hunger Games' })
            .with('lists', ['YA'])
            .withStatus('finished')
            .build(),
        new BookBuilder().with('title', 'Vintage Games').with('lists', ['Non-Fiction']).withStatus('reading').build(),
    ])

    const result = books.matching(query)

    expect(result.map((b) => b.metadata.title)).toEqual(expected)
})
