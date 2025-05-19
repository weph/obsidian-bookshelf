import { Expression } from '../expression'
import { Book } from '../../book'
import { Condition } from '../condition'

export class Match implements Expression {
    constructor(private readonly condition: Condition) {}

    matches(book: Book): boolean {
        const searchableFields = [book.metadata.title]

        const series = book.metadata.series?.name.toString()
        if (series) {
            searchableFields.push(series)
        }

        searchableFields.push(...book.metadata.authors.map((a) => a.toString()))

        return searchableFields.some((f) => this.condition.matches(f))
    }
}
