import { expect, test } from 'vitest'
import { Page, position } from './position'

test.each([
    [1, new Page(1)],
    ['123', new Page(123)],
    [' 123 ', new Page(123)],
])('position(%o) should return %o', (input, expected) => {
    expect(position(input)).toEqual(expected)
})

test.each([[''], ['foo'], [1.24]])('position(%o) must not be accepted', (input) => {
    expect(() => position(input)).toThrow(`Invalid position "${input}"`)
})
