import type { Meta, StoryObj } from '@storybook/html'
import { Gallery } from './gallery'
import './gallery'
import { fn } from '@storybook/test'
import { Book } from '../../bookshelf/book'
import { BookBuilder } from '../../support/book-builder'

const meta = {
    title: 'Gallery',
    args: {
        onBookClick: fn(),
    },
    render: (args) => {
        const element = document.createElement('bookshelf-gallery')

        Object.assign(element, args)

        return element
    },
} satisfies Meta<Gallery>

const books: Array<Book> = [
    book('Algorithms', '/covers/algorithms.jpg'),
    book(
        'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation',
        '/covers/continuous-delivery.jpg',
    ),
    book('Code That Fits in Your Head: Heuristics for Software Engineering', '/covers/code-that-fits-in-your-head.jpg'),
    book('Design Patterns: Elements of Reusable Object-Oriented Software', '/covers/design-patterns.jpg'),
    book('Domain-Driven Design: Tackling Complexity in the Heart of Software', '/covers/domain-driven-design.jpg'),
    book('Extreme Programming Explained', '/covers/extreme-programming-explained.jpg'),
    book('Growing Object-Oriented Software, Guided by Tests', '/covers/growing-object-oriented-software.jpg'),
    book('Implementing Domain-driven Design', '/covers/implementing-domain-driven-design.jpg'),
    book("Michael Abrash's Graphics Programming Black Book", '/covers/graphics-programming-black-book.jpg'),
    book('Refactoring', '/covers/refactoring.jpg'),
    book('Test-Driven Development by Example', '/covers/test-driven-development-by-example.jpg'),
    book('The Mythical Man-Month', '/covers/the-mythical-man-month.jpg'),
    book('The Pragmatic Programmer', '/covers/the-pragmatic-programmer.jpg'),
    book('Working Effectively with Legacy Code', '/covers/working-effectively-with-legacy-code.jpg'),
]

export default meta
type Story = StoryObj<Gallery>

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

function book(title: string, cover: string): Book {
    return new BookBuilder().with('title', title).with('cover', cover).build()
}
