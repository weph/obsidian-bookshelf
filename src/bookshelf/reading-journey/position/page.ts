import { Part, Position } from './position'
import { Book } from '../../book/book'

export class Page implements Position {
    constructor(private value: number) {}

    public first(): Position {
        return new Page(1)
    }

    public last(book: Book): Position | null {
        if (book.metadata.pages === undefined) {
            return null
        }

        return new Page(book.metadata.pages)
    }

    public next(): Position {
        return new Page(this.value + 1)
    }

    public pageInBook(): number {
        return this.value
    }

    asPercentage(book: Book): number | null {
        const totalPages = book.metadata.pages
        if (totalPages === undefined) {
            return null
        }

        return Math.min(Math.round((this.value / totalPages) * 100), 100)
    }

    public toString(): string {
        return this.value.toString()
    }

    public part(): Part {
        return 'main'
    }
}
