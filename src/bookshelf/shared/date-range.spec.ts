import { describe, expect, test } from 'vitest'
import { DateRange } from './date-range'

describe('Date Range', () => {
    test('Year', () => {
        const subject = DateRange.year(2025)

        expect(subject.start).toEqual(new Date(2025, 0, 1))
        expect(subject.end).toEqual(new Date(2025, 11, 31))
    })

    test('Month', () => {
        const subject = DateRange.month(2025, 2)

        expect(subject.start).toEqual(new Date(2025, 1, 1))
        expect(subject.end).toEqual(new Date(2025, 1, 28))
    })

    describe('Contains', () => {
        const subject = DateRange.custom(new Date(2025, 0, 15), new Date(2025, 0, 18))

        test('should include start date, end date, and everything in between', () => {
            expect(subject.contains(new Date(2025, 0, 15))).toBe(true)
            expect(subject.contains(new Date(2025, 0, 16))).toBe(true)
            expect(subject.contains(new Date(2025, 0, 17))).toBe(true)
            expect(subject.contains(new Date(2025, 0, 18))).toBe(true)
        })

        test('must not include dates outside of start and end date', () => {
            expect(subject.contains(new Date(2025, 0, 14))).toBe(false)
            expect(subject.contains(new Date(2025, 0, 19))).toBe(false)
        })
    })

    describe('Previous', () => {
        test('Year', () => {
            const subject = DateRange.year(2025)

            const result = subject.previous()

            expect(result.start).toEqual(new Date(2024, 0, 1))
            expect(result.end).toEqual(new Date(2024, 11, 31))
        })

        test('Month', () => {
            const subject = DateRange.month(2025, 2)

            const result = subject.previous()

            expect(result.start).toEqual(new Date(2025, 0, 1))
            expect(result.end).toEqual(new Date(2025, 0, 31))
        })

        test('Custom', () => {
            const subject = DateRange.custom(new Date(2025, 1, 1), new Date(2025, 1, 10))

            const result = subject.previous()

            expect(result.start).toEqual(new Date(2025, 0, 22))
            expect(result.end).toEqual(new Date(2025, 0, 31))
        })
    })

    describe('Next', () => {
        test('Year', () => {
            const subject = DateRange.year(2025)

            const result = subject.next()

            expect(result.start).toEqual(new Date(2026, 0, 1))
            expect(result.end).toEqual(new Date(2026, 11, 31))
        })

        test('Month', () => {
            const subject = DateRange.month(2025, 2)

            const result = subject.next()

            expect(result.start).toEqual(new Date(2025, 2, 1))
            expect(result.end).toEqual(new Date(2025, 2, 31))
        })

        test('Custom', () => {
            const subject = DateRange.custom(new Date(2025, 1, 1), new Date(2025, 1, 10))

            const result = subject.next()

            expect(result.start).toEqual(new Date(2025, 1, 11))
            expect(result.end).toEqual(new Date(2025, 1, 20))
        })
    })

    test.each([
        [DateRange.custom(new Date(2025, 0, 10), new Date(2025, 0, 20)), { years: 1, months: 1, days: 11 }],
        [DateRange.custom(new Date(2025, 0, 31), new Date(2025, 1, 1)), { years: 1, months: 2, days: 2 }],
        [DateRange.custom(new Date(2024, 11, 31), new Date(2025, 0, 1)), { years: 2, months: 2, days: 2 }],
        [DateRange.custom(new Date(2023, 2, 3), new Date(2025, 8, 9)), { years: 3, months: 31, days: 922 }],
    ])('Distinct calendar units of %o should be %o', (dateRange, expected) => {
        expect(dateRange.distinctCalendarUnits()).toEqual(expected)
    })
})
