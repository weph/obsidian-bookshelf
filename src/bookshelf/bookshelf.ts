import { Book } from './book/book'
import { Statistics } from './reading-journey/statistics/statistics'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note/note'
import { ReadingJourneyMatch } from './note-processing/note-processor'
import { Books } from './book/books'
import { DateRange } from './shared/date-range'

export interface Bookshelf {
    process(note: Note): Promise<void>

    remove(note: Note): void

    has(note: Note): boolean

    book(note: Note): Book

    all(): Books

    readingJourney(): ReadingJourney

    statistics(dateRange?: DateRange): Statistics

    addToReadingJourney(item: ReadingJourneyMatch): Promise<void>

    subscribe(subscriber: () => void): () => void
}
