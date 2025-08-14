import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './icon'
import { SlidersHorizontal } from 'lucide-react'
import { fn } from 'storybook/test'

const meta = {
    title: 'UI/Icon',
    component: Icon,
    args: {
        icon: SlidersHorizontal,
    },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof Icon>

export const Primary: Story = {}

export const Clickable: Story = {
    args: {
        onClick: fn(),
    },
}

export const DisabledClickable: Story = {
    args: {
        onClick: fn(),
        disabled: true,
    },
}
