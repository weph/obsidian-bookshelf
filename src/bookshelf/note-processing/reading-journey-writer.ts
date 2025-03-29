import { ReadingJourneyMatch } from './note-processor'

export interface ReadingJourneyWriter {
    add(item: ReadingJourneyMatch): Promise<void>
}
