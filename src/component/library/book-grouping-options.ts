import { DropdownOption } from '../dropdown/dropdown'
import { Book } from '../../bookshelf/book/book'
import { Link } from '../../bookshelf/book/link'

export interface GroupingDropdownOption extends DropdownOption<string | null> {
    grouped?: (books: Array<Book>) => Map<string | null, Array<Book>>
}

export const bookGroupingOptions: Array<GroupingDropdownOption> = [
    {
        value: null,
        label: 'Ungrouped',
    },
    {
        value: 'alphabetically',
        label: 'Alphabetically',
        grouped: (books) => grouped(books, (b) => [b.metadata.title[0].toUpperCase()], 'asc'),
    },
    {
        value: 'list',
        label: 'List',
        grouped: (books) => grouped(books, (b) => (b.metadata.lists.length > 0 ? b.metadata.lists : [null]), 'asc'),
    },
    {
        value: 'series',
        label: 'Series',
        grouped: (books) =>
            grouped(
                books,
                (b) => [b.metadata.series instanceof Link ? b.metadata.series.displayText : b.metadata.series || null],
                'asc',
            ),
    },
    {
        value: 'author',
        label: 'Author',
        grouped: (books) =>
            grouped(books, (b) => b.metadata.authors.map((a) => (a instanceof Link ? a.displayText : a)), 'asc'),
    },
    {
        value: 'year',
        label: 'Year',
        grouped: (books) => grouped(books, (b) => [b.metadata.published?.getFullYear().toString() || null], 'desc'),
    },
    {
        value: 'rating',
        label: 'Rating',
        grouped: (books) =>
            grouped(books, (b) => [b.metadata.rating ? `${b.metadata.rating.toFixed(1)} stars` : '0 stars'], 'desc'),
    },
]

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
