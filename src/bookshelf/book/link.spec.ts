import { expect, test } from 'vitest'
import { Link } from './link'
import { Reference } from 'obsidian'

test('external link', () => {
    const input = 'https://www.foo.test/title'
    const expected = new Link('external', 'https://www.foo.test/title', 'foo.test', 'https://www.foo.test/title')

    expect(Link.from(input)).toEqual(expected)
})

test('internal link', () => {
    const input: Reference = { displayText: 'Display Text', link: 'Note', original: '[[Note|Display Text]]' }
    const expected = new Link('internal', 'Note', 'Display Text', '[[Note|Display Text]]')

    expect(Link.from(input)).toEqual(expected)
})

test.each([
    ['https://foo.test/', 'foo.test'],
    ['https://foo.bar.foo-bar.foobar.test/foo/bar', 'foobar.test'],
])('Display text of %o should be %o', (input, expected) => {
    expect(Link.from(input).displayText).toEqual(expected)
})
