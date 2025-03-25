import type { Meta, StoryObj } from '@storybook/react'
import { TagCloud } from './tag-cloud'

const meta = {
    title: 'Tag Cloud',
    component: TagCloud,
} satisfies Meta<typeof TagCloud>

export default meta
type Story = StoryObj<typeof TagCloud>

export const Primary: Story = {
    args: {
        tags: {
            fantasy: 2,
            scifi: 3,
            'young-adult': 4,
            book: 0,
            fiction: 1,
            dystopian: 6,
            'non-fiction': 5,
            litfic: 8,
            horror: 10,
            programming: 7,
            romance: 9,
            shortstory: 5,
            favorite: 3,
            'want-to-read': 6,
            dnf: 2,
        },
    },
}
