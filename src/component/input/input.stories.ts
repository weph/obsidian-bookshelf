import type { Meta, StoryObj } from '@storybook/html'
import './input'
import { fn } from '@storybook/test'
import { InputProps } from './input'

const meta = {
    title: 'UI/Input',
    args: {
        onUpdate: fn(),
        type: 'text',
        placeholder: '',
    },
    render: (args) => {
        const element = document.createElement('bookshelf-ui-input')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<InputProps>

export default meta
type Story = StoryObj<InputProps>

export const Primary: Story = {}

export const SearchWithPlaceholder: Story = {
    args: {
        type: 'search',
        placeholder: 'Placeholder',
    },
}
