import { expect, test } from 'vitest'
import { dailyNotePatterns } from './daily-note-pattern'

import { Page } from '../../position/page'
import { Percentage } from '../../position/percentage'

const validPatterns = {
    started: '{book}: Started',
    abandoned: '{book}: Abandoned',
    finished: '{book}: Finished',
    absoluteProgress: '{book}: {start}-{end}',
    relativeProgress: '{book}: {end}',
}

test.each([
    ['invalid', null],
    ['[[Dracula]]: Invalid Action', null],
    ['[[Dracula]]: Started', { action: 'started', book: '[[Dracula]]' }],
    ['[[Dracula]]: Abandoned', { action: 'abandoned', book: '[[Dracula]]' }],
    ['[[Dracula]]: Finished', { action: 'finished', book: '[[Dracula]]' }],
    ['[[Dracula]]: 5-25', { action: 'progress', book: '[[Dracula]]', start: new Page(5), end: new Page(25) }],
    ['[[Dracula]]: 50', { action: 'progress', book: '[[Dracula]]', start: null, end: new Page(50) }],
    [
        '[[Dracula]]: 2%-30%',
        { action: 'progress', book: '[[Dracula]]', start: new Percentage(2), end: new Percentage(30) },
    ],
    ['[[Dracula]]: 60%', { action: 'progress', book: '[[Dracula]]', start: null, end: new Percentage(60) }],
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
