import type { Meta, StoryObj } from '@storybook/react'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { BookMetadataFactory } from '../../bookshelf/metadata/book-metadata-factory'
import { FakeNote } from '../../support/fake-note'
import { StaticMetadata } from '../../bookshelf/metadata/metadata'
import { bookNotePatterns } from '../../bookshelf/reading-journey/pattern/book-note/book-note-pattern'
import { dailyNotePatterns } from '../../bookshelf/reading-journey/pattern/daily-note/daily-note-pattern'
import { Statistics } from './statistics'
import { fn } from '@storybook/test'

const meta = {
    title: 'Statistics',
} satisfies Meta<typeof Statistics>

export default meta
type Story = StoryObj<typeof Statistics>

const bookshelf = new Bookshelf(
    'Books',
    {
        heading: 'Reading Journey',
        format: 'YYYY-MM-DD',
        folder: '',
    },
    {
        heading: 'Reading',
    },
    new BookMetadataFactory(
        {
            cover: 'cover',
            author: 'author',
            published: 'published',
            tags: 'tags',
            rating: 'rating',
        },
        (link) => link,
    ),
    bookNotePatterns(
        {
            started: '{date}: Started reading',
            abandoned: '{date}: Abandoned book',
            finished: '{date}: Finished reading',
            absoluteProgress: '{date}: {startPage}-{endPage}',
            relativeProgress: '{date}: {endPage}',
        },
        'yyyy-MM-dd',
    ).patterns,
    dailyNotePatterns({
        started: 'Started reading {book}',
        abandoned: 'Abandoned {book}',
        finished: 'Finished reading {book}',
        absoluteProgress: 'Read {book}: {startPage}-{endPage}',
        relativeProgress: 'Read {book}: {endPage}',
    }).patterns,
    (identifier) => identifier,
)

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
