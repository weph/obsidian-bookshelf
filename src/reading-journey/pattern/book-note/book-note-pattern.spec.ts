import { expect, test } from '@jest/globals'
import { bookNotePatterns } from './book-note-pattern'

const validPatterns = {
    started: '{date}: Started',
    abandoned: '{date}: Abandoned',
    finished: '{date}: Finished',
    absoluteProgress: '{date}: {startPage}-{endPage}',
    relativeProgress: '{date}: {endPage}',
}

test.each([
    // completely invalid
    ['invalid', null],
    ['2025-02-20: Invalid Action', null],
    // invalid date
    ['1234-56-78: Started', null],
    ['1234-56-78: Abandoned', null],
    ['1234-56-78: Finished', null],
    ['1234-56-78: 5-25', null],
    ['1234-56-78: 50', null],
    // valid
    ['2025-02-20: Started', { action: 'started', date: new Date(2025, 1, 20) }],
    ['2025-02-20: Abandoned', { action: 'abandoned', date: new Date(2025, 1, 20) }],
    ['2025-02-20: Finished', { action: 'finished', date: new Date(2025, 1, 20) }],
    ['2025-02-20: 5-25', { action: 'absolute-progress', date: new Date(2025, 1, 20), startPage: 5, endPage: 25 }],
    ['2025-02-20: 50', { action: 'relative-progress', date: new Date(2025, 1, 20), endPage: 50 }],
])('Input "%s" should return matches: %s', (input, expected) => {
    const result = bookNotePatterns(validPatterns, 'yyyy-MM-dd')

    expect(result.patterns.matches(input)).toEqual(expected)
})

test.each([
    [validPatterns, false],
    [{ ...validPatterns, started: 'Invalid' }, true],
    [{ ...validPatterns, abandoned: 'Invalid' }, true],
    [{ ...validPatterns, finished: 'Invalid' }, true],
    [{ ...validPatterns, absoluteProgress: 'Invalid' }, true],
    [{ ...validPatterns, relativeProgress: 'Invalid' }, true],
])('Patterns %s should have error state %s', (patterns, expected) => {
    const result = bookNotePatterns(patterns, 'yyyy-MM-dd')

    expect(result.hasErrors).toBe(expected)
})
