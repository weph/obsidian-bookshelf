import { expect, it } from '@jest/globals'
import { DailyNoteProgressPattern } from './daily-note-progress-pattern'

it('is invalid without {endPage} placeholder', () => {
    expect(() => new DailyNoteProgressPattern('{book}')).toThrow('Pattern must include {endPage} placeholder')
})

it('is invalid without {book} placeholder', () => {
    expect(() => new DailyNoteProgressPattern('{endPage}')).toThrow('Pattern must include {book} placeholder')
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new DailyNoteProgressPattern('{book}{endPage}{endPage}')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {book} must be used only once', () => {
    expect(() => new DailyNoteProgressPattern('{book}{endPage}{book}')).toThrow(
        'Placeholder {book} must be used only once',
    )
})

it('placeholder {startPage} must be used only once', () => {
    expect(() => new DailyNoteProgressPattern('{book}{endPage}{startPage}{startPage}')).toThrow(
        'Placeholder {startPage} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new DailyNoteProgressPattern('{book}{endPage}{*}{*}{*}')).not.toThrow()
})

it.each([
    {
        pattern: '{book}: {endPage}',
        input: '',
        expected: null,
    },
    {
        pattern: '{book}: {endPage}',
        input: ':',
        expected: null,
    },
    {
        pattern: '{book}: {endPage}',
        input: 'foo: bar',
        expected: null,
    },
    {
        pattern: '{book}: {endPage}',
        input: '[[Dracula]]: -1',
        expected: null,
    },
    {
        pattern: '{book}: {endPage}',
        input: '[[Dracula]]: 10',
        expected: { action: 'progress', book: '[[Dracula]]', endPage: 10 },
    },
    {
        pattern: '{book}: {startPage}-{endPage}',
        input: '[[Dracula]]: 5-10',
        expected: { action: 'progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
    {
        pattern: '{book}: {startPage}{*}{endPage}',
        input: '[[Dracula]]: 5 to 10',
        expected: { action: 'progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
    {
        pattern: '{book}: {*}{startPage}{*}{endPage}',
        input: '[[Dracula]]: from 5 to 10',
        expected: { action: 'progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new DailyNoteProgressPattern(pattern).matches(input)

    expect(result).toEqual(expected)
})
