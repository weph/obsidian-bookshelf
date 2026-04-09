import type { Meta, StoryObj } from '@storybook/react'
import { BookProgressBar } from './book-progress-bar'
import { BookBuilder } from '../../support/book-builder'

const meta = {
    title: 'Book Progress Bar',
    component: BookProgressBar,
} satisfies Meta<typeof BookProgressBar>

export default meta
type Story = StoryObj<typeof BookProgressBar>

export const Primary: Story = {
    args: {
        book: new BookBuilder().withStatus('finished').withProgress(100).build(),
    },
}
