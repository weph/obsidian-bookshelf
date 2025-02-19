import { DateTime } from 'luxon'
import { BookNotePatternMatches } from './book-note-pattern'

export interface BookNoteRelativeProgressPatternMatches {
    action: 'relative-progress'
    date: Date
    endPage: number
}

export class BookNoteRelativeProgressPattern {
    private readonly regex: RegExp

    constructor(
        pattern: string,
        private dateFormat: string,
    ) {
        const placeholders = new Map<string, number>()
        for (const match of pattern.matchAll(/\{.+?}/g)) {
            placeholders.set(match[0], (placeholders.get(match[0]) || 0) + 1)
        }

        if (!placeholders.has('{date}')) {
            throw new Error('Pattern must include {date} placeholder')
        }

        if (!placeholders.has('{endPage}')) {
            throw new Error('Pattern must include {endPage} placeholder')
        }

        for (const [placeholder, usages] of placeholders.entries()) {
            if (placeholder === '{*}') {
                continue
            }

            if (usages > 1) {
                throw new Error(`Placeholder ${placeholder} must be used only once`)
            }
        }

        const regex = pattern
            .replace(/\{\*}/g, '.*?')
            .replace('{date}', '(?<date>.+)')
            .replace('{endPage}', '(?<endPage>\\d+)')

        this.regex = new RegExp(`^${regex}$`)
    }

    public matches(value: string): BookNotePatternMatches | null {
        const matches = value.match(this.regex)
        if (matches === null) {
            return null
        }

        const groups = matches.groups

        // Stryker disable next-line StringLiteral: date cannot be undefined but TS doesn't know that
        const dateStr = groups?.['date'] || ''
        // Stryker disable next-line StringLiteral: endPage cannot be undefined but TS doesn't know that
        const endPage = groups?.['endPage'] || ''

        const dateObject = DateTime.fromFormat(dateStr, this.dateFormat)
        if (!dateObject.isValid) {
            return null
        }

        return {
            action: 'relative-progress',
            date: dateObject.toJSDate(),
            endPage: parseInt(endPage),
        }
    }
}
