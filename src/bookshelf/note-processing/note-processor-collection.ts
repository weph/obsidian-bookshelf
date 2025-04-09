import { Note } from '../note/note'
import { emptyResult, NoteData, NoteProcessor } from './note-processor'

export class NoteProcessorCollection implements NoteProcessor {
    constructor(private readonly noteProcessors: Array<NoteProcessor>) {}

    async data(note: Note): Promise<NoteData> {
        const result = emptyResult()

        for (const noteProcessor of this.noteProcessors) {
            const singleResult = await noteProcessor.data(note)

            for (const referencedBook of singleResult.referencedBookNotes) {
                result.referencedBookNotes.add(referencedBook)
            }

            result.readingJourney.push(...singleResult.readingJourney)
        }

        return result
    }
}
