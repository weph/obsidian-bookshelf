import { Expression } from '../expression'
import { Book } from '../../book'
import { Condition } from '../condition'
import { DateTime } from 'luxon'

export class MatchField implements Expression {
    constructor(
        private readonly field: string,
        private readonly condition: Condition,
    ) {}

    matches(book: Book): boolean {
        const value = this.fieldValue(book)

        return Array.isArray(value) ? value.some((v) => this.condition.matches(v)) : this.condition.matches(value)
    }

    private fieldValue(book: Book): string | Array<string> | null {
        switch (this.field) {
            case 'author':
                return book.metadata.authors.map((v) => v.toString())
            case 'list':
                return book.metadata.lists
            case 'rating':
                return book.metadata.rating?.toString() || null
            case 'series':
                return book.metadata.series?.name.toString() || null
            case 'status':
                return book.status
            case 'title':
                return book.metadata.title
            case 'date':
                return book.readingJourney.map((item) => DateTime.fromJSDate(item.date).toFormat('yyyy-MM-dd'))
        }

        return null
    }
}
