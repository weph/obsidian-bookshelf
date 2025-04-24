import { expect, test } from 'vitest'
import { Version } from './version'

test.each([['foo'], ['1'], ['1.2'], ['1,2,3']])('Version %s must not be accepted', (version) => {
    expect(() => Version.fromString(version)).toThrow(`Invalid version "${version}"`)
})

test.each([['1.2.3', new Version(1, 2, 3)]])('Input %s should be %s', (input, expected) => {
    expect(Version.fromString(input)).toEqual(expected)
})

test.each([
    ['0.0.1', '0.0.1', false],
    ['0.0.2', '0.0.3', false],
    ['0.0.3', '0.0.2', true],
    ['0.1.0', '0.0.1', true],
    ['0.1.0', '0.1.0', false],
    ['0.1.1', '0.1.0', true],
    ['1.0.0', '1.0.0', false],
    ['1.0.0', '0.99.99', true],
    ['2.0.0', '1.0.0', true],
    ['2.0.0', '1.0.1', true],
    ['2.0.0', '1.1.1', true],
])('%s > %s => %s', (version1, version2, expected) => {
    expect(Version.fromString(version1).greaterThan(Version.fromString(version2))).toEqual(expected)
})

test('asString', () => {
    expect(new Version(2, 5, 12).asString()).toBe('2.5.12')
})
