import type { Meta, StoryObj } from '@storybook/html'
import './reading-progress-bar-chart'
import { ReadingProgressBarChartProps } from './reading-progress-bar-chart'
import { BookBuilder } from '../../support/book-builder'

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

const book = new BookBuilder().build()

export const Primary: Story = {
    args: {
        readingJourney: [
            { action: 'progress', date: new Date(2024, 0, 1), book, startPage: 1, endPage: 10, pages: 10, source: '' },
            { action: 'progress', date: new Date(2024, 0, 2), book, startPage: 11, endPage: 30, pages: 20, source: '' },
            { action: 'progress', date: new Date(2024, 0, 3), book, startPage: 31, endPage: 60, pages: 30, source: '' },
            { action: 'progress', date: new Date(2024, 0, 4), book, startPage: 61, endPage: 65, pages: 5, source: '' },
            { action: 'progress', date: new Date(2024, 0, 5), book, startPage: 66, endPage: 90, pages: 25, source: '' },
        ],
    },
}

export const Empty: Story = {}
