import { PropertyValue } from '../note/metadata'
import { BookMetadata } from './book'
import { Reference } from 'obsidian'
import { Note } from '../note/note'

export type LinkToUri = (link: string) => string

export interface PropertyNames {
    cover: string
    author: string
    published: string
    pages: string
    tags: string
    rating: string
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

    get authors(): Array<string> {
        const value = this.note.metadata.value(this.propertyNames.author)

        if (value === null || typeof value === 'boolean') {
            return []
        }

        if (Array.isArray(value)) {
            return value.map((v) => this.text(v))
        }

        return [this.isReference(value) ? this.linkText(value) : value.toString()]
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
        const value = this.firstValue(this.propertyNames.pages)

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
        const value = this.note.metadata.value(this.propertyNames.rating)

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
}
