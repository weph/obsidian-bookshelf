import type { Meta, StoryObj } from '@storybook/react'
import { TagList } from './tag-list'

const meta = {
    title: 'UI/Tag List',
    component: TagList,
    args: {
        tags: [
            'fantasy',
            'scifi',
            'young-adult',
            'book',
            'fiction',
            'dystopian',
            'non-fiction',
            'litfic',
            'horror',
            'programming',
            'romance',
            'shortstory',
            'favorite',
            'want-to-read',
            'dnf',
        ],
    },
} satisfies Meta<typeof TagList>

export default meta
type Story = StoryObj<typeof TagList>

export const Primary: Story = {}
