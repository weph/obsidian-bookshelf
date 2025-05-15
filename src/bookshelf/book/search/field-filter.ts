import { Expression } from './expression'
import { Book } from '../book'

export class FieldFilter implements Expression {
    constructor(
        private readonly field: string,
        private readonly value: string,
    ) {}

    matches(book: Book): boolean {
        const value = this.fieldValue(book)

        return Array.isArray(value)
            ? value.map((v) => v.toLowerCase()).includes(this.value.toLowerCase())
            : value?.toLowerCase() === this.value.toLowerCase()
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
        }

        return null
    }
}
