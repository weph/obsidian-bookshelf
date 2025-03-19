import type { Meta, StoryObj } from '@storybook/react'
import { PagesReadBarChart } from './pages-read-bar-chart'

const meta = {
    title: 'Chart/Pages Read Bar Chart',
    component: PagesReadBarChart,
} satisfies Meta<typeof PagesReadBarChart>

export default meta
type Story = StoryObj<typeof PagesReadBarChart>

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
