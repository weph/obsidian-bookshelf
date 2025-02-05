import type { Meta, StoryObj } from '@storybook/html'
import './reading-progress-bar-chart'
import { ReadingProgressBarChartProps } from './reading-progress-bar-chart'

const meta = {
    title: 'Reading Progress Bar Chart',
    render: (args) => {
        const element = document.createElement('bookshelf-reading-progress-bar-chart')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<ReadingProgressBarChartProps>

export default meta
type Story = StoryObj<ReadingProgressBarChartProps>

const book = { title: 'Book' }

export const Primary: Story = {
    args: {
        readingProgress: [
            { date: new Date(2024, 0, 1), book, previous: null, startPage: 1, endPage: 10, pages: 10 },
            { date: new Date(2024, 0, 2), book, previous: null, startPage: 11, endPage: 30, pages: 20 },
            { date: new Date(2024, 0, 3), book, previous: null, startPage: 31, endPage: 60, pages: 30 },
            { date: new Date(2024, 0, 4), book, previous: null, startPage: 61, endPage: 65, pages: 5 },
            { date: new Date(2024, 0, 5), book, previous: null, startPage: 66, endPage: 90, pages: 25 },
        ],
    },
}

export const Empty: Story = {}
