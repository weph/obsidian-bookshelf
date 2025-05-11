import { Expression } from './expression'
import { Book, ReadingStatus } from '../book'

export class ReadingStatusFilter implements Expression {
    constructor(private readonly value: ReadingStatus) {}

    matches(book: Book): boolean {
        return book.status === this.value
    }
}
