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

    public toString(): string {
        return this.value.toString()
    }

    public part(): Part {
        return 'main'
    }
}
