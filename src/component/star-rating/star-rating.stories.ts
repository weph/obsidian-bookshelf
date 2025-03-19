import type { Meta, StoryObj } from '@storybook/react'
import { StarRating } from './star-rating'

const meta = {
    title: 'UI/Star Rating',
    component: StarRating,
} satisfies Meta<typeof StarRating>

export default meta
type Story = StoryObj<typeof StarRating>

export const Primary: Story = {
    args: {
        value: 5,
    },
}
