import { ReadingJourney } from '../reading-journey/reading-journey'
import { Note } from '../note/note'

export type ReadingStatus = 'unread' | 'reading' | 'abandoned' | 'finished'

export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors?: Array<string>
    readonly published?: Date
    readonly pages?: number
    readonly tags?: Array<string>
    readonly rating?: number
    readonly lists: Array<string>
    readonly comment?: string
}

export interface Book {
    note: Note
    metadata: BookMetadata
    readingJourney: ReadingJourney
    status: ReadingStatus
}
