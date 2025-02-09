import type { Meta, StoryObj } from '@storybook/html'
import './statistics'
import { StatisticsProps } from './statistics'
import { AbsoluteReadingProgress } from '../../reading-progress'
import { BookBuilder } from '../../support/book-builder'

const meta = {
    title: 'Statistics',
    render: (args) => {
        const element = document.createElement('bookshelf-statistics')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<StatisticsProps>

export default meta
type Story = StoryObj<StatisticsProps>

const book = new BookBuilder().build()

export const Primary: Story = {
    args: {
        readingProgress: [
            new AbsoluteReadingProgress(new Date(2025, 0, 1), book, null, 1, 50),
            new AbsoluteReadingProgress(new Date(2025, 0, 2), book, null, 51, 110),
            new AbsoluteReadingProgress(new Date(2025, 0, 3), book, null, 111, 130),
            new AbsoluteReadingProgress(new Date(2025, 0, 5), book, null, 141, 200),
            new AbsoluteReadingProgress(new Date(2025, 0, 6), book, null, 201, 240),
        ],
    },
}

export const Empty: Story = {}
