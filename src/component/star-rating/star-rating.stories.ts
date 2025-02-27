import type { Meta, StoryObj } from '@storybook/html'
import './star-rating'
import { StarRating } from './star-rating'

const meta = {
    title: 'UI/Star Rating',
    render: (args) => {
        const element = document.createElement('bookshelf-ui-star-rating')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<StarRating>

export default meta
type Story = StoryObj<StarRating>

export const Primary: Story = {
    args: {
        value: 5,
    },
}
