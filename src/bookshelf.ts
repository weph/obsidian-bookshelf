import { Book } from './book'
import { BookshelfError } from './bookshelf-error'
import { AbsoluteReadingProgress, ReadingProgress, RelativeProgress } from './reading-progress'

export class Bookshelf {
    private books = new Map<string, Book>()

    private readingProgressItems: Array<ReadingProgress> = []

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

    public addReadingProgress(date: Date, book: Book, endPage: number, startPage?: number): void {
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
                : new RelativeProgress(date, book, previous, endPage)

        this.readingProgressItems.splice(pos, 0, item)

        const next = this.nextReadingProgress(book, pos)
        if (next) {
            next.previous = item
        }
    }

    private previousReadingProgress(book: Book, position: number): ReadingProgress | null {
        for (let i = position - 1; i >= 0; i--) {
            if (this.readingProgressItems[i].book === book) {
                return this.readingProgressItems[i]
            }
        }

        return null
    }

    private nextReadingProgress(book: Book, position: number): ReadingProgress | null {
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
