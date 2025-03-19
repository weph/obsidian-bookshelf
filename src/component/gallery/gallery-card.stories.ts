import type { Meta, StoryObj } from '@storybook/react'
import { GalleryCard } from './gallery-card'
import { fn } from '@storybook/test'

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
        title: 'Animal Farm',
        cover: '/covers/animal-farm.jpg',
    },
}

export const NoCover: Story = {
    args: {
        title: 'Animal Farm',
    },
}
