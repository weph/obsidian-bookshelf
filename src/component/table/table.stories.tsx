import type { Meta, StoryObj } from '@storybook/react'
import { BookTable } from './table'
import { Book } from '../../bookshelf/book/book'
import { algorithms, books } from '../../support/book-fixtures'
import { action } from 'storybook/actions'

const meta = {
    title: 'Table',
} satisfies Meta<typeof BookTable>

export default meta
type Story = StoryObj<typeof BookTable>

function renderFunction(books: Array<Book>) {
    return () => <BookTable books={books} onBookClick={action('onBookClick')} />
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
