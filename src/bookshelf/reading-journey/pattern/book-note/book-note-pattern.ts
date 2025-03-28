import { PatternCollection } from '../pattern-collection'
import { patternMatcher, transformer } from '../pattern'
import { DateTime } from 'luxon'

interface ActionMatch {
    action: 'started' | 'finished' | 'abandoned'
    date: Date
}

interface ProgressMatch {
    action: 'progress'
    date: Date
    startPage: number | null
    endPage: number
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
                startPage: '\\d+',
                endPage: '\\d+',
            },
            pattern,
        ),
        (matches): BookNoteMatch | null => {
            const dateObject = DateTime.fromFormat(matches.date, dateFormat)
            if (!dateObject.isValid) {
                return null
            }

            return {
                action: 'progress',
                date: dateObject.toJSDate(),
                startPage: parseInt(matches.startPage),
                endPage: parseInt(matches.endPage),
            }
        },
    )
}

function relativeProgressMatcher(pattern: string, dateFormat: string) {
    return transformer(
        patternMatcher(
            {
                date: '.+',
                endPage: '\\d+',
            },
            pattern,
        ),
        (matches): BookNoteMatch | null => {
            const dateObject = DateTime.fromFormat(matches.date, dateFormat)
            if (!dateObject.isValid) {
                return null
            }

            return {
                action: 'progress',
                date: dateObject.toJSDate(),
                startPage: null,
                endPage: parseInt(matches.endPage),
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
