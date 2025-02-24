import { describe, expect, it } from '@jest/globals'
import { ObsidianMetadata } from './metadata'
import { CachedMetadata } from 'obsidian'

describe('Obsidian Metadata', () => {
    it('should return null if property does not exist', () => {
        expect(new ObsidianMetadata({}).value('key')).toBe(null)
    })

    it('should return existing property value', () => {
        const metadata: CachedMetadata = { frontmatter: { key: 'value' } }

        const subject = new ObsidianMetadata(metadata)

        expect(subject.value('key')).toBe('value')
    })

    it('should return reference if value is a link', () => {
        const metadata: CachedMetadata = {
            frontmatter: { key: 'value' },
            frontmatterLinks: [
                {
                    key: 'key',
                    link: 'linkValue',
                    original: 'originalValue',
                },
            ],
        }

        const subject = new ObsidianMetadata(metadata)

        expect(subject.value('key')).toEqual({
            key: 'key',
            link: 'linkValue',
            original: 'originalValue',
        })
    })

    it('should resolve references within lists', () => {
        const metadata: CachedMetadata = {
            frontmatter: { key: ['key.0.link', 'foo', 'key.2.link', true] },
            frontmatterLinks: [
                {
                    key: 'key.0',
                    link: 'key.0.link',
                    original: 'key.0.original',
                },
                {
                    key: 'key.2',
                    link: 'key.2.link',
                    original: 'key.2.original',
                },
            ],
        }

        const subject = new ObsidianMetadata(metadata)

        expect(subject.value('key')).toEqual([
            {
                key: 'key.0',
                link: 'key.0.link',
                original: 'key.0.original',
            },
            'foo',
            {
                key: 'key.2',
                link: 'key.2.link',
                original: 'key.2.original',
            },
            true,
        ])
    })
})
