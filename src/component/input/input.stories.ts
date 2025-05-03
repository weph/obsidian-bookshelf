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

export const Error: Story = {
    args: {
        value: 'invalid value',
        error: true,
    },
}

export const ClearableWithoutValue: Story = {
    args: {
        value: '',
        clearable: true,
    },
}

export const ClearableWithValue: Story = {
    args: {
        value: 'value',
        clearable: true,
    },
}

export const SearchWithPlaceholder: Story = {
    args: {
        type: 'search',
        placeholder: 'Placeholder',
    },
}
