import { PatternCollection } from '../pattern/pattern-collection'
import { patternMatcher, transformer } from '../pattern/pattern'
import { position, Position } from '../../reading-journey/position/position'

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
                start: '.+',
                end: '.+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch | null => {
            let start
            let end
            try {
                start = position(matches.start)
                end = position(matches.end)
            } catch {
                return null
            }

            return {
                action: 'progress',
                book: matches.book,
                start,
                end,
            }
        },
    )
}

function relativeProgressMatcher(pattern: string) {
    return transformer(
        patternMatcher(
            {
                book: '.+',
                end: '.+',
            },
            pattern,
        ),
        (matches): DailyNoteMatch | null => {
            let end
            try {
                end = position(matches.end)
            } catch {
                return null
            }

            return {
                action: 'progress',
                book: matches.book,
                start: null,
                end,
            }
        },
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
