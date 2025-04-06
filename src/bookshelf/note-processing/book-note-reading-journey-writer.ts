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
                if (item.start === null) {
                    return this.patterns.relativeProgress
                        .replace('{date}', formattedDate)
                        .replace('{end}', item.end.toString())
                }

                return this.patterns.absoluteProgress
                    .replace('{date}', formattedDate)
                    .replace('{start}', item.start.toString())
                    .replace('{end}', item.end.toString())
        }
    }
}
