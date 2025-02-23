import type { Meta, StoryObj } from '@storybook/html'
import './book-details'
import { BookDetailsProps } from './book-details'
import { BookBuilder } from '../../support/book-builder'
import { fn } from '@storybook/test'

const meta = {
    title: 'Book Details',
    render: (args) => {
        const element = document.createElement('bookshelf-book-details')

        Object.assign(element, args)

        return element
    },
    args: {
        openNote: fn(),
    },
} satisfies Meta<BookDetailsProps>

export default meta
type Story = StoryObj<BookDetailsProps>

export const Primary: Story = {
    args: {
        book: new BookBuilder()
            .with('title', 'Test-Driven Development by Example')
            .with('cover', '/covers/test-driven-development-by-example.jpg')
            .with('authors', ['Kent Beck'])
            .with('published', new Date(2002, 0, 1))
            .with('rating', 3.5)
            .withReadingProgress(new Date(2025, 0, 1), 1, 10)
            .withReadingProgress(new Date(2025, 0, 2), 11, 50)
            .withReadingProgress(new Date(2025, 0, 3), 51, 100)
            .withReadingProgress(new Date(2025, 0, 4), 101, 120)
            .withReadingProgress(new Date(2025, 0, 5), 121, 190)
            .withReadingProgress(new Date(2025, 0, 6), 191, 220)
            .build(),
    },
}

export const Empty: Story = {
    args: {
        book: new BookBuilder().with('title', 'Book With Just A Title').build(),
    },
}
