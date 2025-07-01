import { Book } from 'src/bookshelf/book/book'
import { Part, Position } from './position'
import { Playtime } from '../../shared/playtime'

export class Time implements Position {
    constructor(private value: Playtime) {}

    public static fromString(input: string): Time {
        return new Time(Playtime.fromString(input))
    }

    public first(): Position {
        return new Time(Playtime.fromMinutes(0))
    }

    public last(book: Book): Position | null {
        if (book.metadata.duration === undefined) {
            return null
        }

        return new Time(book.metadata.duration)
    }

    public next(): Position {
        return new Time(Playtime.fromMinutes(this.value.inMinutes + 1))
    }

    public pageInBook(book: Book): number | null {
        if (book.metadata.duration === undefined || book.metadata.pages === undefined) {
            return null
        }

        const current = this.value.inMinutes
        const total = book.metadata.duration.inMinutes

        return Math.max(1, Math.floor((book.metadata.pages * current) / total))
    }

    public toString(): string {
        return this.value.toString()
    }

    public part(): Part {
        return 'main'
    }
}
