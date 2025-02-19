import { expect, it } from '@jest/globals'
import { BookNoteAbsoluteProgressPattern } from './book-note-absolute-progress-pattern'

it('is invalid without {date} placeholder', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{startPage}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {date} placeholder',
    )
})

it('is invalid without {startPage} placeholder', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {startPage} placeholder',
    )
})

it('is invalid without {endPage} placeholder', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{startPage}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {endPage} placeholder',
    )
})

it('placeholder {date} must be used only once', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{startPage}{endPage}{date}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {date} must be used only once',
    )
})

it('placeholder {startPage} must be used only once', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{startPage}{startPage}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {startPage} must be used only once',
    )
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{startPage}{endPage}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new BookNoteAbsoluteProgressPattern('{date}{startPage}{endPage}{*}{*}{*}', 'yyyy-MM-dd')).not.toThrow()
})

it.each([
    {
        pattern: '{date}: {startPage}-{endPage}',
        input: 'foo: 5-10',
        expected: null,
    },
    {
        pattern: '{date}: {startPage}-{endPage}',
        input: '1234-56-78: 5-10',
        expected: null,
    },
    {
        pattern: '{date}: {startPage}-{endPage}',
        input: '2024-01-15: 5-10',
        expected: { action: 'absolute-progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
    {
        pattern: '{date}: {startPage}{*}{endPage}',
        input: '2024-01-15: 5 to 10',
        expected: { action: 'absolute-progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
    {
        pattern: '{date}: {*}{startPage}{*}{endPage}',
        input: '2024-01-15: from 5 to 10',
        expected: { action: 'absolute-progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new BookNoteAbsoluteProgressPattern(pattern, 'yyyy-MM-dd').matches(input)

    expect(result).toEqual(expected)
})
