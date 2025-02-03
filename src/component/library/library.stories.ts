import type { Meta, StoryObj } from '@storybook/html'
import type { LibraryProps } from './library'
import { Book } from '../../book'
import './library'
import { fn } from '@storybook/test'

const meta = {
    title: 'Library',
    args: {
        onBookClick: fn(),
    },
    render: (args) => {
        const element = document.createElement('bookshelf-library')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<LibraryProps>

const books = [
    new Book('Algorithms', '/covers/algorithms.jpg'),
    new Book(
        'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation',
        '/covers/continuous-delivery.jpg',
    ),
    new Book(
        'Code That Fits in Your Head: Heuristics for Software Engineering',
        '/covers/code-that-fits-in-your-head.jpg',
    ),
    new Book('Design Patterns: Elements of Reusable Object-Oriented Software', '/covers/design-patterns.jpg'),
    new Book('Domain-Driven Design: Tackling Complexity in the Heart of Software', '/covers/domain-driven-design.jpg'),
    new Book('Extreme Programming Explained', '/covers/extreme-programming-explained.jpg'),
    new Book('Growing Object-Oriented Software, Guided by Tests', '/covers/growing-object-oriented-software.jpg'),
    new Book('Implementing Domain-driven Design', '/covers/implementing-domain-driven-design.jpg'),
    new Book("Michael Abrash's Graphics Programming Black Book", '/covers/graphics-programming-black-book.jpg'),
    new Book('Refactoring', '/covers/refactoring.jpg'),
    new Book('Test-Driven Development by Example', '/covers/test-driven-development-by-example.jpg'),
    new Book('The Mythical Man-Month', '/covers/the-mythical-man-month.jpg'),
    new Book('The Pragmatic Programmer', '/covers/the-pragmatic-programmer.jpg'),
    new Book('Working Effectively with Legacy Code', '/covers/working-effectively-with-legacy-code.jpg'),
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
