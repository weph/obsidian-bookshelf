import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'
import { Book } from '../../bookshelf/book/book'
import { BookBuilder } from '../../support/book-builder'
import { initialSettings, Library, Props } from './library'
import { render, screen } from '@testing-library/react'
import { SortDropdownOption } from './book-sort-options'
import { Books } from '../../bookshelf/book/books'
import { ExpressionFactory } from '../../bookshelf/book/search/expression-factory'
import { parser } from '../../bookshelf/book/search/parser'

const onBookClick = vi.fn()
let user: UserEvent

function renderLibrary(props: Partial<Props>): void {
    render(
        <Library
            settings={props.settings || initialSettings}
            settingsChanged={vi.fn()}
            books={props.books || new Books([])}
            sortOptions={props.sortOptions || [{ value: '', label: '', compareFn: () => 0 }]}
            onBookClick={props.onBookClick || onBookClick}
            expressionFactory={new ExpressionFactory(parser())}
        />,
    )
}

beforeEach(() => {
    vi.resetAllMocks()

    document.body.innerHTML = ''

    user = userEvent.setup()
})

describe('Empty library', () => {
    beforeEach(() => {
        renderLibrary({ books: new Books([]) })
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
        renderLibrary({ books: new Books([book('Algorithms'), book('Refactoring')]) })

        await waitFor(() => expect(cardTitles()).toEqual(['Algorithms', 'Refactoring']))
    })
})

describe('Search', () => {
    test.each([
        ['web', ['Web Components in Action', 'Web Accessibility Cookbook']],
        ['action', ['BDD in Action', 'Web Components in Action']],
        ['in', ['BDD in Action', 'Into Thin Air', 'Web Components in Action']],
    ])('Searching for "%s" should show the following books: %s', async (query, expected) => {
        renderLibrary({
            settings: {
                ...initialSettings,
                search: query,
            },
            books: new Books([
                book('BDD in Action'),
                book('Into Thin Air'),
                book('Web Components in Action'),
                book('Web Accessibility Cookbook'),
            ]),
        })

        expect(cardTitles()).toEqual(expected)
    })

    test('should show a message if no books match the query', async () => {
        renderLibrary({
            settings: {
                ...initialSettings,
                search: 'foobar',
            },
            books: new Books([
                book('BDD in Action'),
                book('Into Thin Air'),
                book('Web Components in Action'),
                book('Web Accessibility Cookbook'),
            ]),
        })

        expect(mainContent()).toHaveTextContent('No books found')
        expect(mainContent()).toHaveTextContent('Try adjusting your search or filters.')
    })
})

describe('Sorting', () => {
    const books = new Books([book('Pet Sematary'), book('Of Mice and Men'), book('Animal Farm')])

    const sortOptions: Array<SortDropdownOption> = [
        {
            value: 'asc',
            label: 'asc',
            compareFn: (a, b) => a.metadata.title.localeCompare(b.metadata.title),
        },
        {
            value: 'desc',
            label: 'desc',
            compareFn: (a, b) => b.metadata.title.localeCompare(a.metadata.title),
        },
    ]

    test('Books should be ordered by first sort option by default', async () => {
        renderLibrary({ books, sortOptions })

        await waitFor(() => expect(cardTitles()).toEqual(['Animal Farm', 'Of Mice and Men', 'Pet Sematary']))
    })

    test('Books should be ordered by selected sort option', async () => {
        renderLibrary({ settings: { ...initialSettings, sort: 'desc' }, books, sortOptions })

        expect(cardTitles()).toEqual(['Pet Sematary', 'Of Mice and Men', 'Animal Farm'])
    })
})

describe('Clicking on a book cover', () => {
    test('should call callback', async () => {
        const intoThinAir = book('Into Thin Air')
        renderLibrary({ books: new Books([intoThinAir]) })

        await user.click(await screen.findByLabelText('Into Thin Air'))

        expect(onBookClick).toHaveBeenCalledWith(intoThinAir, expect.anything())
    })
})

test('Lists should be sorted alphabetically', () => {
    const books = new Books([
        new BookBuilder().with('lists', ['2000s', 'Thrillers']).build(),
        new BookBuilder().with('lists', ['1980s', 'travel']).build(),
        new BookBuilder().with('lists', ['1990s', 'Action']).build(),
        new BookBuilder().with('lists', ['1990s', 'adult']).build(),
    ])
    renderLibrary({ books })

    const select = screen.getByLabelText('List') as HTMLSelectElement

    expect(Array.from(select.options).map((o) => o.label)).toEqual([
        'All lists',
        '1980s',
        '1990s',
        '2000s',
        'Action',
        'adult',
        'Thrillers',
        'travel',
    ])
})

function mainContent(): Element {
    return screen.getByRole('main')
}

function cardTitles(): Array<string> {
    const items = screen.queryAllByRole('listitem')

    return items.map((i) => document.getElementById(i.getAttribute('aria-labelledby') || '')?.textContent || '')
}

function book(title: string): Book {
    return new BookBuilder().with('title', title).build()
}
