import { describe, expect, test } from 'vitest'
import { Playtime } from './playtime'

describe('Playtime', () => {
    test('Invalid values must not be accepted', () => {
        expect(() => Playtime.fromString('1:2345')).toThrowError('Playtime "1:2345" is not in format <hours>:<minutes>')
    })

    test('Query hours', () => {
        expect(Playtime.fromString('12:59').hours).toBe(12)
    })

    test('Query minutes', () => {
        expect(Playtime.fromString('12:59').minutes).toBe(59)
    })

    test('Query total playtime in minutes', () => {
        expect(Playtime.fromString('12:59').inMinutes).toBe(779)
    })

    test('String representation (compact)', () => {
        expect(Playtime.fromString('12:59').toString()).toBe('12:59')
    })

    test('String representation (verbose)', () => {
        expect(Playtime.fromString('12:59').toString('verbose')).toBe('12h 59m')
    })

    test('String representation (verbose, only minutes)', () => {
        expect(Playtime.fromString('0:59').toString('verbose')).toBe('59m')
    })
})
