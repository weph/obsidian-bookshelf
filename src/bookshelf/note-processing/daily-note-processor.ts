import { PatternCollection } from '../reading-journey/pattern/pattern-collection'
import { DailyNoteMatch } from '../reading-journey/pattern/daily-note/daily-note-pattern'
import { Note } from '../note'
import { dailyNoteDate } from '../daily-notes/daily-note-date'
import { emptyResult, NoteData, NoteProcessor } from './note-processor'
import { Notes } from '../notes'

export class DailyNoteProcessor implements NoteProcessor {
    constructor(
        private readonly heading: string,
        private readonly format: string,
        private readonly folder: string,
        private readonly patterns: PatternCollection<DailyNoteMatch>,
        private readonly notes: Notes,
    ) {}

    async data(note: Note): Promise<NoteData> {
        const date = dailyNoteDate(note.path, this.format, this.folder)
        if (date === null) {
            return emptyResult()
        }

        const result = emptyResult()

        for await (const listItem of note.listItems(this.heading)) {
            const matches = this.patterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const bookNote = this.notes.noteByLink(matches.book)
            if (bookNote === null) {
                continue
            }

            result.referencedBookNotes.add(bookNote)
            result.readingJourney.push({ ...matches, date, bookNote })
        }

        return result
    }
}
