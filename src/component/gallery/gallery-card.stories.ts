import type { Meta, StoryObj } from '@storybook/react'
import { GalleryCard } from './gallery-card'
import { fn } from 'storybook/test'
import { books } from '../../support/book-fixtures'

const meta = {
    title: 'Gallery Card',
    component: GalleryCard,
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof GalleryCard>

export default meta
type Story = StoryObj<typeof GalleryCard>

export const Primary: Story = {
    args: {
        book: books.algorithms,
    },
}

export const NoCover: Story = {
    args: {
        book: books.bookWithoutMetadata,
    },
}
