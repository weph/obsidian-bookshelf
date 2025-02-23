import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note'

export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors?: Array<string>
    readonly published?: Date
    readonly tags?: Array<string>
    readonly rating?: number
}

export interface Book {
    note: Note | null
    metadata: BookMetadata
    readingJourney: ReadingJourney
}
