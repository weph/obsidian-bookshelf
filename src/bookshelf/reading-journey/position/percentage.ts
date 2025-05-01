import { Book } from 'src/bookshelf/book/book'
import { Part, Position } from './position'

export class Percentage implements Position {
    constructor(private value: number) {}

    public first(): Position {
        return new Percentage(0)
    }

    public next(book: Book): Position {
        const pages = book.metadata.pages
        if (pages === undefined) {
            return new Percentage(this.value + 1)
        }

        return new Percentage(Math.round(((this.pageInBook(book) + 1) / pages) * 100))
    }

    public pageInBook(book: Book): number {
        if (this.value === 0) {
            return 1
        }

        const pages = book.metadata.pages
        if (pages === undefined) {
            return 0
        }

        return Math.round((pages / 100) * this.value)
    }

    public toString(): string {
        return `${this.value}%`
    }

    public part(): Part {
        return 'main'
    }
}
