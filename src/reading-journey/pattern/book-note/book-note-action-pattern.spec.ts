import { expect, it } from '@jest/globals'
import { BookNoteActionPattern } from './book-note-action-pattern'

it('is invalid without {date} placeholder', () => {
    expect(() => new BookNoteActionPattern('{*}', 'started', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {date} placeholder',
    )
})

it('placeholder {date} must be used only once', () => {
    expect(() => new BookNoteActionPattern('{date}{*}{date}', 'started', 'yyyy-MM-dd')).toThrow(
        'Placeholder {date} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new BookNoteActionPattern('{date}{*}{*}{*}', 'started', 'yyyy-MM-dd')).not.toThrow()
})

it.each([
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: '',
        expected: null,
    },
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: ':',
        expected: null,
    },
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: 'foo: bar',
        expected: null,
    },
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: '1234-56-78: bar',
        expected: null,
    },
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: '2025-02-13: my-keyword with extra text',
        expected: null,
    },
    {
        pattern: '{date}: my-keyword{*}',
        action: 'started',
        input: '2025-02-13: my-keyword with extra text',
        expected: { date: new Date(2025, 1, 13), action: 'started' },
    },
    {
        pattern: '{date}: my-keyword',
        action: 'started',
        input: '2025-02-13: my-keyword',
        expected: { date: new Date(2025, 1, 13), action: 'started' },
    },
    {
        pattern: '{date}: my-keyword',
        action: 'finished',
        input: '2025-02-13: my-keyword',
        expected: { date: new Date(2025, 1, 13), action: 'finished' },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, action, input, expected }) => {
    const result = new BookNoteActionPattern(pattern, action as 'started' | 'finished', 'yyyy-MM-dd').matches(input)

    expect(result).toEqual(expected)
})
