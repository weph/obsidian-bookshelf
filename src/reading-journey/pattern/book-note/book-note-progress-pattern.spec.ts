import { expect, it } from '@jest/globals'
import { BookNoteProgressPattern } from './book-note-progress-pattern'

it('is invalid without {date} placeholder', () => {
    expect(() => new BookNoteProgressPattern('{endPage}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {date} placeholder',
    )
})

it('is invalid without {endPage} placeholder', () => {
    expect(() => new BookNoteProgressPattern('{date}', 'yyyy-MM-dd')).toThrow(
        'Pattern must include {endPage} placeholder',
    )
})

it('placeholder {date} must be used only once', () => {
    expect(() => new BookNoteProgressPattern('{date}{endPage}{date}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {date} must be used only once',
    )
})

it('placeholder {endPage} must be used only once', () => {
    expect(() => new BookNoteProgressPattern('{date}{endPage}{endPage}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {endPage} must be used only once',
    )
})

it('placeholder {startPage} must be used only once', () => {
    expect(() => new BookNoteProgressPattern('{date}{endPage}{startPage}{startPage}', 'yyyy-MM-dd')).toThrow(
        'Placeholder {startPage} must be used only once',
    )
})

it('placeholder {*} may be used multiple times', () => {
    expect(() => new BookNoteProgressPattern('{date}{endPage}{*}{*}{*}', 'yyyy-MM-dd')).not.toThrow()
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
        expected: { action: 'progress', date: new Date(2024, 0, 15), endPage: 10 },
    },
    {
        pattern: '{date}: {startPage}-{endPage}',
        input: '2024-01-15: 5-10',
        expected: { action: 'progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
    {
        pattern: '{date}: {startPage}{*}{endPage}',
        input: '2024-01-15: 5 to 10',
        expected: { action: 'progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
    {
        pattern: '{date}: {*}{startPage}{*}{endPage}',
        input: '2024-01-15: from 5 to 10',
        expected: { action: 'progress', date: new Date(2024, 0, 15), startPage: 5, endPage: 10 },
    },
])('pattern "$pattern" and input "$input" => $expected', ({ pattern, input, expected }) => {
    const result = new BookNoteProgressPattern(pattern, 'yyyy-MM-dd').matches(input)

    expect(result).toEqual(expected)
})
