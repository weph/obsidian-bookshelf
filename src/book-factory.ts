import { Metadata, PropertyValue } from './metadata/metadata'
import { Book } from './book'
import { Reference } from 'obsidian'

type LinkToUri = (link: string) => string

interface PropertyNames {
    cover: string
    author: string
    published: string
}

export class BookFactory {
    constructor(
        private propertyNames: PropertyNames,
        private linkToUri: LinkToUri,
    ) {}

    public create(title: string, metadata: Metadata): Book {
        return {
            title,
            cover: this.cover(metadata),
            authors: this.authors(metadata),
            published: this.published(metadata),
        }
    }

    private cover(metadata: Metadata): string | undefined {
        const cover = this.firstValue(this.propertyNames.cover, metadata)

        if (typeof cover === 'string') {
            return cover.startsWith('http') ? cover : this.linkToUri(cover)
        }

        if (this.isReference(cover)) {
            return this.linkToUri(cover.link)
        }

        return undefined
    }

    private authors(metadata: Metadata): Array<string> {
        const value = metadata.value(this.propertyNames.author)

        if (value === null || typeof value === 'boolean') {
            return []
        }

        if (Array.isArray(value)) {
            return value.map((v) => this.text(v))
        }

        return [this.isReference(value) ? this.linkText(value) : value.toString()]
    }

    private published(metadata: Metadata): Date | undefined {
        const value = this.firstValue(this.propertyNames.published, metadata)

        if (typeof value === 'number') {
            return new Date(value, 0, 1)
        }

        if (typeof value === 'string') {
            if (value === `${parseInt(value)}`) {
                return new Date(parseInt(value), 0, 1)
            }

            const matches = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?$/)
            if (matches) {
                return new Date(
                    parseInt(matches[1]),
                    parseInt(matches[2]) - 1,
                    parseInt(matches[3]),
                    matches[4] ? parseInt(matches[4]) : 0,
                    matches[5] ? parseInt(matches[5]) : 0,
                    matches[6] ? parseInt(matches[6]) : 0,
                )
            }
        }

        return undefined
    }

    private isReference(value: PropertyValue | null) {
        return value !== null && typeof value === 'object' && 'link' in value
    }

    private text(value: PropertyValue): string {
        return this.isReference(value) ? this.linkText(value) : value.toString()
    }

    private linkText(link: Reference): string {
        return link.displayText || link.link
    }

    private firstValue(property: string, metadata: Metadata): PropertyValue | null {
        const value = metadata.value(property)

        return Array.isArray(value) ? value[0] : value
    }
}
