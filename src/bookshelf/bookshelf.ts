import { Book } from './book/book'
import { Statistics } from './reading-journey/statistics/statistics'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note/note'
import { ReadingJourneyMatch } from './note-processing/note-processor'

export interface Bookshelf {
    process(note: Note): Promise<void>

    remove(note: Note): void

    has(note: Note): boolean

    book(note: Note): Book

    all(): Iterable<Book>

    readingJourney(): ReadingJourney

    statistics(year?: number): Statistics

    addToReadingJourney(item: ReadingJourneyMatch): Promise<void>

    subscribe(subscriber: () => void): () => void
}
