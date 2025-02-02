import { Book } from './book'
import { BookshelfError } from './bookshelf-error'

export class Bookshelf {
    private books = new Map<string, Book>()

    public has(identifier: string): boolean {
        return this.books.has(identifier)
    }

    public add(identifier: string, book: Book): void {
        if (this.books.has(identifier)) {
            throw BookshelfError.identifierExists(identifier)
        }

        this.books.set(identifier, book)
    }

    public book(identifier: string): Book {
        const result = this.books.get(identifier)

        if (result === undefined) {
            throw BookshelfError.identifierDoesntExist(identifier)
        }

        return result
    }

    public all(): Iterable<Book> {
        return this.books.values()
    }
}
