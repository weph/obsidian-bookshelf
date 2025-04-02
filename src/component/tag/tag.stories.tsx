import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './tag'
import { fn } from '@storybook/test'

const meta = {
    title: 'UI/Tag',
    component: Tag,
    args: {
        value: 'Tag',
    },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof Tag>

export const Primary: Story = {}
export const Interactive: Story = {
    args: {
        value: 'Click me',
        onClick: fn(),
    },
}
