import { PatternCollection } from '../pattern/pattern-collection'
import { BookNoteMatch } from './book-note-pattern'
import { Note } from '../../note/note'
import { emptyResult, NoteData, NoteProcessor } from '../note-processor'

export class BookNoteProcessor implements NoteProcessor {
    constructor(
        private readonly booksFolder: string,
        private readonly heading: string,
        private readonly patterns: PatternCollection<BookNoteMatch> | null,
    ) {}

    async data(note: Note): Promise<NoteData> {
        if (!note.path.startsWith(this.booksFolder)) {
            return emptyResult()
        }

        const result = emptyResult()

        result.referencedBookNotes.add(note)

        if (this.patterns !== null) {
            for await (const listItem of note.listItems(this.heading)) {
                const matches = this.patterns.matches(listItem)
                if (matches === null) {
                    continue
                }

                result.readingJourney.push({ ...matches, bookNote: note })
            }
        }

        return result
    }
}
