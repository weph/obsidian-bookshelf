import type { Meta, StoryObj } from '@storybook/html'
import { Gallery } from './gallery'
import './gallery'
import { fn } from '@storybook/test'
import { algorithms, books } from '../../support/book-fixtures'
import { Book } from '../../bookshelf/book'

const meta = {
    title: 'Gallery',
} satisfies Meta<Gallery>

export default meta
type Story = StoryObj<Gallery>

function renderFunction(books: Array<Book>) {
    return () => {
        const element = document.createElement('bookshelf-gallery')
        element.onBookClick = fn()
        element.books = books

        return element
    }
}

export const Primary: Story = {
    render: renderFunction(Object.values(books)),
}

export const Empty: Story = {
    render: renderFunction([]),
}

export const SingleBook: Story = {
    render: renderFunction([algorithms]),
}
