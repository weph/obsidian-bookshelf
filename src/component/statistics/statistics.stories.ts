import type { Meta, StoryObj } from '@storybook/html'
import './statistics'
import { StatisticsProps } from './statistics'
import { Bookshelf } from '../../bookshelf'
import { BookMetadataFactory } from '../../book-metadata-factory'
import { PatternCollection } from '../../reading-journey/pattern/pattern-collection'
import { BookNoteActionPattern } from '../../reading-journey/pattern/book-note/book-note-action-pattern'
import { BookNoteProgressPattern } from '../../reading-journey/pattern/book-note/book-note-progress-pattern'
import { DailyNoteActionPattern } from '../../reading-journey/pattern/daily-note/daily-note-action-pattern'
import { DailyNoteProgressPattern } from '../../reading-journey/pattern/daily-note/daily-note-progress-pattern'

const meta = {
    title: 'Statistics',
    render: (args) => {
        const element = document.createElement('bookshelf-statistics')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<StatisticsProps>

export default meta
type Story = StoryObj<StatisticsProps>

const bookshelf = new Bookshelf(
    'Books',
    new BookMetadataFactory(
        {
            cover: 'cover',
            author: 'author',
            published: 'published',
            tags: 'tags',
        },
        (link) => link,
    ),
    new PatternCollection([
        new BookNoteActionPattern('{date}: Started reading', 'started', 'yyyy-MM-dd'),
        new BookNoteActionPattern('{date}: Abandoned book', 'abandoned', 'yyyy-MM-dd'),
        new BookNoteActionPattern('{date}: Finished reading', 'finished', 'yyyy-MM-dd'),
        new BookNoteProgressPattern('{date}: {startPage}-{endPage}', 'yyyy-MM-dd'),
        new BookNoteProgressPattern('{date}: {endPage}', 'yyyy-MM-dd'),
    ]),
    new PatternCollection([
        new DailyNoteActionPattern('Started reading {book}', 'started'),
        new DailyNoteActionPattern('Abandoned {book}', 'abandoned'),
        new DailyNoteActionPattern('Finished reading {book}', 'finished'),
        new DailyNoteProgressPattern('Read {book}: {startPage}-{endPage}'),
        new DailyNoteProgressPattern('Read {book}: {endPage}'),
    ]),
    (identifier) => identifier,
)
bookshelf.add('book', { title: 'Book' })
bookshelf.addReadingProgress(new Date(2025, 0, 1), 'book', 50, 1, '')
bookshelf.addReadingProgress(new Date(2025, 0, 2), 'book', 110, 51, '')
bookshelf.addReadingProgress(new Date(2025, 1, 1), 'book', 130, 111, '')
bookshelf.addReadingProgress(new Date(2025, 2, 5), 'book', 200, 141, '')
bookshelf.addReadingProgress(new Date(2025, 2, 6), 'book', 240, 201, '')

export const Primary: Story = {
    args: {
        bookshelf,
    },
}

export const Empty: Story = {}
