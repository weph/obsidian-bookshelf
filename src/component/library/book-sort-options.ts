import { DropdownOption } from '../dropdown/dropdown'
import { Book } from '../../bookshelf/book'

function stringDifference(a: string | undefined, b: string | undefined): number {
    return (a || '').localeCompare(b || '')
}

function numberDifference(a: number | undefined, b: number | undefined): number {
    return (a || 0) - (b || 0)
}

export interface SortDropdownOption extends DropdownOption<string> {
    compareFn(a: Book, b: Book): number
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
        value: 'author_asc',
        label: 'Author: A-Z',
        compareFn: (a, b) => stringDifference(a.metadata.authors?.[0], b.metadata.authors?.[0]),
    },
    {
        value: 'author_desc',
        label: 'Author: Z-A',
        compareFn: (a, b) => stringDifference(b.metadata.authors?.[0], a.metadata.authors?.[0]),
    },
    {
        value: 'reading_progress_desc',
        label: 'Reading progress: Newest-Oldest',
        compareFn: (a, b) =>
            stringDifference(
                b.readingJourney.lastItem()?.date.toUTCString(),
                a.readingJourney.lastItem()?.date.toUTCString(),
            ),
    },
    {
        value: 'reading_progress_asc',
        label: 'Reading progress: Oldest-Newest',
        compareFn: (a, b) =>
            stringDifference(
                a.readingJourney.lastItem()?.date.toUTCString(),
                b.readingJourney.lastItem()?.date.toUTCString(),
            ),
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
