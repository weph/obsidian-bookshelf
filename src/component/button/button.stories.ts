import type { Meta, StoryObj } from '@storybook/html'
import './button'
import { ButtonProps } from './button'

const meta = {
    title: 'UI/Button',
    args: {
        text: 'Button',
    },
    render: (args) => {
        const element = document.createElement('bookshelf-ui-button')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<ButtonProps>

export default meta
type Story = StoryObj<ButtonProps>

export const Primary: Story = {}
