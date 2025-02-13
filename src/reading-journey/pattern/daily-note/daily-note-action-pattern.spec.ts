import { expect, it } from '@jest/globals'
import { DailyNoteActionPattern } from './daily-note-action-pattern'

it('is invalid without {book} placeholder', () => {
    expect(() => new DailyNoteActionPattern('started', 'started')).toThrow('Pattern must include {book} placeholder')
})

it('placeholder {book} must be used only once', () => {
    expect(() => new DailyNoteActionPattern('{book}{book}', 'started')).toThrow(
        'Placeholder {book} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new DailyNoteActionPattern('{book}{*}{*}{*}', 'started')).not.toThrow()
})

it.each([
    {
        pattern: '{book}: my-keyword',
        action: 'started',
        input: '',
        expected: null,
    },
    {
        pattern: '{book}: my-keyword',
        action: 'started',
        input: ':',
        expected: null,
    },
    {
        pattern: '{book}: my-keyword',
        action: 'started',
        input: 'foo: bar',
        expected: null,
    },
    {
        pattern: '{book}: my-keyword',
        action: 'started',
        input: '[[Dracula]]: my-keyword with extra text',
        expected: null,
    },
    {
        pattern: '{book}: my-keyword{*}',
        action: 'started',
        input: '[[Dracula]]: my-keyword with extra text',
        expected: { book: '[[Dracula]]', action: 'started' },
    },
    {
        pattern: '{book}: my-keyword',
        action: 'started',
        input: '[[Dracula]]: my-keyword',
        expected: { book: '[[Dracula]]', action: 'started' },
    },
    {
        pattern: '{book}: my-keyword',
        action: 'finished',
        input: '[[Dracula]]: my-keyword',
        expected: { book: '[[Dracula]]', action: 'finished' },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, action, input, expected }) => {
    const result = new DailyNoteActionPattern(pattern, action as 'started' | 'finished').matches(input)

    expect(result).toEqual(expected)
})
