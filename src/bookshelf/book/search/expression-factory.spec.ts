import { describe, expect, test } from 'vitest'
import { ExpressionFactory } from './expression-factory'
import { parser } from './parser'
import { MatchAll } from './match-all'
import { Contains } from './contains'
import { FieldFilter } from './field-filter'
import { And } from './and'
import { Query } from '../books'

describe('fromQuery', () => {
    const factory = new ExpressionFactory(parser())

    test('Empty query', () => {
        const query: Query = { search: '', list: null, status: null }
        const expected = new MatchAll()

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Just search', () => {
        const query: Query = { search: 'foo', list: null, status: null }
        const expected = new Contains('foo')

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Search with filters', () => {
        const query: Query = { search: 'foo author:"Jane Doe" series:"Bar"', list: null, status: null }
        const expected = new And([
            new Contains('foo'),
            new FieldFilter('author', 'Jane Doe'),
            new FieldFilter('series', 'Bar'),
        ])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Just list', () => {
        const query: Query = { search: '', list: 'foo', status: null }
        const expected = new And([new MatchAll(), new FieldFilter('list', 'foo')])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Just status', () => {
        const query: Query = { search: '', list: null, status: 'finished' }
        const expected = new And([new MatchAll(), new FieldFilter('status', 'finished')])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('All values', () => {
        const query: Query = { search: 'foo', list: 'bar', status: 'finished' }
        const expected = new And([
            new Contains('foo'),
            new FieldFilter('list', 'bar'),
            new FieldFilter('status', 'finished'),
        ])

        expect(factory.fromQuery(query)).toEqual(expected)
    })
})
