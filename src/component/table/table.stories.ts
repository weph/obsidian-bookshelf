import type { Meta, StoryObj } from '@storybook/html'
import { Table } from './table'
import './table'
import { fn } from '@storybook/test'
import { Book } from '../../bookshelf/book'
import { algorithms, books } from '../../support/book-fixtures'

const meta = {
    title: 'Table',
} satisfies Meta<Table>

export default meta
type Story = StoryObj<Table>

function renderFunction(books: Array<Book>) {
    return () => {
        const element = document.createElement('bookshelf-table')
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
