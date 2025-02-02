import { jest, beforeEach, describe, expect, test } from '@jest/globals'
import { screen } from 'shadow-dom-testing-library'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { Book } from '../../book'
import './library'
import { Library } from './library'
import { fireEvent } from '@testing-library/dom'

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
        library.books = [new Book('Algorithms'), new Book('Refactoring')]

        expect(cardTitles()).toEqual(['Algorithms', 'Refactoring'])
    })
})

describe('Search', () => {
    beforeEach(() => {
        library.books = [
            new Book('BDD in Action'),
            new Book('Into Thin Air'),
            new Book('Web Components in Action'),
            new Book('Web Accessibility Cookbook'),
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

describe('Clicking on a book cover', () => {
    test('should call callback', async () => {
        const intoThinAir = new Book('Into Thin Air')
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
