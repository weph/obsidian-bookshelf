import { describe, expect, test } from 'vitest'
import { DateRange } from './date-range'

describe('Date Range', () => {
    test('Year', () => {
        const subject = DateRange.year(2025)

        expect(subject.start).toEqual(new Date(2025, 0, 1))
        expect(subject.end).toEqual(new Date(2025, 11, 31))
    })

    describe('Contains', () => {
        const subject = new DateRange(new Date(2025, 0, 15), new Date(2025, 0, 18))

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
})
