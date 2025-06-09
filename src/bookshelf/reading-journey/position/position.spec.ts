import { expect, test } from 'vitest'
import { position } from './position'
import { Page } from './page'
import { Percentage } from './percentage'
import { RomanNumeral } from './roman-numeral'
import { Time } from './time'
import { Playtime } from '../../shared/playtime'

test.each([
    [1, new Page(1)],
    ['123', new Page(123)],
    [' 123 ', new Page(123)],
    ['25%', new Percentage(25)],
    ['xxiv', new RomanNumeral(24)],
    ['10:35', new Time(Playtime.fromMinutes(635))],
])('position(%o) should return %o', (input, expected) => {
    expect(position(input)).toEqual(expected)
})

test.each([[''], ['foo'], [1.24]])('position(%o) must not be accepted', (input) => {
    expect(() => position(input)).toThrow(`Invalid position "${input}"`)
})
