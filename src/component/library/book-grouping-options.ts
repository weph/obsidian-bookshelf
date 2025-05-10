import { DropdownOption } from '../dropdown/dropdown'
import { Book } from '../../bookshelf/book/book'
import * as grouping from '../../bookshelf/book/grouping'

export interface GroupingDropdownOption extends DropdownOption<string | null> {
    grouped?: (books: Array<Book>) => grouping.GroupedBooks
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
]
