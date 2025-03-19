import type { Meta, StoryObj } from '@storybook/react'
import { Gallery } from './gallery'
import { algorithms, books } from '../../support/book-fixtures'
import { fn } from '@storybook/test'
import { Book } from '../../bookshelf/book'

const meta = {
    title: 'Gallery',
    component: Gallery,
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof Gallery>

function renderFunction(books: Array<Book>) {
    return () => <Gallery books={books} onBookClick={fn()} />
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
