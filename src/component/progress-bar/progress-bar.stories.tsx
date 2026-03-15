import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './progress-bar'

const meta = {
    title: 'UI/Progress Bar',
    component: ProgressBar,
    args: {
        percentage: 75,
    },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Primary: Story = {}
