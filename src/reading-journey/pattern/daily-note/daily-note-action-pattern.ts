import { DailyNotePatternMatches } from './daily-note-pattern'
import { Pattern } from '../pattern'

export interface DailyNoteActionPatternMatches {
    action: 'started' | 'finished' | 'abandoned'
    book: string
}

const definition = {
    book: '.+',
}

export class DailyNoteActionPattern {
    private readonly pattern: Pattern<typeof definition>

    constructor(
        pattern: string,
        private action: 'started' | 'finished' | 'abandoned',
    ) {
        this.pattern = new Pattern(definition, pattern)
    }

    public matches(value: string): DailyNotePatternMatches | null {
        const matches = this.pattern.matches(value)
        if (matches === null) {
            return null
        }

        return {
            book: matches.book,
            action: this.action,
        }
    }
}
