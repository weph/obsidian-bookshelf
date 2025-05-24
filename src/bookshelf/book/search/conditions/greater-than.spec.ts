import { describe, expect, test } from 'vitest'
import { GreaterThan } from './greater-than'

describe('GreaterThan', () => {
    test.each([
        ['0', '0', false],
        ['0.1', '0', true],
        ['aa', 'aa', false],
        ['aa', 'ab', false],
        ['ab', 'aa', true],
        ['ab', 'AA', true],
    ])(`%s > %s => %s`, (a, b, expected) => {
        expect(new GreaterThan(b).matches(a)).toBe(expected)
    })
})
