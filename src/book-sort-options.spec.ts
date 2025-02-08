import { beforeEach, expect, it } from '@jest/globals'
import { BookSortOptions } from './book-sort-options'

let bookSortOptions: BookSortOptions

beforeEach(() => {
    bookSortOptions = new BookSortOptions()
})

it('should return a list of all sort options in order of addition', () => {
    bookSortOptions.add('Foo', () => -1)
    bookSortOptions.add('Bar', () => -1)
    bookSortOptions.add('Baz', () => -1)

    const result = bookSortOptions.titles()

    expect(result).toEqual(['Foo', 'Bar', 'Baz'])
})

it('must not accept two sort options with the same title', () => {
    bookSortOptions.add('Foo', () => -1)

    expect(() => bookSortOptions.add('Foo', () => -1)).toThrow('Sort option "Foo" already exists')
})

it('should return compare function by title', () => {
    const foo = () => -1
    const bar = () => 1
    bookSortOptions.add('Foo', foo)
    bookSortOptions.add('Bar', bar)

    expect(bookSortOptions.compareFunction('Foo')).toBe(foo)
    expect(bookSortOptions.compareFunction('Bar')).toBe(bar)
})

it('must throw an error if requested compare function does not exist', () => {
    expect(() => bookSortOptions.compareFunction('Foo')).toThrow('Sort option "Foo" does not exist')
})
