import { DateTime } from 'luxon'
import { Pattern } from '../pattern'
import { BookNotePatternMatches } from './book-note-pattern'

export interface BookNoteRelativeProgressPatternMatches {
    action: 'relative-progress'
    date: Date
    endPage: number
}

const definition = {
    date: '.+',
    endPage: '\\d+',
}

export class BookNoteRelativeProgressPattern {
    private readonly pattern: Pattern<typeof definition>

    constructor(
        pattern: string,
        private readonly dateFormat: string,
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
            action: 'relative-progress',
            date: dateObject.toJSDate(),
            endPage: parseInt(matches.endPage),
        }
    }
}
