import { BookSortOptions } from './book-sort-options'

export function defaultBookSortOptions(): BookSortOptions {
    const result = new BookSortOptions()
    result.add('Title: A-Z', (a, b) => stringDifference(a.metadata.title, b.metadata.title))
    result.add('Title: Z-A', (a, b) => stringDifference(b.metadata.title, a.metadata.title))
    result.add('Author: A-Z', (a, b) => stringDifference(a.metadata.authors?.[0], b.metadata.authors?.[0]))
    result.add('Author: Z-A', (a, b) => stringDifference(b.metadata.authors?.[0], a.metadata.authors?.[0]))
    result.add('Reading progress: Newest-Oldest', (a, b) =>
        stringDifference(
            b.readingJourney.lastItem()?.date.toUTCString(),
            a.readingJourney.lastItem()?.date.toUTCString(),
        ),
    )
    result.add('Reading progress: Oldest-Newest', (a, b) =>
        stringDifference(
            a.readingJourney.lastItem()?.date.toUTCString(),
            b.readingJourney.lastItem()?.date.toUTCString(),
        ),
    )
    result.add('Pages: Low-High', (a, b) => numberDifference(a.metadata.pages, b.metadata.pages))
    result.add('Pages: High-Low', (a, b) => numberDifference(b.metadata.pages, a.metadata.pages))

    return result
}

function stringDifference(a: string | undefined, b: string | undefined): number {
    return (a || '').localeCompare(b || '')
}

function numberDifference(a: number | undefined, b: number | undefined): number {
    return (a || 0) - (b || 0)
}
