import { BookSortOptions } from './book-sort-options'

export function defaultBookSortOptions(): BookSortOptions {
    const result = new BookSortOptions()
    result.add('Title: A-Z', (a, b) => compare(a.metadata.title, b.metadata.title))
    result.add('Title: Z-A', (a, b) => compare(b.metadata.title, a.metadata.title))
    result.add('Author: A-Z', (a, b) => compare(a.metadata.authors?.[0], b.metadata.authors?.[0]))
    result.add('Author: Z-A', (a, b) => compare(b.metadata.authors?.[0], a.metadata.authors?.[0]))

    return result
}

function compare(a: string | undefined, b: string | undefined): number {
    return (a || '').localeCompare(b || '')
}
