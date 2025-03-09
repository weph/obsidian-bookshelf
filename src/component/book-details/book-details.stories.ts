import type { Meta, StoryObj } from '@storybook/html'
import './book-details'
import { BookDetails } from './book-details'
import { BookBuilder } from '../../support/book-builder'
import { fn } from '@storybook/test'
import { tddByExample } from '../../support/book-fixtures'
import { Book } from '../../bookshelf/book'

const meta = {
    title: 'Book Details',
} satisfies Meta<BookDetails>

export default meta
type Story = StoryObj<BookDetails>

function renderFunction(book: Book) {
    return () => {
        const element = document.createElement('bookshelf-book-details')
        element.openNote = fn()
        element.book = book

        return element
    }
}

export const Primary: Story = {
    render: renderFunction(tddByExample),
}

export const Empty: Story = {
    render: renderFunction(new BookBuilder().with('title', 'Book With Just A Title').build()),
}
