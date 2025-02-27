import type { Meta, StoryObj } from '@storybook/html'
import './button'
import { Button } from './button'

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
} satisfies Meta<Button>

export default meta
type Story = StoryObj<Button>

export const Primary: Story = {}
