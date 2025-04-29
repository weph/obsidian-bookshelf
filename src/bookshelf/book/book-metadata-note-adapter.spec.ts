import { describe, expect, it, test } from 'vitest'
import { StaticMetadata } from '../note/metadata'
import { FakeNote } from '../../support/fake-note'
import { BookMetadataNoteAdapter, LinkToUri, PropertyNames } from './book-metadata-note-adapter'
import { Note } from '../note/note'
import { Link } from './link'

const propertyNames: PropertyNames = {
    cover: 'cover',
    author: 'author',
    published: 'published',
    pages: 'pages',
    tags: 'tags',
    rating: 'rating',
    lists: 'lists',
    comment: 'comment',
    links: 'links',
}

const linkToUri: LinkToUri = (link) => `uri://${link}`

function bookMetadata(note: Note): BookMetadataNoteAdapter {
    return new BookMetadataNoteAdapter(note, propertyNames, linkToUri)
}

describe('Title', () => {
    it('should be used as is', () => {
        const result = bookMetadata(new FakeNote('Book Title.md', new StaticMetadata({})))

        expect(result.title).toBe('Book Title')
    })
})

describe('Cover', () => {
    it('should be undefined if property is not set', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({})))

        expect(result.cover).toBeUndefined()
    })

    it('should be undefined if property value is an empty list', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ cover: [] })))

        expect(result.cover).toBeUndefined()
    })

    it('should be used as is if property value is a string starting with "http://"', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ cover: 'http://image.url/' })))

        expect(result.cover).toBe('http://image.url/')
    })

    it('should be used as is if property value is a string starting with "https://"', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ cover: 'https://image.url/' })))

        expect(result.cover).toBe('https://image.url/')
    })

    it('should be resolved cover uri if property value is a string', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ cover: 'image.jpg' })))

        expect(result.cover).toBe(`uri://image.jpg`)
    })

    it('should be resolved cover uri if property value is a link', () => {
        const result = bookMetadata(
            new FakeNote(
                'Title',
                new StaticMetadata({ cover: { key: 'cover', link: 'image.jpg', original: '[[image]]' } }),
            ),
        )

        expect(result.cover).toBe(`uri://image.jpg`)
    })

    it('should be first element if property value is a list', () => {
        const result = bookMetadata(
            new FakeNote(
                'Title',
                new StaticMetadata({ cover: ['https://image.url/one.jpg', 'https://image.url/two.jpg'] }),
            ),
        )

        expect(result.cover).toBe('https://image.url/one.jpg')
    })

    it('should be resolved cover uri of first element if property value is a list', () => {
        const result = bookMetadata(
            new FakeNote(
                'Title',
                new StaticMetadata({
                    cover: [
                        { key: 'cover', link: 'image1', original: '[[image1]]' },
                        { key: 'cover', link: 'image2', original: '[[image2]]' },
                    ],
                }),
            ),
        )

        expect(result.cover).toBe(`uri://image1`)
    })
})

describe('Author', () => {
    const janeDoeReference = { key: 'author', link: 'Jane Doe', original: '[[Jane Doe]]' }
    const johnDoeReference = { key: 'author', link: 'John Doe', original: '[[John Doe]]' }

    test.each([
        [undefined, []],
        [true, []],
        [1, ['1']],
        ['Jane Doe', ['Jane Doe']],
        [
            ['Jane Doe', 'John Doe'],
            ['Jane Doe', 'John Doe'],
        ],
        [janeDoeReference, [Link.from(janeDoeReference)]],
        [
            [janeDoeReference, 'Foo Bar', johnDoeReference],
            [Link.from(janeDoeReference), 'Foo Bar', Link.from(johnDoeReference)],
        ],
    ])('Metadata property "%s" should be %s', (value, expected) => {
        const result = bookMetadata(
            new FakeNote('Title', new StaticMetadata(value !== undefined ? { author: value } : {})),
        )

        expect(result.authors).toEqual(expected)
    })
})

describe('Published', () => {
    test.each([
        [undefined, undefined],
        [true, undefined],
        ['foo', undefined],
        ['1234-56-789', undefined],
        ['12345-67-89', undefined],
        [{ key: 'published', link: '2024', original: '[[2024]]' }, undefined],
        [[true], undefined],
        [['foo'], undefined],
        [[{ key: 'published', link: '2024', original: '[[2024]]' }], undefined],
        [2025, new Date(2025, 0, 1)],
        [[2025, 2026], new Date(2025, 0, 1)],
        ['2025', new Date(2025, 0, 1)],
        [['2025', '2026'], new Date(2025, 0, 1)],
        ['2024-06-14', new Date(2024, 5, 14)],
        [' 2024-06-14   ', new Date(2024, 5, 14)],
        [['2024-06-14'], new Date(2024, 5, 14)],
        ['2024-06-14T18:30:45', new Date(2024, 5, 14, 18, 30, 45)],
        [['2024-06-14T18:30:45'], new Date(2024, 5, 14, 18, 30, 45)],
    ])('Metadata property "%s" should be %s', (value, expected) => {
        const result = bookMetadata(
            new FakeNote('Title', new StaticMetadata(value !== undefined ? { published: value } : {})),
        )

        expect(result.published).toEqual(expected)
    })
})

describe('Pages', () => {
    test.each([
        [undefined, undefined],
        [true, undefined],
        ['foo', undefined],
        ['1x', undefined],
        ['123', 123],
        [123, 123],
    ])('Metadata property "%s" should be %s', (value, expected) => {
        const result = bookMetadata(
            new FakeNote('Title', new StaticMetadata(value !== undefined ? { pages: value } : {})),
        )

        expect(result.pages).toEqual(expected)
    })
})

describe('Tags', () => {
    it('should be undefined if property is not set', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({})))

        expect(result.tags).toBeUndefined()
    })

    it('should be used as is if property value is an array', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ tags: ['foo', 'bar'] })))

        expect(result.tags).toEqual(['foo', 'bar'])
    })

    it('should be converted to an array if it is a string', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ tags: 'foo' })))

        expect(result.tags).toEqual(['foo'])
    })
})

describe('Rating', () => {
    it('should be undefined if property is not set', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({})))

        expect(result.rating).toBeUndefined()
    })

    it('should be used as is if property value is an integer', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ rating: 3 })))

        expect(result.rating).toEqual(3)
    })

    it('should be used as is if property value is a float', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ rating: 3.5 })))

        expect(result.rating).toEqual(3.5)
    })

    it('should be converted if it is a numeric string', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ rating: '3.5' })))

        expect(result.rating).toEqual(3.5)
    })

    it('should be undefined if property value is a string', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ rating: 'foo' })))

        expect(result.rating).toBeUndefined()
    })

    it('should be undefined if property value is an array', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ rating: [3] })))

        expect(result.rating).toBeUndefined()
    })
})

describe('Lists', () => {
    it('should be an empty list if property is not set', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({})))

        expect(result.lists).toEqual([])
    })

    it('should be used as is if property value is an array', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ lists: ['foo', 'bar'] })))

        expect(result.lists).toEqual(['foo', 'bar'])
    })

    it('should be converted to an array if it is a string', () => {
        const result = bookMetadata(new FakeNote('Title', new StaticMetadata({ lists: 'foo' })))

        expect(result.lists).toEqual(['foo'])
    })
})

describe('Comment', () => {
    test.each([
        [undefined, undefined],
        [true, undefined],
        [123, undefined],
        [[], undefined],
        [['foo'], undefined],
        ['my comment', 'my comment'],
    ])('Metadata property "%s" should be %s', (value, expected) => {
        const result = bookMetadata(
            new FakeNote('Title', new StaticMetadata(value !== undefined ? { comment: value } : {})),
        )

        expect(result.comment).toEqual(expected)
    })
})

describe('Links', () => {
    test.each([
        [undefined, []],
        [true, []],
        [123, []],
        [[], []],
        ['foo', []],
        ['https://foo.test/', [Link.from('https://foo.test/')]],
        [['https://foo.test/'], [Link.from('https://foo.test/')]],
        [
            ['https://foo.test/', 'bar', 'https://bar.test/'],
            [Link.from('https://foo.test/'), Link.from('https://bar.test/')],
        ],
    ])('Metadata property "%o" should be %o', (value, expected) => {
        const result = bookMetadata(
            new FakeNote('Title', new StaticMetadata(value !== undefined ? { links: value } : {})),
        )

        expect(result.links).toEqual(expected)
    })
})
