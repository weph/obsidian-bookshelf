import { Book, BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { AbsoluteReadingProgress, ReadingProgress, RelativeReadingProgress } from './reading-progress'

class BookshelfBook implements Book {
    constructor(public metadata: BookMetadata) {}
}

export class Bookshelf {
    private books = new Map<string, Book>()

    private readingProgressItems: Array<AbsoluteReadingProgress | RelativeReadingProgress> = []

    public has(identifier: string): boolean {
        return this.books.has(identifier)
    }

    public add(identifier: string, metadata: BookMetadata): void {
        if (this.books.has(identifier)) {
            throw BookshelfError.identifierExists(identifier)
        }

        this.books.set(identifier, new BookshelfBook(metadata))
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

    public addReadingProgress(date: Date, identifier: string, endPage: number, startPage?: number): void {
        const book = this.book(identifier)

        let pos = 0
        while (
            pos < this.readingProgressItems.length &&
            this.readingProgressItems[pos].date.getTime() <= date.getTime()
        ) {
            ++pos
        }

        const previous = this.previousReadingProgress(book, pos)

        const item =
            startPage !== undefined
                ? new AbsoluteReadingProgress(date, book, previous, startPage, endPage)
                : new RelativeReadingProgress(date, book, previous, endPage)

        this.readingProgressItems.splice(pos, 0, item)

        const next = this.nextReadingProgress(book, pos)
        if (next) {
            next.previous = item
        }
    }

    private previousReadingProgress(
        book: Book,
        position: number,
    ): AbsoluteReadingProgress | RelativeReadingProgress | null {
        for (let i = position - 1; i >= 0; i--) {
            if (this.readingProgressItems[i].book === book) {
                return this.readingProgressItems[i]
            }
        }

        return null
    }

    private nextReadingProgress(
        book: Book,
        position: number,
    ): AbsoluteReadingProgress | RelativeReadingProgress | null {
        for (let i = position + 1; i < this.readingProgressItems.length; i++) {
            if (this.readingProgressItems[i].book === book) {
                return this.readingProgressItems[i]
            }
        }

        return null
    }

    public readingProgress(): Array<ReadingProgress> {
        return this.readingProgressItems
    }
}
