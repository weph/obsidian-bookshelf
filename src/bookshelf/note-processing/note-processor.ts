import { Note } from '../note'

interface ActionMatch {
    action: 'started' | 'finished' | 'abandoned'
    bookNote: Note
    date: Date
}

interface ProgressMatch {
    action: 'progress'
    bookNote: Note
    date: Date
    startPage: number | null
    endPage: number
}

export type ReadingJourneyMatch = ProgressMatch | ActionMatch

export interface NoteData {
    referencedBookNotes: Set<Note>
    readingJourney: Array<ReadingJourneyMatch>
}

export interface NoteProcessor {
    data: (note: Note) => Promise<NoteData>
}

export const emptyResult = (): NoteData => ({ referencedBookNotes: new Set<Note>(), readingJourney: [] })
