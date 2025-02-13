import { DailyNoteProgressPattern, DailyNoteProgressPatternMatches } from './daily-note-progress-pattern'
import { DailyNoteActionPattern, DailyNoteActionPatternMatches } from './daily-note-action-pattern'
import { PatternCollection } from '../pattern-collection'

export type DailyNotePatternMatches = DailyNoteProgressPatternMatches | DailyNoteActionPatternMatches

interface Patterns {
    progress: Array<string>
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

    for (const pattern of patterns.progress) {
        try {
            result.push(new DailyNoteProgressPattern(pattern))
        } catch (error) {
            console.error(`Error processing pattern "${pattern}: ${error}`)
        }
    }

    return new PatternCollection(result)
}
