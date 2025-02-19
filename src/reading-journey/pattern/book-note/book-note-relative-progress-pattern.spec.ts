import { expect, it } from '@jest/globals'
import { BookNoteRelativeProgressPattern } from './book-note-relative-progress-pattern'

it('is invalid without {date} placeholder', () => {
    expect(() => new BookNoteRelativeProgressPattern('{endPage}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {date} placeholder',
    )
})

it('is invalid without {endPage} placeholder', () => {
    expect(() => new BookNoteRelativeProgressPattern('{date}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {endPage} placeholder',
    )
})

it('placeholder {date} must be used only once', () => {
    expect(() => new BookNoteRelativeProgressPattern('{date}{endPage}{date}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {date} must be used only once',
    )
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new BookNoteRelativeProgressPattern('{date}{endPage}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new BookNoteRelativeProgressPattern('{date}{endPage}{*}{*}{*}', 'yyyy-MM-dd')).not.toThrow()
})

it.each([
    {
        pattern: '{date}: {endPage}',
        input: '',
        expected: null,
    },
    {
        pattern: '{date}: {endPage}',
        input: ':',
        expected: null,
    },
    {
        pattern: '{date}: {endPage}',
        input: 'foo: 10',
        expected: null,
    },
    {
        pattern: '{date}: {endPage}',
        input: '2024-01-15: foo',
        expected: null,
    },
    {
        pattern: '{date}: {endPage}',
        input: '2024-01-15: -1',
        expected: null,
    },
    {
        pattern: '{date}: {endPage}',
        input: '2024-01-15: 10',
        expected: { action: 'relative-progress', date: new Date(2024, 0, 15), endPage: 10 },
    },
    {
        pattern: '{date}: {*}{endPage}{*}',
        input: '2024-01-15: read until page 10 today',
        expected: { action: 'relative-progress', date: new Date(2024, 0, 15), endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new BookNoteRelativeProgressPattern(pattern, 'yyyy-MM-dd').matches(input)

    expect(result).toEqual(expected)
})
