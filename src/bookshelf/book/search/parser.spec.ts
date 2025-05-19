import { describe, expect, test } from 'vitest'
import { parser } from './parser'
import { Contains } from './expressions/contains'
import { And } from './expressions/and'
import { FieldFilter } from './expressions/field-filter'
import { MatchAll } from './expressions/match-all'

const parsedExpression = (input: string) => parser()(input)

describe('Empty input should return match all expression', () => {
    test('Empty input', () => {
        expect(parsedExpression('')).toEqual(new MatchAll())
    })

    test('Empty input', () => {
        expect(parsedExpression('    ')).toEqual(new MatchAll())
    })

    test('White spaces', () => {
        expect(parsedExpression('\n \t')).toEqual(new MatchAll())
    })
})

describe('Term', () => {
    test('Single term', () => {
        expect(parsedExpression('foo')).toEqual(new Contains('foo'))
    })

    test('Quoted string', () => {
        expect(parsedExpression('"foo bar"')).toEqual(new Contains('foo bar'))
    })

    test('Multiple terms', () => {
        expect(parsedExpression('foo bar')).toEqual(new And([new Contains('foo'), new Contains('bar')]))
    })

    test('Multiple terms with different white spaces', () => {
        const input = 'a  b\tc\nd  \t\t\n\ne'
        const expected = new And([
            new Contains('a'),
            new Contains('b'),
            new Contains('c'),
            new Contains('d'),
            new Contains('e'),
        ])

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Incomplete quoted string', () => {
        expect(parsedExpression('"foo')).toEqual(new Contains('foo'))
    })

    test('Garbage', () => {
        expect(parsedExpression('qwerty"12!@#:asdf:')).toEqual(new Contains('qwerty"12!@#:asdf:'))
    })
})

describe('Field filter', () => {
    test('Single field filter', () => {
        expect(parsedExpression('author:"Joe Schmoe"')).toEqual(new FieldFilter('author', 'Joe Schmoe'))
    })

    test('Containing escaped quotes', () => {
        const input = 'author:"Joe \\"J \\\\"X \\\\\\"Y\\\\\\" \\\\" S\\" Schmoe"'
        const expected = new FieldFilter('author', 'Joe "J \\"X \\\\"Y\\\\" \\" S" Schmoe')

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Multiple field filter', () => {
        const input = 'author:"Joe Schmoe" list:"Classics"'
        const expected = new And([new FieldFilter('author', 'Joe Schmoe'), new FieldFilter('list', 'Classics')])

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('No filter value', () => {
        const input = 'author:'
        const expected = new Contains('author:')

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (just quotation mark)', () => {
        const input = 'author:"'
        const expected = new Contains('author:"')

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (extra quotation mark)', () => {
        const input = 'author:"Name""'
        const expected = new Contains('author:"Name""')

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (colon at the end)', () => {
        const input = 'author:foo:'
        const expected = new Contains('author:foo:')

        expect(parsedExpression(input)).toEqual(expected)
    })
})

test('Combination of terms and field filters', () => {
    const input = 'Foo author:"Joe Schmoe" list:"Classics" Bar'
    const expected = new And([
        new Contains('Foo'),
        new FieldFilter('author', 'Joe Schmoe'),
        new FieldFilter('list', 'Classics'),
        new Contains('Bar'),
    ])

    expect(parsedExpression(input)).toEqual(expected)
})

test('Terms, filters, and garbage', () => {
    const input = 'Foo author:"Joe Schmoe" foo":bar:xoasdaskdasd'
    const expected = new And([
        new Contains('Foo'),
        new FieldFilter('author', 'Joe Schmoe'),
        new Contains('foo":bar:xoasdaskdasd'),
    ])

    expect(parsedExpression(input)).toEqual(expected)
})
