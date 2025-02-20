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

interface Result {
    patterns: PatternCollection<BookNotePatternMatches>
    hasErrors: boolean
}

export function bookNotePatterns(patterns: Patterns, dateFormat: string): Result {
    const result = []
    let hasErrors = false

    try {
        result.push(new BookNoteActionPattern(patterns.started, 'started', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new BookNoteActionPattern(patterns.finished, 'finished', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new BookNoteActionPattern(patterns.abandoned, 'abandoned', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new BookNoteAbsoluteProgressPattern(patterns.absoluteProgress, dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new BookNoteRelativeProgressPattern(patterns.relativeProgress, dateFormat))
    } catch {
        hasErrors = true
    }

    return { patterns: new PatternCollection(result), hasErrors }
}
