import { DailyNotePatternMatches } from './daily-note-pattern'
import { Pattern } from '../pattern'

export interface DailyNoteAbsoluteProgressPatternMatches {
    action: 'absolute-progress'
    book: string
    startPage: number
    endPage: number
}

const definition = {
    book: '.+',
    startPage: '\\d+',
    endPage: '\\d+',
}

export class DailyNoteAbsoluteProgressPattern {
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
            action: 'absolute-progress',
            book: matches.book,
            startPage: parseInt(matches.startPage),
            endPage: parseInt(matches.endPage),
        }
    }
}
