import { DailyNotePatternMatches } from './daily-note-pattern'

export interface DailyNoteActionPatternMatches {
    action: 'started' | 'finished' | 'abandoned'
    book: string
}

export class DailyNoteActionPattern {
    private readonly regex: RegExp

    constructor(
        pattern: string,
        private action: 'started' | 'finished' | 'abandoned',
    ) {
        const placeholders = new Map<string, number>()
        for (const match of pattern.matchAll(/\{.+?}/g)) {
            placeholders.set(match[0], (placeholders.get(match[0]) || 0) + 1)
        }

        if (!placeholders.has('{book}')) {
            throw new Error('Pattern must include {book} placeholder')
        }

        for (const [placeholder, usages] of placeholders.entries()) {
            if (placeholder === '{*}') {
                continue
            }

            if (usages > 1) {
                throw new Error(`Placeholder ${placeholder} must be used only once`)
            }
        }

        const regex = pattern.replace(/\{\*}/g, '.*?').replace('{book}', '(?<book>.+)')

        this.regex = new RegExp(`^${regex}$`)
    }

    public matches(value: string): DailyNotePatternMatches | null {
        const matches = value.match(this.regex)
        if (matches === null) {
            return null
        }

        const groups = matches.groups

        // Stryker disable next-line StringLiteral: date cannot be undefined but TS doesn't know that
        const book = groups?.['book'] || ''

        return {
            book,
            action: this.action,
        }
    }
}
