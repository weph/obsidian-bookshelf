import type { Meta, StoryObj } from '@storybook/html'
import './book-details'
import { BookDetailsProps } from './book-details'
import { BookBuilder } from '../../support/book-builder'

const meta = {
    title: 'Book Details',
    render: (args) => {
        const element = document.createElement('bookshelf-book-details')

        Object.assign(element, args)

        return element
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
            .build(),
    },
}

export const Empty: Story = {
    args: {
        book: new BookBuilder().with('title', 'Book With Just A Title').build(),
    },
}
