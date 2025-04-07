import { expect, test } from 'vitest'
import { position } from './position'
import { Page } from './page'
import { Percentage } from './percentage'

test.each([
    [1, new Page(1)],
    ['123', new Page(123)],
    [' 123 ', new Page(123)],
    ['25%', new Percentage(25)],
])('position(%o) should return %o', (input, expected) => {
    expect(position(input)).toEqual(expected)
})

test.each([[''], ['foo'], [1.24]])('position(%o) must not be accepted', (input) => {
    expect(() => position(input)).toThrow(`Invalid position "${input}"`)
})
