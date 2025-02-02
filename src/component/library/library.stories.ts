import type { Meta, StoryObj } from '@storybook/html'
import type { LibraryProps } from './library'
import { Book } from '../../book'
import './library'

const meta = {
    title: 'Library',
    render: (args) => {
        const element = document.createElement('bookshelf-library')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<LibraryProps>

const books = [
    new Book('Algorithms'),
    new Book('Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation'),
    new Book('Code That Fits in Your Head : Heuristics for Software Engineering'),
    new Book('Design Patterns: Elements of Reusable Object-Oriented Software'),
    new Book('Domain-Driven Design: Tackling Complexity in the Heart of Software'),
    new Book('Extreme Programming Explained'),
    new Book('Growing Object-Oriented Software, Guided by Tests'),
    new Book('Implementing Domain-driven Design'),
    new Book("Michael Abrash's Graphics Programming Black Book"),
    new Book('Refactoring'),
    new Book('Test-Driven Development by Example'),
    new Book('The Mythical Man-Month'),
    new Book('The Pragmatic Programmer'),
    new Book('Working Effectively with Legacy Code'),
]

export default meta
type Story = StoryObj<LibraryProps>

export const Primary: Story = {
    args: {
        books,
    },
}

export const Empty: Story = {
    args: {
        books: [],
    },
}

export const SingleBook: Story = {
    args: {
        books: [books[0]],
    },
}
