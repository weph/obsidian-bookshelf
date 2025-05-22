import { describe, expect, test } from 'vitest'
import { Contains } from './contains'

describe('Contains', () => {
    test('should match partial string ignoring case', () => {
        expect(new Contains('Foo').matches('barfOobar')).toBe(true)
    })

    test('should match empty string with null value', () => {
        expect(new Contains('').matches(null)).toBe(true)
    })

    test('must not match string with null value', () => {
        expect(new Contains('stryker').matches(null)).toBe(false)
    })
})
