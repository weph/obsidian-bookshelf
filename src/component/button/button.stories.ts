import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
    title: 'UI/Button',
    component: Button,
    args: {
        text: 'Button',
    },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}
