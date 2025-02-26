import type { Meta, StoryObj } from '@storybook/html'
import './pages-read-bar-chart'
import { PagesReadBarChart } from './pages-read-bar-chart'

const meta = {
    title: 'Chart/Pages Read Bar Chart',
    render: (args) => {
        const element = document.createElement('bookshelf-pages-read-bar-chart')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<PagesReadBarChart>

export default meta
type Story = StoryObj<PagesReadBarChart>

export const Primary: Story = {
    args: {
        data: [
            { x: new Date(2025, 0, 1).getTime(), y: 100 },
            { x: new Date(2025, 0, 2).getTime(), y: 300 },
            { x: new Date(2025, 0, 3).getTime(), y: 50 },
            { x: new Date(2025, 0, 4).getTime(), y: 90 },
            { x: new Date(2025, 0, 5).getTime(), y: 190 },
        ],
        xAxisUnit: 'day',
    },
}
