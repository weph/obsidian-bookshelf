import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Dropdown } from './dropdown'

const meta = {
    title: 'UI/Dropdown',
    component: Dropdown,
    args: {
        onChange: fn(),
    },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof Dropdown>

export const Primary: Story = {
    args: {
        options: [
            { value: 'foo', label: 'Foo' },
            { value: 'bar', label: 'Bar' },
        ],
    },
}

export const PreselectedValue: Story = {
    args: {
        options: [
            { value: 'foo', label: 'Foo' },
            { value: 'bar', label: 'Bar' },
        ],
        value: 'bar',
    },
}

export const DisabledOption: Story = {
    args: {
        options: [
            { value: 'foo', label: 'Foo', disabled: false },
            { value: 'bar', label: 'Bar', disabled: true },
        ],
        value: 'bar',
    },
}
