import { describe, expect, test } from 'vitest'
import { LessEqual } from './less-equal'

describe('LessEqual', () => {
    test.each([
        ['0', '0', true],
        ['0', '0.1', true],
        ['aa', 'aa', true],
        ['ab', 'aa', false],
        ['aa', 'ab', true],
        ['AA', 'ab', true],
    ])(`%s > %s => %s`, (a, b, expected) => {
        expect(new LessEqual(b).matches(a)).toBe(expected)
    })
})
