import type { Meta, StoryObj } from '@storybook/react'
import { BookBuilder } from '../../support/book-builder'
import { fn } from '@storybook/test'
import { tddByExample } from '../../support/book-fixtures'
import { Book } from '../../bookshelf/book/book'
import { BookDetails } from './book-details'

const meta = {
    title: 'Book Details',
} satisfies Meta<typeof BookDetails>

export default meta
type Story = StoryObj<typeof BookDetails>

function renderFunction(book: Book) {
    return () => (
        <div style={{ maxWidth: '550px' }}>
            <BookDetails book={book} openNote={fn()} addProgress={async () => {}} />
        </div>
    )
}

export const Primary: Story = {
    render: renderFunction(tddByExample),
}

export const Empty: Story = {
    render: renderFunction(new BookBuilder().with('title', 'Book With Just A Title').build()),
}
