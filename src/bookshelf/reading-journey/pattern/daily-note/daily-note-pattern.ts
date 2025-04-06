import { PatternCollection } from '../pattern-collection'
import { patternMatcher, transformer } from '../pattern'
import { position, Position } from '../../position'

interface ActionMatch {
    action: 'started' | 'finished' | 'abandoned'
    book: string
}

interface ProgressMatch {
    action: 'progress'
    book: string
    start: Position | null
    end: Position
}

export type DailyNoteMatch = ProgressMatch | ActionMatch

interface Patterns {
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

interface Result {
    patterns: PatternCollection<DailyNoteMatch>
    hasErrors: boolean
}

function actionMatcher(pattern: string, action: ActionMatch['action']) {
    return transformer(patternMatcher({ book: '.+' }, pattern), (matches): ActionMatch => ({ ...matches, action }))
}

function absoluteProgressMatcher(pattern: string) {
    return transformer(
        patternMatcher(
            {
                book: '.+',
                start: '\\d+',
                end: '\\d+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch => ({
            action: 'progress',
            book: matches.book,
            start: position(matches.start),
            end: position(matches.end),
        }),
    )
}

function relativeProgressMatcher(pattern: string) {
    return transformer(
        patternMatcher(
            {
                book: '.+',
                end: '\\d+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch => ({
            action: 'progress',
            book: matches.book,
            start: null,
            end: position(matches.end),
        }),
    )
}

export function dailyNotePatterns(patterns: Patterns): Result {
    const result = []
    let hasErrors = false

    try {
        result.push(actionMatcher(patterns.started, 'started'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(actionMatcher(patterns.finished, 'finished'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(actionMatcher(patterns.abandoned, 'abandoned'))
    } catch {
        hasErrors = true
    }

    try {
        result.push(absoluteProgressMatcher(patterns.absoluteProgress))
    } catch {
        hasErrors = true
    }

    try {
        result.push(relativeProgressMatcher(patterns.relativeProgress))
    } catch {
        hasErrors = true
    }

    return { patterns: new PatternCollection(result), hasErrors }
}
