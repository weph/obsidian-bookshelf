import { expect, test } from '@jest/globals'
import { dailyNotePatterns } from './daily-note-pattern'

const validPatterns = {
    started: '{book}: Started',
    abandoned: '{book}: Abandoned',
    finished: '{book}: Finished',
    absoluteProgress: '{book}: {startPage}-{endPage}',
    relativeProgress: '{book}: {endPage}',
}

test.each([
    ['invalid', null],
    ['[[Dracula]]: Invalid Action', null],
    ['[[Dracula]]: Started', { action: 'started', book: '[[Dracula]]' }],
    ['[[Dracula]]: Abandoned', { action: 'abandoned', book: '[[Dracula]]' }],
    ['[[Dracula]]: Finished', { action: 'finished', book: '[[Dracula]]' }],
    ['[[Dracula]]: 5-25', { action: 'absolute-progress', book: '[[Dracula]]', startPage: 5, endPage: 25 }],
    ['[[Dracula]]: 50', { action: 'relative-progress', book: '[[Dracula]]', endPage: 50 }],
])('Input "%s" should return matches: %s', (input, expected) => {
    const result = dailyNotePatterns(validPatterns)

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
    const result = dailyNotePatterns(patterns)

    expect(result.hasErrors).toBe(expected)
})
