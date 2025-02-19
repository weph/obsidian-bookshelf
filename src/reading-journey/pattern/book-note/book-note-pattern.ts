import { PatternCollection } from '../pattern-collection'
import {
    BookNoteRelativeProgressPattern,
    BookNoteRelativeProgressPatternMatches,
} from './book-note-relative-progress-pattern'
import { BookNoteActionPattern, BookNoteActionPatternMatches } from './book-note-action-pattern'
import {
    BookNoteAbsoluteProgressPattern,
    BookNoteAbsoluteProgressPatternMatches,
} from './book-note-absolute-progress-pattern'

export type BookNotePatternMatches =
    | BookNoteRelativeProgressPatternMatches
    | BookNoteAbsoluteProgressPatternMatches
    | BookNoteActionPatternMatches

interface Patterns {
    absoluteProgress: Array<string>
    relativeProgress: Array<string>
    started: Array<string>
    finished: Array<string>
    abandoned: Array<string>
}

export function bookNotePatterns(patterns: Patterns, dateFormat: string): PatternCollection<BookNotePatternMatches> {
    const result = []

    for (const pattern of patterns.started) {
        try {
            result.push(new BookNoteActionPattern(pattern, 'started', dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.finished) {
        try {
            result.push(new BookNoteActionPattern(pattern, 'finished', dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.abandoned) {
        try {
            result.push(new BookNoteActionPattern(pattern, 'abandoned', dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.absoluteProgress) {
        try {
            result.push(new BookNoteAbsoluteProgressPattern(pattern, dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.relativeProgress) {
        try {
            result.push(new BookNoteRelativeProgressPattern(pattern, dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    return new PatternCollection(result)
}
