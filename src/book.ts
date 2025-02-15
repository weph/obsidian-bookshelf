import { ReadingJourneyItem } from './reading-journey/reading-journey-log'

export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors?: Array<string>
    readonly published?: Date
    readonly tags?: Array<string>
}

export interface Book {
    metadata: BookMetadata
    readingJourney: Array<ReadingJourneyItem>
}
