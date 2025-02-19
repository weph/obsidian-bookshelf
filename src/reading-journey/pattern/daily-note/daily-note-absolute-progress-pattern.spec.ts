import { expect, it } from '@jest/globals'
import { DailyNoteAbsoluteProgressPattern } from './daily-note-absolute-progress-pattern'

it('is invalid without {endPage} placeholder', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{startPage}')).toThrow(
        'Pattern must include {endPage} placeholder',
    )
})
it('is invalid without {startPage} placeholder', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{endPage}')).toThrow(
        'Pattern must include {startPage} placeholder',
    )
})

it('is invalid without {book} placeholder', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{startPage}{endPage}')).toThrow(
        'Pattern must include {book} placeholder',
    )
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{startPage}{endPage}{endPage}')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {book} must be used only once', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{startPage}{endPage}{book}')).toThrow(
        'Placeholder {book} must be used only once',
    )
})

it('placeholder {startPage} must be used only once', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{endPage}{startPage}{startPage}')).toThrow(
        'Placeholder {startPage} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new DailyNoteAbsoluteProgressPattern('{book}{startPage}{endPage}{*}{*}{*}')).not.toThrow()
})

it.each([
    {
        pattern: '{book}: {startPage}-{endPage}',
        input: '[[Dracula]]: 5-10',
        expected: { action: 'absolute-progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
    {
        pattern: '{book}: {startPage}{*}{endPage}',
        input: '[[Dracula]]: 5 to 10',
        expected: { action: 'absolute-progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
    {
        pattern: '{book}: {*}{startPage}{*}{endPage}',
        input: '[[Dracula]]: from 5 to 10',
        expected: { action: 'absolute-progress', book: '[[Dracula]]', startPage: 5, endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new DailyNoteAbsoluteProgressPattern(pattern).matches(input)

    expect(result).toEqual(expected)
})
