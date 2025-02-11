import type { Meta, StoryObj } from '@storybook/html'
import './dropdown'
import { DropdownProps } from './dropdown'
import { fn } from '@storybook/test'

const meta = {
    title: 'UI/Dropdown',
    args: {
        onChange: fn(),
    },
    render: (args) => {
        const element = document.createElement('bookshelf-ui-dropdown')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<DropdownProps<string>>

export default meta
type Story = StoryObj<DropdownProps<string>>

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
