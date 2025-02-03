import { Metadata, PropertyValue } from './metadata/metadata'
import { Book } from './book'
import { Reference } from 'obsidian'

type LinkToUri = (link: string) => string

interface PropertyNames {
    cover: string
    author: string
}

export class BookFactory {
    constructor(
        private propertyNames: PropertyNames,
        private linkToUri: LinkToUri,
    ) {}

    public create(title: string, metadata: Metadata): Book {
        return new Book(title, this.cover(metadata), this.authors(metadata))
    }

    private cover(metadata: Metadata): string | undefined {
        const cover = this.firstValue(this.propertyNames.cover, metadata)

        if (cover === null) {
            return undefined
        }

        if (typeof cover === 'string') {
            return cover.startsWith('http') ? cover : this.linkToUri(cover)
        }

        if (typeof cover === 'object' && 'link' in cover) {
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

        if (typeof value === 'object' && 'link' in value) {
            return [this.linkText(value)]
        }

        return [value.toString()]
    }

    private text(value: PropertyValue): string {
        if (typeof value === 'object' && 'link' in value) {
            return this.linkText(value)
        }

        return value.toString()
    }

    private linkText(link: Reference): string {
        return link.displayText || link.link
    }

    private firstValue(property: string, metadata: Metadata): PropertyValue | null {
        const value = metadata.value(property)

        return Array.isArray(value) ? value[0] : value
    }
}
