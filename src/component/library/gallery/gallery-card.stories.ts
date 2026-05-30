import type { Meta, StoryObj } from '@storybook/react'
import { GalleryCard } from './gallery-card'
import { fn } from 'storybook/test'
import { books } from '../../../support/book-fixtures'

const meta = {
    title: 'Library/Gallery/Card',
    component: GalleryCard,
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof GalleryCard>

export default meta
type Story = StoryObj<typeof GalleryCard>

export const Primary: Story = {
    args: {
        item: {
            book: books.tddByExample,
            fields: [
                {
                    name: 'Comment',
                    renderTo: (e) => (e.innerText = books.tddByExample.metadata.comment || ''),
                },
            ],
        },
    },
}

export const Abandoned: Story = {
    args: {
        item: {
            book: books.mythicalManMonth,
            fields: [],
        },
    },
}

export const NoCover: Story = {
    args: {
        item: {
            book: books.bookWithoutMetadata,
            fields: [],
        },
    },
}
