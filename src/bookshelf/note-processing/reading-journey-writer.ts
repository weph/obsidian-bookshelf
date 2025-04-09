import { ReadingJourneyMatch } from './note-processor'
import { Note } from '../note/note'

export interface ReadingJourneyWriter {
    /**
     * @returns Modified note
     */
    add(item: ReadingJourneyMatch): Promise<Note>
}
