import { describe, expect, test } from 'vitest'
import { LessThan } from './less-than'

describe('LessThan', () => {
    test.each([
        ['0', '0', false],
        ['0', '0.1', true],
        ['aa', 'aa', false],
        ['ab', 'aa', false],
        ['aa', 'ab', true],
        ['AA', 'ab', true],
    ])(`%s > %s => %s`, (a, b, expected) => {
        expect(new LessThan(b).matches(a)).toBe(expected)
    })
})
