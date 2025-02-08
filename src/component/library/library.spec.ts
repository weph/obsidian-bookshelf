import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { screen } from 'shadow-dom-testing-library'
import userEvent, { UserEvent } from '@testing-library/user-event'
import './library'
import { Library } from './library'
import { fireEvent } from '@testing-library/dom'
import { Book } from '../../book'
import { BookBuilder } from '../../support/book-builder'
import { BookSortOptions } from '../../book-sort-options'

const onBookClick = jest.fn()
let user: UserEvent
let library: Library

beforeEach(() => {
    jest.resetAllMocks()
    library = document.createElement('bookshelf-library')
    user = userEvent.setup()

    document.body.replaceChildren(library)
})

describe('Empty library', () => {
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
        library.books = [book('Algorithms'), book('Refactoring')]

        expect(cardTitles()).toEqual(['Algorithms', 'Refactoring'])
    })
})

describe('Search', () => {
    beforeEach(() => {
        library.books = [
            book('BDD in Action'),
            book('Into Thin Air'),
            book('Web Components in Action'),
            book('Web Accessibility Cookbook'),
        ]
    })

    test.each([
        ['web', ['Web Components in Action', 'Web Accessibility Cookbook']],
        ['action', ['BDD in Action', 'Web Components in Action']],
        ['in', ['BDD in Action', 'Into Thin Air', 'Web Components in Action']],
    ])('Searching for "%s" should show the following books: %s', async (query, expected) => {
        await user.type(screen.getByShadowPlaceholderText('Search...'), query)

        expect(cardTitles()).toEqual(expected)
    })

    test('should show a message if no books match the query', async () => {
        await user.type(screen.getByShadowPlaceholderText('Search...'), 'foobar')

        expect(mainContent()).toHaveTextContent('No books found')
        expect(mainContent()).toHaveTextContent('Try a different search term or check your spelling.')
    })

    test('resetting the query should bring back all books', async () => {
        await user.type(screen.getByShadowPlaceholderText('Search...'), 'foobar')
        resetSearch(screen.getByShadowPlaceholderText('Search...'))

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
        library.books = [book('Pet Sematary'), book('Of Mice and Men'), book('Animal Farm')]
    })

    describe('No sort options exist', () => {
        test('Books should be shown in order of addition', () => {
            expect(cardTitles()).toEqual(['Pet Sematary', 'Of Mice and Men', 'Animal Farm'])
        })
    })

    describe('Sort options exist', () => {
        beforeEach(() => {
            const sortOptions = new BookSortOptions()
            sortOptions.add('asc', (a, b) => a.metadata.title.localeCompare(b.metadata.title))
            sortOptions.add('desc', (a, b) => b.metadata.title.localeCompare(a.metadata.title))
            library.sortOptions = sortOptions
        })

        test('Books should be ordered by first sort option by default', () => {
            expect(cardTitles()).toEqual(['Animal Farm', 'Of Mice and Men', 'Pet Sematary'])
        })

        test('Books should be ordered by selected sort option', async () => {
            await userEvent.selectOptions(screen.getByShadowLabelText('Sort'), 'desc')

            expect(cardTitles()).toEqual(['Pet Sematary', 'Of Mice and Men', 'Animal Farm'])
        })
    })
})

describe('Clicking on a book cover', () => {
    test('should call callback', async () => {
        const intoThinAir = book('Into Thin Air')
        library.books = [intoThinAir]
        library.onBookClick = onBookClick

        await user.click(screen.getByShadowText('Into Thin Air'))

        expect(onBookClick).toHaveBeenCalledWith(intoThinAir)
    })
})

function mainContent(): HTMLElement {
    return screen.getByShadowRole('main')
}

function cardTitles(): Array<string> {
    const items = screen.queryAllByShadowRole('listitem')

    return items.map((i) => i.getAttribute('title') || '')
}

function resetSearch(element: HTMLInputElement): void {
    element.value = ''
    fireEvent(element, new InputEvent('search'))
}

function book(title: string): Book {
    return new BookBuilder().with('title', title).build()
}
