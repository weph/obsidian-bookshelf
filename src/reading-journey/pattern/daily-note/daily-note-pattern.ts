import { PatternCollection } from '../pattern-collection'
import { patternMatcher, transformer } from '../pattern'

interface ActionMatch {
    action: 'started' | 'finished' | 'abandoned'
    book: string
}

interface AbsoluteProgressMatch {
    action: 'absolute-progress'
    book: string
    startPage: number
    endPage: number
}

interface RelativeProgressMatch {
    action: 'relative-progress'
    book: string
    endPage: number
}

export type DailyNoteMatch = RelativeProgressMatch | AbsoluteProgressMatch | ActionMatch

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
                startPage: '\\d+',
                endPage: '\\d+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch => ({
            action: 'absolute-progress',
            book: matches.book,
            startPage: parseInt(matches.startPage),
            endPage: parseInt(matches.endPage),
        }),
    )
}

function relativeProgressMatcher(pattern: string) {
    return transformer(
        patternMatcher(
            {
                book: '.+',
                endPage: '\\d+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch => ({
            action: 'relative-progress',
            book: matches.book,
            endPage: parseInt(matches.endPage),
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
