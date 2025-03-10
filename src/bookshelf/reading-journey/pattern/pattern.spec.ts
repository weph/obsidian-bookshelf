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

test('Wildcard placeholder may be used multiple times', () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{*} {firstName} {*} {lastName} {*}'

    const matcher = patternMatcher(definition, pattern)

    expect(matcher('Sir Peter John Johnson aka Johnny')).toEqual({ firstName: 'Peter', lastName: 'Johnson' })
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
