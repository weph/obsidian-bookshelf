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

interface Result {
    patterns: PatternCollection<DailyNotePatternMatches>
    hasErrors: boolean
}

export function dailyNotePatterns(patterns: Patterns): Result {
    const result = []
    let hasErrors = false

    try {
        result.push(new DailyNoteActionPattern(patterns.started, 'started'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new DailyNoteActionPattern(patterns.finished, 'finished'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new DailyNoteActionPattern(patterns.abandoned, 'abandoned'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new DailyNoteAbsoluteProgressPattern(patterns.absoluteProgress))
    } catch {
        hasErrors = true
    }

    try {
        result.push(new DailyNoteRelativeProgressPattern(patterns.relativeProgress))
    } catch {
        hasErrors = true
    }

    return { patterns: new PatternCollection(result), hasErrors }
}
