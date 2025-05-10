import { expect, test } from 'vitest'
import { BookBuilder } from '../../support/book-builder'
import { Link } from './link'
import { Book, BookMetadata } from './book'
import {
    groupedAlphabetically,
    GroupedBooks,
    groupedByAuthor,
    groupedByList,
    groupedByPublicationYear,
    groupedByRating,
    groupedBySeries,
} from './grouping'

test('groupedAlphabetically', () => {
    const result = groupedAlphabetically([
        book('Algorithms'),
        book('Dracula'),
        book('Dexter'),
        book('Frankenstein'),
        book(''),
    ])

    expect(groupedBooks(result)).toEqual(['A: Algorithms', 'D: Dracula, Dexter', 'F: Frankenstein', 'Other: '])
})

test('groupedByList', () => {
    const result = groupedByList([
        book('The Hunger Games', { lists: ['First in Series', 'Dystopic'] }),
        book('Darkly Dreaming Dexter', { lists: ['First in Series', 'Crime'] }),
        book('The Black Echo', { lists: ['First in Series', 'Crime'] }),
        book('The Grapes of Wrath'),
    ])

    expect(groupedBooks(result)).toEqual([
        'Crime: Darkly Dreaming Dexter, The Black Echo',
        'Dystopic: The Hunger Games',
        'First in Series: The Hunger Games, Darkly Dreaming Dexter, The Black Echo',
        'No list assigned: The Grapes of Wrath',
    ])
})

test('groupedBySeries', () => {
    const result = groupedBySeries([
        book('The Hunger Games', { series: { name: 'Hunger Games' } }),
        book('Catching Fire', { series: { name: 'Hunger Games' } }),
        book('Dracula'),
        book('Darkly Dreaming Dexter', { series: { name: 'Dexter' } }),
    ])

    expect(groupedBooks(result)).toEqual([
        'Dexter: Darkly Dreaming Dexter',
        'Hunger Games: The Hunger Games, Catching Fire',
        'Not part of a series: Dracula',
    ])
})

test('groupedByAuthor', () => {
    const result = groupedByAuthor([
        book('Authorless'),
        book('One Author', { authors: ['Joe Schmoe'] }),
        book('Two Authors', { authors: ['Joe Schmoe', Link.from({ link: 'Jane Doe', original: '[[Jane Doe]]' })] }),
    ])

    expect(groupedBooks(result)).toEqual([
        'Jane Doe: Two Authors',
        'Joe Schmoe: One Author, Two Authors',
        'Author unknown: Authorless',
    ])
})

test('groupedByPublicationYear', () => {
    const result = groupedByPublicationYear([
        book('Book 80/1', { published: new Date(1980, 0, 1) }),
        book('Book 80/2', { published: new Date(1980, 11, 31) }),
        book('Book 90/1', { published: new Date(1990, 6, 1) }),
        book('Book without metadata'),
    ])

    expect(groupedBooks(result)).toEqual([
        '1990: Book 90/1',
        '1980: Book 80/1, Book 80/2',
        'Publication date unknown: Book without metadata',
    ])
})

test('groupedByRating', () => {
    const result = groupedByRating([
        book('Epic Book 1', { rating: 5 }),
        book('Epic Book 2', { rating: 5 }),
        book('So Close', { rating: 4.75 }),
        book('Average Book', { rating: 3 }),
        book('Meh Book', { rating: 1.5 }),
        book('Never Again', { rating: 0 }),
        book('Unread book'),
    ])

    expect(groupedBooks(result)).toEqual([
        '5 stars: Epic Book 1, Epic Book 2',
        '4.75 stars: So Close',
        '3 stars: Average Book',
        '1.5 stars: Meh Book',
        '0 stars: Never Again',
        'Not yet rated: Unread book',
    ])
})

function book(title: string, props: Partial<BookMetadata> = {}): Book {
    let result = new BookBuilder().with('title', title)

    let prop: keyof BookMetadata
    for (prop in props) {
        result = result.with(prop, props[prop])
    }

    return result.build()
}

function groupedBooks(groupedBooks: GroupedBooks): Array<string> {
    const result = []

    for (const [group, books] of groupedBooks.groups.entries()) {
        const label = group === null ? groupedBooks.nullLabel : group
        const titles = books.map((b) => b.metadata.title)

        result.push(`${label}: ${titles.join(', ')}`)
    }

    return result
}
