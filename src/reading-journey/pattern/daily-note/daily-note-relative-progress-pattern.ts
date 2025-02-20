import { DailyNotePatternMatches } from './daily-note-pattern'
import { Pattern } from '../pattern'

export interface DailyNoteRelativeProgressPatternMatches {
    action: 'relative-progress'
    book: string
    endPage: number
}

const definition = {
    book: '.+',
    endPage: '\\d+',
}

export class DailyNoteRelativeProgressPattern {
    private readonly pattern: Pattern<typeof definition>

    constructor(pattern: string) {
        this.pattern = new Pattern(definition, pattern)
    }

    public matches(value: string): DailyNotePatternMatches | null {
        const matches = this.pattern.matches(value)
        if (matches === null) {
            return null
        }

        return {
            action: 'relative-progress',
            book: matches.book,
            endPage: parseInt(matches.endPage),
        }
    }
}
