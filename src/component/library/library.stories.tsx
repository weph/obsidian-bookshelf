import type { Meta, StoryObj } from '@storybook/react'
import { Book } from '../../bookshelf/book'
import { algorithms, books } from '../../support/book-fixtures'
import { Library } from './library'
import { defaultBookSortOptions } from '../../bookshelf/sort/default-book-sort-options'
import { fn } from '@storybook/test'

const meta = {
    title: 'Library',
} satisfies Meta<typeof Library>

export default meta
type Story = StoryObj<typeof Library>

function renderFunction(books: Array<Book>) {
    return () => <Library books={books} sortOptions={defaultBookSortOptions()} onBookClick={fn()} />
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
