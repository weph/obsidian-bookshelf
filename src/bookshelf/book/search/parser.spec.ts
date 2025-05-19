import { describe, expect, test } from 'vitest'
import { parser } from './parser'
import { Match } from './expressions/match'
import { And } from './expressions/and'
import { MatchField } from './expressions/match-field'
import { MatchAll } from './expressions/match-all'
import { Contains } from './conditions/contains'
import { Equals } from './conditions/equals'

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
        expect(parsedExpression('foo')).toEqual(new Match(new Contains('foo')))
    })

    test('Quoted string', () => {
        expect(parsedExpression('"foo bar"')).toEqual(new Match(new Contains('foo bar')))
    })

    test('Multiple terms', () => {
        expect(parsedExpression('foo bar')).toEqual(
            new And([new Match(new Contains('foo')), new Match(new Contains('bar'))]),
        )
    })

    test('Multiple terms with different white spaces', () => {
        const input = 'a  b\tc\nd  \t\t\n\ne'
        const expected = new And([
            new Match(new Contains('a')),
            new Match(new Contains('b')),
            new Match(new Contains('c')),
            new Match(new Contains('d')),
            new Match(new Contains('e')),
        ])

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Incomplete quoted string', () => {
        expect(parsedExpression('"foo')).toEqual(new Match(new Contains('foo')))
    })

    test('Garbage', () => {
        expect(parsedExpression('qwerty"12!@#:asdf:')).toEqual(new Match(new Contains('qwerty"12!@#:asdf:')))
    })
})

describe('Field filter', () => {
    test('Single field filter', () => {
        expect(parsedExpression('author:"Joe Schmoe"')).toEqual(new MatchField('author', new Equals('Joe Schmoe')))
    })

    test('Containing escaped quotes', () => {
        const input = 'author:"Joe \\"J \\\\"X \\\\\\"Y\\\\\\" \\\\" S\\" Schmoe"'
        const expected = new MatchField('author', new Equals('Joe "J \\"X \\\\"Y\\\\" \\" S" Schmoe'))

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Multiple field filter', () => {
        const input = 'author:"Joe Schmoe" list:"Classics"'
        const expected = new And([
            new MatchField('author', new Equals('Joe Schmoe')),
            new MatchField('list', new Equals('Classics')),
        ])

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('No filter value', () => {
        const input = 'author:'
        const expected = new Match(new Contains('author:'))

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (just quotation mark)', () => {
        const input = 'author:"'
        const expected = new Match(new Contains('author:"'))

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (extra quotation mark)', () => {
        const input = 'author:"Name""'
        const expected = new Match(new Contains('author:"Name""'))

        expect(parsedExpression(input)).toEqual(expected)
    })

    test('Invalid filter value (colon at the end)', () => {
        const input = 'author:foo:'
        const expected = new Match(new Contains('author:foo:'))

        expect(parsedExpression(input)).toEqual(expected)
    })
})

test('Combination of terms and field filters', () => {
    const input = 'Foo author:"Joe Schmoe" list:"Classics" Bar'
    const expected = new And([
        new Match(new Contains('Foo')),
        new MatchField('author', new Equals('Joe Schmoe')),
        new MatchField('list', new Equals('Classics')),
        new Match(new Contains('Bar')),
    ])

    expect(parsedExpression(input)).toEqual(expected)
})

test('Terms, filters, and garbage', () => {
    const input = 'Foo author:"Joe Schmoe" foo":bar:xoasdaskdasd'
    const expected = new And([
        new Match(new Contains('Foo')),
        new MatchField('author', new Equals('Joe Schmoe')),
        new Match(new Contains('foo":bar:xoasdaskdasd')),
    ])

    expect(parsedExpression(input)).toEqual(expected)
})
