import { Book } from './book'
import { Books } from './books'

export interface GroupedBooks {
    groups: Map<string | null, Books>
    nullLabel: string
}

export function groupedAlphabetically(books: Books): GroupedBooks {
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

export function groupedByList(books: Books): GroupedBooks {
    return {
        groups: grouped(books, (b) => (b.metadata.lists.length > 0 ? b.metadata.lists : [null]), 'asc'),
        nullLabel: 'No list assigned',
    }
}

export function groupedByGenre(books: Books): GroupedBooks {
    return {
        groups: grouped(
            books,
            (b) => {
                const genres = b.metadata.genre ?? []

                return genres.length > 0 ? genres : [null]
            },
            'asc',
        ),
        nullLabel: 'No genres assigned',
    }
}

export function groupedByTag(books: Books): GroupedBooks {
    return {
        groups: grouped(
            books,
            (b) => {
                const tags = b.metadata.tags ?? []

                return tags.length > 0 ? tags : [null]
            },
            'asc',
        ),
        nullLabel: 'No tags assigned',
    }
}

export function groupedBySeries(books: Books): GroupedBooks {
    function seriesName(book: Book): string | null {
        const series = book.metadata.series
        if (series === undefined) {
            return null
        }

        return series.name.toString()
    }

    return {
        groups: grouped(books, (b) => [seriesName(b)], 'asc'),
        nullLabel: 'Not part of a series',
    }
}

export function groupedByAuthor(books: Books): GroupedBooks {
    function authors(book: Book): Array<string | null> {
        const authors = book.metadata.authors

        if (authors.length === 0) {
            return [null]
        }

        return authors.map((a) => a.toString())
    }

    return {
        groups: grouped(books, authors, 'asc'),
        nullLabel: 'Author unknown',
    }
}

export function groupedByPublicationYear(books: Books): GroupedBooks {
    return {
        groups: grouped(books, (b) => [b.metadata.published?.getFullYear().toString() || null], 'desc'),
        nullLabel: 'Publication date unknown',
    }
}

export function groupedByRating(books: Books): GroupedBooks {
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
    books: Books,
    groups: (book: Book) => Array<string | null>,
    order: 'asc' | 'desc',
): Map<string | null, Books> {
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
        [...result]
            .map((item): [string | null, Books] => [item[0], new Books(item[1])])
            .sort((a, b) => {
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
