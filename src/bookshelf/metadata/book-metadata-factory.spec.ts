import { describe, expect, it, test } from '@jest/globals'
import { BookMetadataFactory } from './book-metadata-factory'
import { StaticMetadata } from './metadata'

const factory = new BookMetadataFactory(
    {
        cover: 'cover',
        author: 'author',
        published: 'published',
        tags: 'tags',
        rating: 'rating',
    },
    (link) => `uri://${link}`,
)

describe('Title', () => {
    it('should be used as is', () => {
        const result = factory.create('Book Title', new StaticMetadata({}))

        expect(result.title).toBe('Book Title')
    })
})

describe('Cover', () => {
    it('should be undefined if property is not set', () => {
        const result = factory.create('Title', new StaticMetadata({}))

        expect(result.cover).toBeUndefined()
    })

    it('should be undefined if property value is an empty list', () => {
        const result = factory.create('Title', new StaticMetadata({ cover: [] }))

        expect(result.cover).toBeUndefined()
    })

    it('should be used as is if property value is a string starting with "http://"', () => {
        const result = factory.create('Title', new StaticMetadata({ cover: 'http://image.url/' }))

        expect(result.cover).toBe('http://image.url/')
    })

    it('should be used as is if property value is a string starting with "https://"', () => {
        const result = factory.create('Title', new StaticMetadata({ cover: 'https://image.url/' }))

        expect(result.cover).toBe('https://image.url/')
    })

    it('should be resolved cover uri if property value is a string', () => {
        const result = factory.create('Title', new StaticMetadata({ cover: 'image.jpg' }))

        expect(result.cover).toBe(`uri://image.jpg`)
    })

    it('should be resolved cover uri if property value is a link', () => {
        const result = factory.create(
            'Title',
            new StaticMetadata({ cover: { key: 'cover', link: 'image.jpg', original: '[[image]]' } }),
        )

        expect(result.cover).toBe(`uri://image.jpg`)
    })

    it('should be first element if property value is a list', () => {
        const result = factory.create(
            'Title',
            new StaticMetadata({ cover: ['https://image.url/one.jpg', 'https://image.url/two.jpg'] }),
        )

        expect(result.cover).toBe('https://image.url/one.jpg')
    })

    it('should be resolved cover uri of first element if property value is a list', () => {
        const result = factory.create(
            'Title',
            new StaticMetadata({
                cover: [
                    { key: 'cover', link: 'image1', original: '[[image1]]' },
                    { key: 'cover', link: 'image2', original: '[[image2]]' },
                ],
            }),
        )

        expect(result.cover).toBe(`uri://image1`)
    })
})

describe('Author', () => {
    test.each([
        [undefined, []],
        [true, []],
        [1, ['1']],
        ['Jane Doe', ['Jane Doe']],
        [
            ['Jane Doe', 'John Doe'],
            ['Jane Doe', 'John Doe'],
        ],
        [{ key: 'author', link: 'Jane Doe', original: '[[Jane Doe]]' }, ['Jane Doe']],
        [{ key: 'author', link: 'Jane Doe', original: '[[Jane Doe]]', displayText: 'J. Doe' }, ['J. Doe']],
        [
            [
                { key: 'author', link: 'Jane Doe', original: '[[Jane Doe]]', displayText: 'J. Doe' },
                'Foo Bar',
                { key: 'author', link: 'John Doe', original: '[[John Doe]]' },
            ],
            ['J. Doe', 'Foo Bar', 'John Doe'],
        ],
    ])('Metadata property "%s" should be %s', (value, expected) => {
        const result = factory.create('Title', new StaticMetadata(value !== undefined ? { author: value } : {}))

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
        const result = factory.create('Title', new StaticMetadata(value !== undefined ? { published: value } : {}))

        expect(result.published).toEqual(expected)
    })
})

describe('Tags', () => {
    it('should be undefined if property is not set', () => {
        const result = factory.create('Title', new StaticMetadata({}))

        expect(result.tags).toBeUndefined()
    })

    it('should be used as is if property value is an array', () => {
        const result = factory.create('Title', new StaticMetadata({ tags: ['foo', 'bar'] }))

        expect(result.tags).toEqual(['foo', 'bar'])
    })

    it('should be converted to an array if it is a string', () => {
        const result = factory.create('Title', new StaticMetadata({ tags: 'foo' }))

        expect(result.tags).toEqual(['foo'])
    })
})

describe('Rating', () => {
    it('should be undefined if property is not set', () => {
        const result = factory.create('Title', new StaticMetadata({}))

        expect(result.rating).toBeUndefined()
    })

    it('should be used as is if property value is an integer', () => {
        const result = factory.create('Title', new StaticMetadata({ rating: 3 }))

        expect(result.rating).toEqual(3)
    })

    it('should be used as is if property value is a float', () => {
        const result = factory.create('Title', new StaticMetadata({ rating: 3.5 }))

        expect(result.rating).toEqual(3.5)
    })

    it('should be converted if it is a numeric string', () => {
        const result = factory.create('Title', new StaticMetadata({ rating: '3.5' }))

        expect(result.rating).toEqual(3.5)
    })

    it('should be undefined if property value is a string', () => {
        const result = factory.create('Title', new StaticMetadata({ rating: 'foo' }))

        expect(result.rating).toBeUndefined()
    })

    it('should be undefined if property value is an array', () => {
        const result = factory.create('Title', new StaticMetadata({ rating: [3] }))

        expect(result.rating).toBeUndefined()
    })
})
