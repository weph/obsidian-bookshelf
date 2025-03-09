import type { Meta, StoryObj } from '@storybook/html'
import { Library } from './library'
import './library'
import { fn } from '@storybook/test'
import { Book } from '../../bookshelf/book'
import { defaultBookSortOptions } from '../../bookshelf/sort/default-book-sort-options'
import { algorithms, books } from '../../support/book-fixtures'

const meta = {
    title: 'Library',
} satisfies Meta<Library>

export default meta
type Story = StoryObj<Library>

function renderFunction(books: Array<Book>) {
    return () => {
        const element = document.createElement('bookshelf-library')
        element.onBookClick = fn()
        element.sortOptions = defaultBookSortOptions()
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
