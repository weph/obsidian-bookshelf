import { ReadingJourney } from '../reading-journey/reading-journey'
import { Note } from '../note/note'
import { Link } from './link'

export type ReadingStatus = 'unread' | 'reading' | 'abandoned' | 'finished'

export interface SeriesInfo {
    name: string | Link
    position?: number
}

export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors: Array<string | Link>
    readonly published?: Date
    readonly pages?: number
    readonly tags?: Array<string>
    readonly rating?: number
    readonly lists: Array<string>
    readonly comment?: string
    readonly links: Array<Link>
    readonly series?: SeriesInfo
}

export interface Book {
    note: Note
    metadata: BookMetadata
    readingJourney: ReadingJourney
    status: ReadingStatus
}
