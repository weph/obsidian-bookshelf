import type { Meta, StoryObj } from '@storybook/react'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../../bookshelf/metadata/metadata'
import { Statistics } from './statistics'
import { fn } from '@storybook/test'
import { BookshelfFactory } from '../../bookshelf/bookshelf-factory'
import { InMemoryNotes } from '../../support/in-memory-notes'

const meta = {
    title: 'Statistics',
} satisfies Meta<typeof Statistics>

export default meta
type Story = StoryObj<typeof Statistics>

const bookshelf = BookshelfFactory.fromConfiguration({
    settings: {
        booksFolder: 'Books',
        bookProperties: {
            cover: 'cover',
            author: 'author',
            published: 'published',
            tags: 'tags',
            rating: 'rating',
        },
        bookNote: {
            enabled: true,
            heading: 'Reading Journey',
            dateFormat: 'yyyy-MM-dd',
            patterns: {
                started: '{date}: Started reading',
                abandoned: '{date}: Abandoned book',
                finished: '{date}: Finished reading',
                absoluteProgress: '{date}: {startPage}-{endPage}',
                relativeProgress: '{date}: {endPage}',
            },
        },
        dailyNote: {
            enabled: true,
            heading: 'Reading',
            patterns: {
                started: 'Started reading {book}',
                abandoned: 'Abandoned {book}',
                finished: 'Finished reading {book}',
                absoluteProgress: 'Read {book}: {startPage}-{endPage}',
                relativeProgress: 'Read {book}: {endPage}',
            },
        },
        readingProgress: {
            newEntryLocation: 'bookNote',
        },
    },
    dailyNotesSettings: {
        enabled: true,
        format: 'YYYY-MM-DD',
        folder: '',
    },
    notes: new InMemoryNotes(),
    linkToUri: (link) => link,
})

bookshelf.process(
    new FakeNote(
        'Books/Book.md',
        new StaticMetadata({
            tags: ['fiction', 'fantasy'],
        }),
        ['2025-01-01: 1-50', '2025-01-02: 51-110', '2025-02-01: 111-130', '2025-03-05: 131-200', '2025-03-06: 201-240'],
    ),
)

export const Primary: Story = {
    render: () => <Statistics bookshelf={bookshelf} onBookClick={fn()} />,
}
