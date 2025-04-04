import { ReadingJourneyMatch } from './note-processor'
import { ReadingJourneyWriter } from './reading-journey-writer'
import { DateTime } from 'luxon'
import { Note } from '../note'

interface Patterns {
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

export class BookNoteReadingJourneyWriter implements ReadingJourneyWriter {
    constructor(
        private readonly dateFormat: string,
        private readonly heading: string,
        private readonly patterns: Patterns,
    ) {}

    public async add(item: ReadingJourneyMatch): Promise<Note> {
        await item.bookNote.appendToList(this.heading, this.itemText(item))

        return item.bookNote
    }

    private itemText(item: ReadingJourneyMatch): string {
        const formattedDate = DateTime.fromJSDate(item.date).toFormat(this.dateFormat)

        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return this.patterns[item.action].replace('{date}', formattedDate)
            case 'progress':
                if (item.startPage === null) {
                    return this.patterns.relativeProgress
                        .replace('{date}', formattedDate)
                        .replace('{endPage}', item.endPage.toString())
                }

                return this.patterns.absoluteProgress
                    .replace('{date}', formattedDate)
                    .replace('{startPage}', item.startPage.toString())
                    .replace('{endPage}', item.endPage.toString())
        }
    }
}
