import { DateTime } from 'luxon'
import { BookNotePatternMatches } from './book-note-pattern'
import { Pattern } from '../pattern'

export interface BookNoteAbsoluteProgressPatternMatches {
    action: 'absolute-progress'
    date: Date
    startPage: number
    endPage: number
}

const definition = {
    date: '.+',
    startPage: '\\d+',
    endPage: '\\d+',
}

export class BookNoteAbsoluteProgressPattern {
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
            action: 'absolute-progress',
            date: dateObject.toJSDate(),
            startPage: parseInt(matches.startPage),
            endPage: parseInt(matches.endPage),
        }
    }
}
