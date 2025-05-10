import { Book } from './book'
import { Link } from './link'

export interface GroupedBooks {
    groups: Map<string | null, Array<Book>>
    nullLabel: string
}

export function groupedAlphabetically(books: Array<Book>): GroupedBooks {
    function startingLetter(book: Book): string | null {
        const title = book.metadata.title
        if (title.length === 0) {
            return null
        }

        return title[0].toUpperCase()
    }

    return {
        groups: grouped(books, (b) => [startingLetter(b)], 'asc'),
        nullLabel: 'Other',
    }
}

export function groupedByList(books: Array<Book>): GroupedBooks {
    return {
        groups: grouped(books, (b) => (b.metadata.lists.length > 0 ? b.metadata.lists : [null]), 'asc'),
        nullLabel: 'No list assigned',
    }
}

export function groupedBySeries(books: Array<Book>): GroupedBooks {
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

    return {
        groups: grouped(books, (b) => [seriesName(b)], 'asc'),
        nullLabel: 'Not part of a series',
    }
}

export function groupedByAuthor(books: Array<Book>): GroupedBooks {
    function authors(book: Book): Array<string | null> {
        const authors = book.metadata.authors

        if (authors.length === 0) {
            return [null]
        }

        return authors.map((a) => (a instanceof Link ? a.displayText : a))
    }

    return {
        groups: grouped(books, authors, 'asc'),
        nullLabel: 'Author unknown',
    }
}

export function groupedByPublicationYear(books: Array<Book>): GroupedBooks {
    return {
        groups: grouped(books, (b) => [b.metadata.published?.getFullYear().toString() || null], 'desc'),
        nullLabel: 'Publication date unknown',
    }
}

export function groupedByRating(books: Array<Book>): GroupedBooks {
    function rating(book: Book): string | null {
        const rating = book.metadata.rating
        if (rating === undefined) {
            return null
        }

        const value = Number.isInteger(rating) ? rating : +rating.toFixed(2)

        return `${value} stars`
    }

    return {
        groups: grouped(books, (b) => [rating(b)], 'desc'),
        nullLabel: 'Not yet rated',
    }
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
