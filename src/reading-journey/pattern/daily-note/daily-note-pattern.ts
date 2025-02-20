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
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

export function dailyNotePatterns(patterns: Patterns): PatternCollection<DailyNotePatternMatches> {
    const result = []

    try {
        result.push(new DailyNoteActionPattern(patterns.started, 'started'))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.started}: ${error}`)
    }

    try {
        result.push(new DailyNoteActionPattern(patterns.finished, 'finished'))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.finished}: ${error}`)
    }

    try {
        result.push(new DailyNoteActionPattern(patterns.abandoned, 'abandoned'))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.abandoned}: ${error}`)
    }

    try {
        result.push(new DailyNoteAbsoluteProgressPattern(patterns.absoluteProgress))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.absoluteProgress}: ${error}`)
    }

    try {
        result.push(new DailyNoteRelativeProgressPattern(patterns.relativeProgress))
    } catch (error) {
        console.error(`Error processing pattern "${patterns.relativeProgress}: ${error}`)
    }

    return new PatternCollection(result)
}
