import type { Meta, StoryObj } from '@storybook/html'
import './star-rating'
import { StarRatingProps } from './star-rating'

const meta = {
    title: 'UI/Star Rating',
    render: (args) => {
        const element = document.createElement('bookshelf-ui-star-rating')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<StarRatingProps>

export default meta
type Story = StoryObj<StarRatingProps>

export const Primary: Story = {
    args: {
        value: 5,
    },
}
