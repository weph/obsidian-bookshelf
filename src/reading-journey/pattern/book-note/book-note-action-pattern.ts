import { DateTime } from 'luxon'
import { BookNotePatternMatches } from './book-note-pattern'
import { Pattern } from '../pattern'

export interface BookNoteActionPatternMatches {
    action: 'started' | 'finished' | 'abandoned'
    date: Date
}

const definition = {
    date: '.+',
}

export class BookNoteActionPattern {
    private readonly pattern: Pattern<typeof definition>

    constructor(
        pattern: string,
        private action: 'started' | 'finished' | 'abandoned',
        private dateFormat: string,
    ) {
        this.pattern = new Pattern(definition, pattern)
    }

    public matches(value: string): BookNotePatternMatches | null {
        const matches = this.pattern.matches(value)
        if (matches === null) {
            return null
        }

        const dateObject = DateTime.fromFormat(matches.date, this.dateFormat)
        if (!dateObject.isValid) {
            return null
        }

        return {
            date: dateObject.toJSDate(),
            action: this.action,
        }
    }
}
