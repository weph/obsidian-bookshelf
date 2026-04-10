import { DropdownOption } from '../dropdown/dropdown'
import * as grouping from '../../bookshelf/book/grouping'
import { Books } from '../../bookshelf/book/books'

export interface GroupingDropdownOption extends DropdownOption<string | null> {
    grouped?: (books: Books) => grouping.GroupedBooks
}

export const bookGroupingOptions: Array<GroupingDropdownOption> = [
    {
        value: null,
        label: 'Ungrouped',
    },
    {
        value: 'alphabetically',
        label: 'Alphabetically',
        grouped: grouping.groupedAlphabetically,
    },
    {
        value: 'list',
        label: 'List',
        grouped: grouping.groupedByList,
    },
    {
        value: 'genre',
        label: 'Genre',
        grouped: grouping.groupedByGenre,
    },
    {
        value: 'series',
        label: 'Series',
        grouped: grouping.groupedBySeries,
    },
    {
        value: 'author',
        label: 'Author',
        grouped: grouping.groupedByAuthor,
    },
    {
        value: 'year',
        label: 'Year',
        grouped: grouping.groupedByPublicationYear,
    },
    {
        value: 'rating',
        label: 'Rating',
        grouped: grouping.groupedByRating,
    },
    {
        value: 'tag',
        label: 'Tag',
        grouped: grouping.groupedByTag,
    },
]
