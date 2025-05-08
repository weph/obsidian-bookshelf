import { DropdownOption } from '../dropdown/dropdown'
import { Book } from '../../bookshelf/book/book'
import { Link } from '../../bookshelf/book/link'

export interface GroupedBooks {
    groups: Map<string | null, Array<Book>>
    nullLabel: string
}

export interface GroupingDropdownOption extends DropdownOption<string | null> {
    grouped?: (books: Array<Book>) => GroupedBooks
}

export const bookGroupingOptions: Array<GroupingDropdownOption> = [
    {
        value: null,
        label: 'Ungrouped',
    },
    {
        value: 'alphabetically',
        label: 'Alphabetically',
        grouped: (books) => ({
            groups: grouped(books, (b) => [b.metadata.title[0].toUpperCase()], 'asc'),
            nullLabel: 'Other',
        }),
    },
    {
        value: 'list',
        label: 'List',
        grouped: (books) => ({
            groups: grouped(books, (b) => (b.metadata.lists.length > 0 ? b.metadata.lists : [null]), 'asc'),
            nullLabel: 'No list assigned',
        }),
    },
    {
        value: 'series',
        label: 'Series',
        grouped: (books) => ({
            groups: grouped(books, (b) => [seriesName(b)], 'asc'),
            nullLabel: 'Not part of a series',
        }),
    },
    {
        value: 'author',
        label: 'Author',
        grouped: (books) => ({
            groups: grouped(
                books,
                (b) => b.metadata.authors.map((a) => (a instanceof Link ? a.displayText : a)),
                'asc',
            ),
            nullLabel: 'Author unknown',
        }),
    },
    {
        value: 'year',
        label: 'Year',
        grouped: (books) => ({
            groups: grouped(books, (b) => [b.metadata.published?.getFullYear().toString() || null], 'desc'),
            nullLabel: 'Publication date unknown',
        }),
    },
    {
        value: 'rating',
        label: 'Rating',
        grouped: (books) => ({
            groups: grouped(books, (b) => [b.metadata.rating ? `${b.metadata.rating.toFixed(1)} stars` : null], 'desc'),
            nullLabel: 'Not yet rated',
        }),
    },
]

function seriesName(book: Book): string | null {
    const series = book.metadata.series
    if (series === undefined) {
        return null
    }

    if (series.name instanceof Link) {
        return series.name.displayText
    }

    return series.name
}

function grouped(
    books: Array<Book>,
    groups: (book: Book) => Array<string | null>,
    order: 'asc' | 'desc',
): Map<string | null, Array<Book>> {
    const result = new Map<string | null, Array<Book>>()

    for (const book of books) {
        for (const group of groups(book)) {
            if (!result.has(group)) {
                result.set(group, [])
            }

            result.get(group)?.push(book)
        }
    }

    return new Map(
        [...result].sort((a, b) => {
            const aTitle = a[0]
            const bTitle = b[0]

            if (aTitle === null) {
                return 1
            }

            if (bTitle === null) {
                return -1
            }

            return order === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle)
        }),
    )
}
