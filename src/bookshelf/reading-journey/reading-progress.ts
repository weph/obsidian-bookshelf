import { Book } from '../book/book'
import { Position } from './position/position'
import { Note } from '../note/note'
import { ReadingJourneyProgressItem } from './reading-journey-log'

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
}
