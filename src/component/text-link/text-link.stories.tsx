import type { Meta, StoryObj } from '@storybook/react'
import { TextLink } from './text-link'
import { Link } from '../../bookshelf/book/link'

const meta = {
    title: 'UI/Text Link',
    component: TextLink,
} satisfies Meta<typeof TextLink>

export default meta
type Story = StoryObj<typeof TextLink>

export const Internal: Story = {
    args: {
        link: new Link('internal', 'Note', 'Display Title', '[[Note|Display Title]]'),
    },
}

export const External: Story = {
    args: {
        link: Link.from('https://site.test/'),
    },
}
