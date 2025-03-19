import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Input } from './input'

const meta = {
    title: 'UI/Input',
    component: Input,
    args: {
        onUpdate: fn(),
        type: 'text',
        placeholder: '',
    },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

export const Primary: Story = {}

export const SearchWithPlaceholder: Story = {
    args: {
        type: 'search',
        placeholder: 'Placeholder',
    },
}
