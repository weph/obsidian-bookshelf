import { expect, test } from 'vitest'
import { Percentage } from './percentage'
import { BookBuilder } from '../../../support/book-builder'

test.each([
    [100, 0, 1], // start at page 1 (I'm sure I'm going to regret this exception in the future)
    [100, 1, 1], // 1% is still page 1
    [123, 50, 62], // round up
    [123, 49, 60], // round down
    [undefined, 50, null], // total number of pages unknown: null
])('pageInBook: %o pages at %d% => page %d', (pages, percentage, expected) => {
    const book = new BookBuilder().with('pages', pages).build()

    expect(new Percentage(percentage).pageInBook(book)).toBe(expected)
})

test.each([
    [100, 0, 2], // starting at page 1, so it should go right to 2%
    [100, 50, 51], // round up
    [300, 50, 50], // round down
    [undefined, 50, 51], // total number of pages unknown: go up one percent
])('next: %d pages at %d% => page %d', (pages, percentage, expected) => {
    const book = new BookBuilder().with('pages', pages).build()

    expect(new Percentage(percentage).next(book)).toEqual(new Percentage(expected))
})
