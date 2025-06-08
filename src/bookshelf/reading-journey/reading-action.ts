import { ReadingJourneyItemAction } from './reading-journey-log'
import { Book } from '../book/book'
import { Note } from '../note/note'
import { DateTime } from 'luxon'

export class ReadingAction implements ReadingJourneyItemAction {
    constructor(
        public readonly date: Date,
        public readonly book: Book,
        public readonly source: Note,
        public readonly action: 'started' | 'finished' | 'abandoned',
    ) {}

    public toString(): string {
        const date = DateTime.fromJSDate(this.date).toFormat('yyyy-MM-dd')

        return `${date}: ${this.book.metadata.title}: ${this.action}`
    }
}
