import { Metadata, PropertyValue } from './metadata/metadata'
import { Book } from './book'

type LinkToUri = (link: string) => string

interface PropertyNames {
    cover: string
}

export class BookFactory {
    constructor(
        private propertyNames: PropertyNames,
        private linkToUri: LinkToUri,
    ) {}

    public create(title: string, metadata: Metadata): Book {
        return new Book(title, this.cover(metadata))
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

    private firstValue(property: string, metadata: Metadata): PropertyValue | null {
        const value = metadata.value(property)

        return Array.isArray(value) ? value[0] : value
    }
}
