import { Book } from '../book/book'
import { Position } from './position/position'
import { Note } from '../note/note'
import { ReadingJourneyProgressItem } from './reading-journey-log'
import { DateTime } from 'luxon'

export class ReadingProgress implements ReadingJourneyProgressItem {
    public readonly action = 'progress'

    constructor(
        public readonly date: Date,
        public readonly book: Book,
        public previous: ReadingJourneyProgressItem | null,
        private readonly _start: Position | null,
        public readonly end: Position,
        public readonly source: Note,
    ) {}

    get start(): Position {
        if (this._start) {
            return this._start
        }

        if (this.previous === null || this.previous.end.part() !== this.end.part()) {
            return this.end.first()
        }

        return this.previous.end.next(this.book)
    }

    get pages(): number | null {
        const startPage = this.start.pageInBook(this.book)
        const endPage = this.end.pageInBook(this.book)

        if (startPage === null || endPage === null) {
            return null
        }

        return endPage - startPage + 1
    }

    public toString(): string {
        const date = DateTime.fromJSDate(this.date).toFormat('yyyy-MM-dd')
        const pages = this.pages

        if (pages !== null) {
            return `${date}: ${this.book.metadata.title}: ${this.start}-${this.end} (${pages} page${pages > 1 ? 's' : ''})`
        }

        return `${date}: ${this.book.metadata.title}: ${this.start}-${this.end}`
    }
}
