import { ReadingJourneyMatch } from './note-processor'
import { ReadingJourneyWriter } from './reading-journey-writer'
import { Notes } from '../notes'
import { Note } from '../note'

interface Patterns {
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

export class DailyNoteReadingJourneyWriter implements ReadingJourneyWriter {
    constructor(
        private readonly notes: Notes,
        private readonly heading: string,
        private readonly patterns: Patterns,
    ) {}

    public async add(item: ReadingJourneyMatch): Promise<Note> {
        const note = await this.notes.dailyNote(item.date)

        await note.appendToList(this.heading, this.itemText(item))

        return note
    }

    private itemText(item: ReadingJourneyMatch): string {
        const book = `[[${item.bookNote.basename}]]`

        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return this.patterns[item.action].replace('{book}', book)
            case 'progress':
                if (item.startPage === null) {
                    return this.patterns.relativeProgress
                        .replace('{book}', book)
                        .replace('{endPage}', item.endPage.toString())
                }

                return this.patterns.absoluteProgress
                    .replace('{book}', book)
                    .replace('{startPage}', item.startPage.toString())
                    .replace('{endPage}', item.endPage.toString())
        }
    }
}
