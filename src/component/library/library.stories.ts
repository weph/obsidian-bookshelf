import type { Meta, StoryObj } from '@storybook/html'
import type { LibraryProps } from './library'
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
    { title: 'Algorithms', cover: '/covers/algorithms.jpg' },
    {
        title: 'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation',
        cover: '/covers/continuous-delivery.jpg',
    },
    {
        title: 'Code That Fits in Your Head: Heuristics for Software Engineering',
        cover: '/covers/code-that-fits-in-your-head.jpg',
    },
    { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', cover: '/covers/design-patterns.jpg' },
    {
        title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
        cover: '/covers/domain-driven-design.jpg',
    },
    { title: 'Extreme Programming Explained', cover: '/covers/extreme-programming-explained.jpg' },
    {
        title: 'Growing Object-Oriented Software, Guided by Tests',
        cover: '/covers/growing-object-oriented-software.jpg',
    },
    { title: 'Implementing Domain-driven Design', cover: '/covers/implementing-domain-driven-design.jpg' },
    { title: "Michael Abrash's Graphics Programming Black Book", cover: '/covers/graphics-programming-black-book.jpg' },
    { title: 'Refactoring', cover: '/covers/refactoring.jpg' },
    { title: 'Test-Driven Development by Example', cover: '/covers/test-driven-development-by-example.jpg' },
    { title: 'The Mythical Man-Month', cover: '/covers/the-mythical-man-month.jpg' },
    { title: 'The Pragmatic Programmer', cover: '/covers/the-pragmatic-programmer.jpg' },
    { title: 'Working Effectively with Legacy Code', cover: '/covers/working-effectively-with-legacy-code.jpg' },
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
