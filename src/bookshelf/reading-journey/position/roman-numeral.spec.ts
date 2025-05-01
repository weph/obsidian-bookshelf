import { expect, test } from 'vitest'
import { RomanNumeral } from './roman-numeral'

test('first page should be 1', () => {
    expect(new RomanNumeral(23).first()).toEqual(new RomanNumeral(1))
})

test('next page should be current page + 1', () => {
    expect(new RomanNumeral(23).next()).toEqual(new RomanNumeral(24))
})

test('page in book should be current page', () => {
    expect(new RomanNumeral(23).pageInBook()).toEqual(23)
})

test('toString should return roman numeral', () => {
    expect(new RomanNumeral(23).toString()).toBe('xxiii')
})

test('create from string', () => {
    expect(RomanNumeral.fromString('xviii')).toEqual(new RomanNumeral(18))
})

test('create from uppercase string', () => {
    expect(RomanNumeral.fromString('XVIII')).toEqual(new RomanNumeral(18))
})

test('invalid string', () => {
    expect(() => RomanNumeral.fromString('foobar')).toThrow()
})
