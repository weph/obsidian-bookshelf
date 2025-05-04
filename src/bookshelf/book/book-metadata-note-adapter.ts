import { PropertyValue } from '../note/metadata'
import { BookMetadata, SeriesInfo } from './book'
import { Reference } from 'obsidian'
import { Note } from '../note/note'
import { Link } from './link'

export type LinkToUri = (link: string) => string

export interface PropertyNames {
    cover: string
    author: string
    published: string
    pages: string
    tags: string
    rating: string
    lists: string
    comment: string
    links: string
    series: string
    positionInSeries: string
}

export class BookMetadataNoteAdapter implements BookMetadata {
    constructor(
        private note: Note,
        private propertyNames: PropertyNames,
        private linkToUri: LinkToUri,
    ) {}

    get title(): string {
        return this.note.basename
    }

    get cover(): string | undefined {
        const cover = this.firstValue(this.propertyNames.cover)

        if (typeof cover === 'string') {
            return cover.startsWith('http') ? cover : this.linkToUri(cover)
        }

        if (this.isReference(cover)) {
            return this.linkToUri(cover.link)
        }

        return undefined
    }

    get authors(): Array<string | Link> {
        const value = this.note.metadata.value(this.propertyNames.author)

        if (value === null || typeof value === 'boolean') {
            return []
        }

        if (Array.isArray(value)) {
            return value.map((v) => (this.isReference(v) ? Link.from(v) : v.toString()))
        }

        return [this.isReference(value) ? Link.from(value) : value.toString()]
    }

    get published(): Date | undefined {
        const value = this.firstValue(this.propertyNames.published)

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

    get pages(): number | undefined {
        return this.intOrUndefined(this.note.metadata.value(this.propertyNames.pages))
    }

    get tags() {
        const value = this.note.metadata.value('tags')

        if (Array.isArray(value)) {
            return value.map((v) => this.text(v))
        }

        if (typeof value === 'string') {
            return [value]
        }

        return undefined
    }

    get rating(): number | undefined {
        return this.floatOrUndefined(this.note.metadata.value(this.propertyNames.rating))
    }

    get lists(): Array<string> {
        const value = this.note.metadata.value(this.propertyNames.lists)

        if (Array.isArray(value)) {
            return value.map((v) => this.text(v))
        }

        if (typeof value === 'string') {
            return [value]
        }

        return []
    }

    get comment(): string | undefined {
        const value = this.note.metadata.value(this.propertyNames.comment)

        if (typeof value === 'string') {
            return value
        }

        return undefined
    }

    get links(): Array<Link> {
        const value = this.note.metadata.value(this.propertyNames.links)

        const sourceLinks = Array.isArray(value) ? value : [value]

        return sourceLinks
            .map((v) => {
                if (!(this.isReference(v) || typeof v === 'string')) {
                    return null
                }

                try {
                    return Link.from(v)
                } catch {
                    return null
                }
            })
            .filter((v) => v !== null)
    }

    get series(): SeriesInfo | undefined {
        const seriesValue = this.note.metadata.value(this.propertyNames.series)
        const position = this.floatOrUndefined(this.note.metadata.value(this.propertyNames.positionInSeries))

        if (Array.isArray(seriesValue)) {
            return undefined
        }

        if (typeof seriesValue === 'string') {
            return { name: seriesValue, position }
        }

        if (this.isReference(seriesValue)) {
            try {
                return { name: Link.from(seriesValue), position }
            } catch {
                return undefined
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

    private firstValue(property: string): PropertyValue | null {
        const value = this.note.metadata.value(property)

        return Array.isArray(value) ? value[0] : value
    }

    private intOrUndefined(value: Array<PropertyValue> | PropertyValue | null): number | undefined {
        if (typeof value === 'number') {
            return value
        }

        if (typeof value === 'string') {
            const parsedValue = parseInt(value)
            if (!Number.isNaN(parsedValue) && `${parsedValue}` === value) {
                return parsedValue
            }
        }

        return undefined
    }

    private floatOrUndefined(value: Array<PropertyValue> | PropertyValue | null): number | undefined {
        if (typeof value === 'number') {
            return value
        }

        if (typeof value === 'string') {
            const parsedValue = parseFloat(value)
            if (!isNaN(parsedValue)) {
                return parsedValue
            }
        }

        return undefined
    }
}
