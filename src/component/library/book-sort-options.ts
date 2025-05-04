import { DropdownOption } from '../dropdown/dropdown'
import { Book, BookMetadata } from '../../bookshelf/book/book'
import { Link } from '../../bookshelf/book/link'

function stringDifference(a: string | undefined, b: string | undefined): number {
    return (a || '').localeCompare(b || '')
}

function numberDifference(a: number | undefined, b: number | undefined): number {
    return (a || 0) - (b || 0)
}

function seriesDifference(a: BookMetadata, b: BookMetadata): number {
    const aInfo = a.series || { name: a.title }
    const bInfo = b.series || { name: b.title }

    const titleDifference = stringDifference(stringValue(aInfo.name), stringValue(bInfo.name))
    if (titleDifference === 0) {
        return numberDifference(aInfo.position, bInfo.position)
    }

    return titleDifference
}

export interface SortDropdownOption extends DropdownOption<string> {
    compareFn(a: Book, b: Book): number
}

function stringValue(a: string | Link | undefined): string | undefined {
    return a instanceof Link ? a.displayText : a
}

export const bookSortOptions: Array<SortDropdownOption> = [
    {
        value: 'a-z',
        label: 'Title: A-Z',
        compareFn: (a, b) => stringDifference(a.metadata.title, b.metadata.title),
    },
    {
        value: 'z-a',
        label: 'Title: Z-A',
        compareFn: (a, b) => stringDifference(b.metadata.title, a.metadata.title),
    },
    {
        value: 'series_asc',
        label: 'Series: A-Z',
        compareFn: (a, b) => seriesDifference(a.metadata, b.metadata),
    },
    {
        value: 'series_desc',
        label: 'Series: Z-A',
        compareFn: (a, b) => seriesDifference(b.metadata, a.metadata),
    },
    {
        value: 'author_asc',
        label: 'Author: A-Z',
        compareFn: (a, b) =>
            stringDifference(stringValue(a.metadata.authors?.[0]), stringValue(b.metadata.authors?.[0])),
    },
    {
        value: 'author_desc',
        label: 'Author: Z-A',
        compareFn: (a, b) =>
            stringDifference(stringValue(b.metadata.authors?.[0]), stringValue(a.metadata.authors?.[0])),
    },
    {
        value: 'reading_progress_desc',
        label: 'Reading progress: Newest-Oldest',
        compareFn: (a, b) =>
            numberDifference(b.readingJourney.lastItem()?.date.getTime(), a.readingJourney.lastItem()?.date.getTime()),
    },
    {
        value: 'reading_progress_asc',
        label: 'Reading progress: Oldest-Newest',
        compareFn: (a, b) =>
            numberDifference(a.readingJourney.lastItem()?.date.getTime(), b.readingJourney.lastItem()?.date.getTime()),
    },
    {
        value: 'pages_asc',
        label: 'Pages: Low-High',
        compareFn: (a, b) => numberDifference(a.metadata.pages, b.metadata.pages),
    },
    {
        value: 'pages_desc',
        label: 'Pages: High-Low',
        compareFn: (a, b) => numberDifference(b.metadata.pages, a.metadata.pages),
    },
]
