import { describe, expect, test } from 'vitest'
import { parser } from './parser'
import { Match } from './expressions/match'
import { And } from './expressions/and'
import { MatchField } from './expressions/match-field'
import { MatchAll } from './expressions/match-all'
import { Contains } from './conditions/contains'

const parsedExpression = (input: string) => parser()(input)

describe('Empty input should return match all expression', () => {
    test('Empty input', () => {
        expect(parsedExpression('')).toStrictEqual(new MatchAll())
    })

    test('Empty input', () => {
        expect(parsedExpression('    ')).toStrictEqual(new MatchAll())
    })

    test('White spaces', () => {
        expect(parsedExpression('\n \t')).toStrictEqual(new MatchAll())
    })
})

describe('Term', () => {
    test('Single term', () => {
        expect(parsedExpression('foo')).toStrictEqual(new Match(new Contains('foo')))
    })

    test('Quoted string', () => {
        expect(parsedExpression('"foo bar"')).toStrictEqual(new Match(new Contains('foo bar')))
    })

    test('Multiple terms', () => {
        expect(parsedExpression('foo bar')).toStrictEqual(
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

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('Incomplete quoted string', () => {
        expect(parsedExpression('"foo')).toStrictEqual(new Match(new Contains('foo')))
    })

    test('Garbage', () => {
        expect(parsedExpression('qwerty"12!@#:asdf:')).toStrictEqual(new Match(new Contains('qwerty"12!@#:asdf:')))
    })
})

describe('Field filter', () => {
    test('Single term', () => {
        expect(parsedExpression('author:Joe')).toStrictEqual(new MatchField('author', new Contains('Joe')))
    })

    test('Quoted string', () => {
        expect(parsedExpression('author:"Joe Schmoe"')).toStrictEqual(
            new MatchField('author', new Contains('Joe Schmoe')),
        )
    })

    test('Containing escaped quotes', () => {
        const input = 'author:"Joe \\"J \\\\"X \\\\\\"Y\\\\\\" \\\\" S\\" Schmoe"'
        const expected = new MatchField('author', new Contains('Joe "J \\"X \\\\"Y\\\\" \\" S" Schmoe'))

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('Multiple field filter', () => {
        const input = 'author:"Joe Schmoe" list:"Classics"'
        const expected = new And([
            new MatchField('author', new Contains('Joe Schmoe')),
            new MatchField('list', new Contains('Classics')),
        ])

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('No filter value', () => {
        const input = 'author:'
        const expected = new MatchField('author', new Contains(''))

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('Invalid filter value (just quotation mark)', () => {
        const input = 'author:"'
        const expected = new MatchField('author', new Contains(''))

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('Invalid filter value (extra quotation mark)', () => {
        const input = 'author:"Name""'
        const expected = new MatchField('author', new Contains('Name""'))

        expect(parsedExpression(input)).toStrictEqual(expected)
    })

    test('Invalid filter value (colon at the end)', () => {
        const input = 'author:foo:'
        const expected = new MatchField('author', new Contains('foo:'))

        expect(parsedExpression(input)).toStrictEqual(expected)
    })
})

test('Combination of terms and field filters', () => {
    const input = 'Foo author:"Joe Schmoe" list:"Classics" Bar'
    const expected = new And([
        new Match(new Contains('Foo')),
        new MatchField('author', new Contains('Joe Schmoe')),
        new MatchField('list', new Contains('Classics')),
        new Match(new Contains('Bar')),
    ])

    expect(parsedExpression(input)).toStrictEqual(expected)
})

test('Terms, filters, and garbage', () => {
    const input = 'Foo author:"Joe Schmoe" foo":bar:xoasdaskdasd'
    const expected = new And([
        new Match(new Contains('Foo')),
        new MatchField('author', new Contains('Joe Schmoe')),
        new Match(new Contains('foo":bar:xoasdaskdasd')),
    ])

    expect(parsedExpression(input)).toStrictEqual(expected)
})
