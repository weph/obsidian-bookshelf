import { describe, expect, test } from 'vitest'
import { GreaterEqual } from './greater-equal'

describe('GreaterEqual', () => {
    test.each([
        ['0', '0', true],
        ['0.1', '0', true],
        ['aa', 'aa', true],
        ['aa', 'ab', false],
        ['ab', 'aa', true],
        ['ab', 'AA', true],
    ])(`%s > %s => %s`, (a, b, expected) => {
        expect(new GreaterEqual(b).matches(a)).toBe(expected)
    })
})
