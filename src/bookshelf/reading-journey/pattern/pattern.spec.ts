import { expect, test } from '@jest/globals'
import { patternMatcher } from './pattern'

test('Every placeholder must be used', () => {
    const definition = { firstName: '.+', lastName: '.+' }
    const pattern = '{firstName}'

    expect(() => patternMatcher(definition, pattern)).toThrow('Pattern must include {lastName} placeholder')
})

test('Placeholder must only be used once', () => {
    const definition = { name: '.+' }
    const pattern = '{name}{name}'

    expect(() => patternMatcher(definition, pattern)).toThrow('Placeholder {name} must be used only once')
})

test('Matches should be returned', () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{firstName} {lastName}'

    const matcher = patternMatcher(definition, pattern)

    expect(matcher('Peter Johnson')).toEqual({ firstName: 'Peter', lastName: 'Johnson' })
})

test("Result should be null if given string doesn't match", () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{firstName} {lastName}'

    const matcher = patternMatcher(definition, pattern)

    expect(matcher('Madonna')).toBeNull()
})

test.each([
    ['(name) {name}', '(name) Peter', { name: 'Peter' }],
    ['name. {name}', 'name. Peter', { name: 'Peter' }],
    ['name. {name}', 'nameo Peter', null],
    ['^^ {name}', '^^ Peter', { name: 'Peter' }],
])('Regex tokens should be treated as literals: pattern "%s" and input "%s" => %s', (pattern, input, expected) => {
    const definition = { name: '.+' }

    const matcher = patternMatcher(definition, pattern)

    expect(matcher(input)).toEqual(expected)
})
