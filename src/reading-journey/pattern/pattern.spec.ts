import { expect, test } from '@jest/globals'
import { Pattern } from './pattern'

test('Every placeholder must be used', () => {
    const definition = { firstName: '.+', lastName: '.+' }
    const pattern = '{firstName}'

    expect(() => new Pattern(definition, pattern)).toThrow('Pattern must include {lastName} placeholder')
})

test('Placeholder must only be used once', () => {
    const definition = { name: '.+' }
    const pattern = '{name}{name}'

    expect(() => new Pattern(definition, pattern)).toThrow('Placeholder {name} must be used only once')
})

test('Wildcard placeholder may be used multiple times', () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{*} {firstName} {*} {lastName} {*}'

    const subject = new Pattern(definition, pattern)

    expect(subject.matches('Sir Peter John Johnson aka Johnny')).toEqual({ firstName: 'Peter', lastName: 'Johnson' })
})

test('Matches should be returned', () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{firstName} {lastName}'

    const subject = new Pattern(definition, pattern)

    expect(subject.matches('Peter Johnson')).toEqual({ firstName: 'Peter', lastName: 'Johnson' })
})

test("Result should be null if given string doesn't match", () => {
    const definition = { firstName: '[^ ]+', lastName: '[^ ]+' }
    const pattern = '{firstName} {lastName}'

    const subject = new Pattern(definition, pattern)

    expect(subject.matches('Madonna')).toBeNull()
})
