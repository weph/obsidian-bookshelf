import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'
import { Book } from '../../bookshelf/book'
import { BookBuilder } from '../../support/book-builder'
import { BookSortOptions } from '../../bookshelf/sort/book-sort-options'
import { Library, Props } from './library'
import { render, screen } from '@testing-library/react'

const onBookClick = jest.fn()
let user: UserEvent

const sortByOrderOfAdditionOnly = new BookSortOptions()
sortByOrderOfAdditionOnly.add('', () => 0)

function renderLibrary(props: Partial<Props>): void {
    render(
        <Library
            books={props.books || []}
            sortOptions={props.sortOptions || sortByOrderOfAdditionOnly}
            onBookClick={props.onBookClick || onBookClick}
        />,
    )
}

beforeEach(() => {
    jest.resetAllMocks()

    document.body.innerHTML = ''

    user = userEvent.setup()
})

describe('Empty library', () => {
    beforeEach(() => {
        renderLibrary({ books: [] })
    })

    test('has no books', () => {
        expect(cardTitles()).toEqual([])
    })

    test('shows message', () => {
        expect(mainContent()).toHaveTextContent('No books found')
        expect(mainContent()).toHaveTextContent(
            'Set up Bookshelf or add your first book note to start building your library.',
        )
    })
})

describe('Library', () => {
    test('should show all books', async () => {
        renderLibrary({ books: [book('Algorithms'), book('Refactoring')] })

        await waitFor(() => expect(cardTitles()).toEqual(['Algorithms', 'Refactoring']))
    })
})

describe('Search', () => {
    beforeEach(() => {
        renderLibrary({
            books: [
                book('BDD in Action'),
                book('Into Thin Air'),
                book('Web Components in Action'),
                book('Web Accessibility Cookbook'),
            ],
        })
    })

    test.each([
        ['web', ['Web Components in Action', 'Web Accessibility Cookbook']],
        ['action', ['BDD in Action', 'Web Components in Action']],
        ['in', ['BDD in Action', 'Into Thin Air', 'Web Components in Action']],
    ])('Searching for "%s" should show the following books: %s', async (query, expected) => {
        await user.type(screen.getByPlaceholderText('Search...'), query)

        expect(cardTitles()).toEqual(expected)
    })

    test('should show a message if no books match the query', async () => {
        await user.type(screen.getByPlaceholderText('Search...'), 'foobar')

        expect(mainContent()).toHaveTextContent('No books found')
        expect(mainContent()).toHaveTextContent('Try a different search term or check your spelling.')
    })

    test('resetting the query should bring back all books', async () => {
        await user.type(screen.getByPlaceholderText('Search...'), 'foobar')

        await user.clear(screen.getByPlaceholderText('Search...'))

        expect(cardTitles()).toEqual([
            'BDD in Action',
            'Into Thin Air',
            'Web Components in Action',
            'Web Accessibility Cookbook',
        ])
    })
})

describe('Sorting', () => {
    beforeEach(() => {
        const books = [book('Pet Sematary'), book('Of Mice and Men'), book('Animal Farm')]

        const sortOptions = new BookSortOptions()
        sortOptions.add('asc', (a, b) => a.metadata.title.localeCompare(b.metadata.title))
        sortOptions.add('desc', (a, b) => b.metadata.title.localeCompare(a.metadata.title))

        renderLibrary({ books, sortOptions })
    })

    test('Books should be ordered by first sort option by default', async () => {
        await waitFor(() => expect(cardTitles()).toEqual(['Animal Farm', 'Of Mice and Men', 'Pet Sematary']))
    })

    test('Books should be ordered by selected sort option', async () => {
        await userEvent.selectOptions(screen.getByLabelText('Sort'), screen.getByText('desc'))

        expect(cardTitles()).toEqual(['Pet Sematary', 'Of Mice and Men', 'Animal Farm'])
    })
})

describe('Clicking on a book cover', () => {
    test('should call callback', async () => {
        const intoThinAir = book('Into Thin Air')
        renderLibrary({ books: [intoThinAir] })

        await user.click(await screen.findByText('Into Thin Air'))

        expect(onBookClick).toHaveBeenCalledWith(intoThinAir)
    })
})

function mainContent(): Element {
    const htmlElement = document.querySelector('.bookshelf--library--content')

    if (!htmlElement) {
        throw new Error('main content not found')
    }

    return htmlElement
}

function cardTitles(): Array<string> {
    const items = screen.queryAllByRole('listitem')

    return items.map((i) => i.textContent || '')
}

function book(title: string): Book {
    return new BookBuilder().with('title', title).build()
}
