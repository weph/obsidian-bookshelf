import { PatternCollection } from '../pattern/pattern-collection'
import { patternMatcher, transformer } from '../pattern/pattern'
import { DateTime } from 'luxon'
import { position, Position } from '../../reading-journey/position/position'

interface ActionMatch {
    action: 'started' | 'finished' | 'abandoned'
    date: Date
}

interface ProgressMatch {
    action: 'progress'
    date: Date
    start: Position | null
    end: Position
}

export type BookNoteMatch = ProgressMatch | ActionMatch

interface Patterns {
    absoluteProgress: string
    relativeProgress: string
    started: string
    finished: string
    abandoned: string
}

interface Result {
    patterns: PatternCollection<BookNoteMatch>
    hasErrors: boolean
}

function actionMatcher(pattern: string, action: ActionMatch['action'], dateFormat: string) {
    return transformer(patternMatcher({ date: '.+' }, pattern), (matches): BookNoteMatch | null => {
        const dateObject = DateTime.fromFormat(matches.date, dateFormat)
        if (!dateObject.isValid) {
            return null
        }

        return { ...matches, date: dateObject.toJSDate(), action }
    })
}

function absoluteProgressMatcher(pattern: string, dateFormat: string) {
    return transformer(
        patternMatcher(
            {
                date: '.+',
                start: '.+',
                end: '.+',
            },
            pattern,
        ),
        (matches): BookNoteMatch | null => {
            const dateObject = DateTime.fromFormat(matches.date, dateFormat)
            if (!dateObject.isValid) {
                return null
            }

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
                date: dateObject.toJSDate(),
                start,
                end,
            }
        },
    )
}

function relativeProgressMatcher(pattern: string, dateFormat: string) {
    return transformer(
        patternMatcher(
            {
                date: '.+',
                end: '.+',
            },
            pattern,
        ),
        (matches): BookNoteMatch | null => {
            const dateObject = DateTime.fromFormat(matches.date, dateFormat)
            if (!dateObject.isValid) {
                return null
            }

            let end
            try {
                end = position(matches.end)
            } catch {
                return null
            }

            return {
                action: 'progress',
                date: dateObject.toJSDate(),
                start: null,
                end,
            }
        },
    )
}

export function bookNotePatterns(patterns: Patterns, dateFormat: string): Result {
    const result = []
    let hasErrors = false

    try {
        result.push(actionMatcher(patterns.started, 'started', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(actionMatcher(patterns.finished, 'finished', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(actionMatcher(patterns.abandoned, 'abandoned', dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(absoluteProgressMatcher(patterns.absoluteProgress, dateFormat))
    } catch {
        hasErrors = true
    }

    try {
        result.push(relativeProgressMatcher(patterns.relativeProgress, dateFormat))
    } catch {
        hasErrors = true
    }

    return { patterns: new PatternCollection(result), hasErrors }
}
