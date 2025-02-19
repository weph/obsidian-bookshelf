import { expect, it } from '@jest/globals'
import { DailyNoteRelativeProgressPattern } from './daily-note-relative-progress-pattern'

it('is invalid without {endPage} placeholder', () => {
    expect(() => new DailyNoteRelativeProgressPattern('{book}')).toThrow('Pattern must include {endPage} placeholder')
})

it('is invalid without {book} placeholder', () => {
    expect(() => new DailyNoteRelativeProgressPattern('{endPage}')).toThrow('Pattern must include {book} placeholder')
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new DailyNoteRelativeProgressPattern('{book}{endPage}{endPage}')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {book} must be used only once', () => {
    expect(() => new DailyNoteRelativeProgressPattern('{book}{endPage}{book}')).toThrow(
        'Placeholder {book} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new DailyNoteRelativeProgressPattern('{book}{endPage}{*}{*}{*}')).not.toThrow()
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
        expected: { action: 'relative-progress', book: '[[Dracula]]', endPage: 10 },
    },
    {
        pattern: '{book}: {*}{endPage}{*}',
        input: '[[Dracula]]: read until page 10 today',
        expected: { action: 'relative-progress', book: '[[Dracula]]', endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new DailyNoteRelativeProgressPattern(pattern).matches(input)

    expect(result).toEqual(expected)
})
