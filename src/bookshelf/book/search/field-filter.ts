import { Expression } from './expression'
import { Book, BookMetadata } from '../book'

export class FieldFilter implements Expression {
    constructor(
        private readonly field: keyof BookMetadata,
        private readonly value: string,
    ) {}

    matches(book: Book): boolean {
        const value = book.metadata[this.field]

        if (Array.isArray(value)) {
            return value.map((v) => v.toString()).includes(this.value)
        }

        return value?.toString() === this.value
    }
}
