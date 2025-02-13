import { PatternCollection } from '../pattern-collection'
import { BookNoteProgressPattern, BookNoteProgressPatternMatches } from './book-note-progress-pattern'
import { BookNoteActionPattern, BookNoteActionPatternMatches } from './book-note-action-pattern'

export type BookNotePatternMatches = BookNoteProgressPatternMatches | BookNoteActionPatternMatches

interface Patterns {
    progress: Array<string>
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

    for (const pattern of patterns.progress) {
        try {
            result.push(new BookNoteProgressPattern(pattern, dateFormat))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    return new PatternCollection(result)
}
