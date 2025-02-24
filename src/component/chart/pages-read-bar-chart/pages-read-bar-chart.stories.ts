import type { Meta, StoryObj } from '@storybook/html'
import './pages-read-bar-chart'
import { PagesReadBarChartProps } from './pages-read-bar-chart'

const meta = {
    title: 'Chart/Pages Read Bar Chart',
    render: (args) => {
        const element = document.createElement('bookshelf-pages-read-bar-chart')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<PagesReadBarChartProps>

export default meta
type Story = StoryObj<PagesReadBarChartProps>

export const Primary: Story = {
    args: {
        data: new Map([
            [new Date(2025, 0, 1), 100],
            [new Date(2025, 0, 2), 300],
            [new Date(2025, 0, 3), 50],
            [new Date(2025, 0, 4), 90],
            [new Date(2025, 0, 5), 190],
        ]),
        xAxisUnit: 'day',
    },
}
