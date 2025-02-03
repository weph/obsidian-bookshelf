import { describe, expect, it, test } from '@jest/globals'
import { BookFactory } from './book-factory'
import { StaticMetadata } from './metadata/metadata'

const factory = new BookFactory({ cover: 'cover', author: 'author' }, (link) => `uri://${link}`)

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
