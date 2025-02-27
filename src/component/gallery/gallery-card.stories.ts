import type { Meta, StoryObj } from '@storybook/html'
import { GalleryCard } from './gallery-card'
import './gallery-card'

const meta = {
    title: 'Gallery Card',
    tags: ['autodocs'],
    render: (args) => {
        const element = document.createElement('bookshelf-gallery-card')

        for (const [attr, value] of Object.entries(args)) {
            element.setAttribute(attr, value)
        }

        return element
    },
} satisfies Meta<GalleryCard>

export default meta
type Story = StoryObj<GalleryCard>

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
