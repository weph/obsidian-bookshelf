import { expect, test } from 'vitest'
import { Time } from './time'
import { BookBuilder } from '../../../support/book-builder'
import { Playtime } from '../../shared/playtime'

test('first page should be 1', () => {
    expect(Time.fromString('1:23').first()).toEqual(Time.fromString('0:00'))
})

test('next position should be current position + 1 minute', () => {
    expect(Time.fromString('0:59').next()).toEqual(Time.fromString('1:00'))
})

test.each([
    [Playtime.fromString('1:30'), 180, '0:00', 1], // start at page 1
    [Playtime.fromString('1:30'), 180, '0:45', 90],
    [Playtime.fromString('1:30'), 180, '1:30', 180],
    [undefined, undefined, '1:20', null], // total number of pages unknown: null
])('pageInBook: %s duration with %o pages at %s => page %d', (duration, pages, time, expected) => {
    const book = new BookBuilder().with('duration', duration).with('pages', pages).build()

    expect(Time.fromString(time).pageInBook(book)).toBe(expected)
})

test.each([
    [new Time(Playtime.fromMinutes(0)), '0:00'],
    [new Time(Playtime.fromMinutes(95)), '1:35'],
    [new Time(Playtime.fromMinutes(6669)), '111:09'],
])('%o.toString should return %s', (time, expected) => {
    expect(time.toString()).toBe(expected)
})

test('create from string', () => {
    expect(Time.fromString('1:35')).toEqual(new Time(Playtime.fromMinutes(95)))
})

test('invalid string', () => {
    expect(() => Time.fromString('foobar')).toThrow()
})
