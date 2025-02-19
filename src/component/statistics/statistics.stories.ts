import type { Meta, StoryObj } from '@storybook/html'
import './statistics'
import { StatisticsProps } from './statistics'
import { Bookshelf } from '../../bookshelf'
import { BookMetadataFactory } from '../../book-metadata-factory'
import { PatternCollection } from '../../reading-journey/pattern/pattern-collection'
import { BookNoteActionPattern } from '../../reading-journey/pattern/book-note/book-note-action-pattern'
import { BookNoteRelativeProgressPattern } from '../../reading-journey/pattern/book-note/book-note-relative-progress-pattern'
import { DailyNoteActionPattern } from '../../reading-journey/pattern/daily-note/daily-note-action-pattern'
import { DailyNoteAbsoluteProgressPattern } from '../../reading-journey/pattern/daily-note/daily-note-absolute-progress-pattern'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../../metadata/metadata'

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
    {
        enabled: true,
        format: 'YYYY-MM-DD',
        folder: null,
    },
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
        new BookNoteRelativeProgressPattern('{date}: {startPage}-{endPage}', 'yyyy-MM-dd'),
        new BookNoteRelativeProgressPattern('{date}: {endPage}', 'yyyy-MM-dd'),
    ]),
    new PatternCollection([
        new DailyNoteActionPattern('Started reading {book}', 'started'),
        new DailyNoteActionPattern('Abandoned {book}', 'abandoned'),
        new DailyNoteActionPattern('Finished reading {book}', 'finished'),
        new DailyNoteAbsoluteProgressPattern('Read {book}: {startPage}-{endPage}'),
        new DailyNoteAbsoluteProgressPattern('Read {book}: {endPage}'),
    ]),
    (identifier) => identifier,
)

bookshelf.process(
    new FakeNote('Books/Book.md', new StaticMetadata({}), [
        '2025-01-01: 1-50',
        '2025-01-02: 51-110',
        '2025-02-01: 111-130',
        '2025-03-05: 131-200',
        '2025-03-06: 201-240',
    ]),
)

export const Primary: Story = {
    args: {
        bookshelf,
    },
}

export const Empty: Story = {}
