import type { Meta, StoryObj } from '@storybook/html'
import { GalleryCardProps } from './gallery-card'
import './gallery-card'

const meta = {
    title: 'Gallery Card',
    tags: ['autodocs'],
    render: (args) => {
        const element = document.createElement('bookshelf-gallery-card')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<GalleryCardProps>

export default meta
type Story = StoryObj<GalleryCardProps>

export const Primary: Story = {
    args: {
        title: 'Animal Farm',
    },
}
