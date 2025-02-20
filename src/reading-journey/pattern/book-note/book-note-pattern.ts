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
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

export function bookNotePatterns(patterns: Patterns, dateFormat: string): PatternCollection<BookNotePatternMatches> {
    const result = []

    try {
        result.push(new BookNoteActionPattern(patterns.started, 'started', dateFormat))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.started}: ${error}`)
    }

    try {
        result.push(new BookNoteActionPattern(patterns.finished, 'finished', dateFormat))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.finished}: ${error}`)
    }

    try {
        result.push(new BookNoteActionPattern(patterns.abandoned, 'abandoned', dateFormat))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.abandoned}: ${error}`)
    }

    try {
        result.push(new BookNoteAbsoluteProgressPattern(patterns.absoluteProgress, dateFormat))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.absoluteProgress}: ${error}`)
    }

    try {
        result.push(new BookNoteRelativeProgressPattern(patterns.relativeProgress, dateFormat))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.relativeProgress}: ${error}`)
    }

    return new PatternCollection(result)
}
