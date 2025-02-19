import {
    DailyNoteAbsoluteProgressPattern,
    DailyNoteAbsoluteProgressPatternMatches,
} from './daily-note-absolute-progress-pattern'
import { DailyNoteActionPattern, DailyNoteActionPatternMatches } from './daily-note-action-pattern'
import { PatternCollection } from '../pattern-collection'
import {
    DailyNoteRelativeProgressPattern,
    DailyNoteRelativeProgressPatternMatches,
} from './daily-note-relative-progress-pattern'

export type DailyNotePatternMatches =
    | DailyNoteRelativeProgressPatternMatches
    | DailyNoteAbsoluteProgressPatternMatches
    | DailyNoteActionPatternMatches

interface Patterns {
    absoluteProgress: Array<string>
    relativeProgress: Array<string>
    started: Array<string>
    finished: Array<string>
    abandoned: Array<string>
}

export function dailyNotePatterns(patterns: Patterns): PatternCollection<DailyNotePatternMatches> {
    const result = []

    for (const pattern of patterns.started) {
        try {
            result.push(new DailyNoteActionPattern(pattern, 'started'))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.finished) {
        try {
            result.push(new DailyNoteActionPattern(pattern, 'finished'))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.abandoned) {
        try {
            result.push(new DailyNoteActionPattern(pattern, 'abandoned'))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.absoluteProgress) {
        try {
            result.push(new DailyNoteAbsoluteProgressPattern(pattern))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    for (const pattern of patterns.relativeProgress) {
        try {
            result.push(new DailyNoteRelativeProgressPattern(pattern))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    return new PatternCollection(result)
}
