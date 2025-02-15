import { ReadingJourney } from './reading-journey/reading-journey'

export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors?: Array<string>
    readonly published?: Date
    readonly tags?: Array<string>
}

export interface Book {
    metadata: BookMetadata
    readingJourney: ReadingJourney
}
