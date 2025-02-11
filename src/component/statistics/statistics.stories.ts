import type { Meta, StoryObj } from '@storybook/html'
import './statistics'
import { StatisticsProps } from './statistics'
import { Bookshelf } from '../../bookshelf'

const meta = {
    title: 'Statistics',
    render: (args) => {
        const element = document.createElement('bookshelf-statistics')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<StatisticsProps>

export default meta
type Story = StoryObj<StatisticsProps>

const bookshelf = new Bookshelf()
bookshelf.add('book', { title: 'Book' })
bookshelf.addReadingProgress(new Date(2025, 0, 1), 'book', 50, 1)
bookshelf.addReadingProgress(new Date(2025, 0, 2), 'book', 110, 51)
bookshelf.addReadingProgress(new Date(2025, 1, 1), 'book', 130, 111)
bookshelf.addReadingProgress(new Date(2025, 2, 5), 'book', 200, 141)
bookshelf.addReadingProgress(new Date(2025, 2, 6), 'book', 240, 201)

export const Primary: Story = {
    args: {
        bookshelf,
    },
}

export const Empty: Story = {}
