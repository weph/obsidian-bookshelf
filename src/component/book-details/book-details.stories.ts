import type { Meta, StoryObj } from '@storybook/html'
import './book-details'
import { BookDetailsProps } from './book-details'

const meta = {
    title: 'Book Details',
    render: (args) => {
        const element = document.createElement('bookshelf-book-details')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<BookDetailsProps>

export default meta
type Story = StoryObj<BookDetailsProps>

export const Primary: Story = {
    args: {
        book: {
            title: 'Test-Driven Development by Example',
            cover: '/covers/test-driven-development-by-example.jpg',
            authors: ['Kent Beck'],
            published: new Date(2002, 0, 1),
        },
    },
}

export const Empty: Story = {
    args: {
        book: { title: 'Book With Just A Title' },
    },
}
