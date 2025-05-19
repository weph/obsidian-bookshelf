import { describe, expect, test } from 'vitest'
import { ExpressionFactory } from './expression-factory'
import { parser } from './parser'
import { MatchAll } from './expressions/match-all'
import { Match } from './expressions/match'
import { MatchField } from './expressions/match-field'
import { And } from './expressions/and'
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
        const expected = new Match('foo')

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Search with filters', () => {
        const query: Query = { search: 'foo author:"Jane Doe" series:"Bar"', list: null, status: null }
        const expected = new And([
            new Match('foo'),
            new MatchField('author', 'Jane Doe'),
            new MatchField('series', 'Bar'),
        ])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Just list', () => {
        const query: Query = { search: '', list: 'foo', status: null }
        const expected = new And([new MatchAll(), new MatchField('list', 'foo')])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('Just status', () => {
        const query: Query = { search: '', list: null, status: 'finished' }
        const expected = new And([new MatchAll(), new MatchField('status', 'finished')])

        expect(factory.fromQuery(query)).toEqual(expected)
    })

    test('All values', () => {
        const query: Query = { search: 'foo', list: 'bar', status: 'finished' }
        const expected = new And([
            new Match('foo'),
            new MatchField('list', 'bar'),
            new MatchField('status', 'finished'),
        ])

        expect(factory.fromQuery(query)).toEqual(expected)
    })
})
