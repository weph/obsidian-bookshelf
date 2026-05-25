import styles from './grouped-books.module.scss'
import type { GroupedBooks } from '../../../bookshelf/book/grouping'
import { Book } from '../../../bookshelf/book/book'
import { ComponentType, MouseEvent } from 'react'
import { Books } from '../../../bookshelf/book/books'
import { pluralize } from '../pluralize'

interface Props {
    books: GroupedBooks
    onBookClick: (book: Book, event: MouseEvent) => void
    ViewComponent: ComponentType<{ books: Books; onBookClick: (book: Book, event: MouseEvent) => void }>
}

export function GroupedBooks({ books, onBookClick, ViewComponent }: Props) {
    return Array.from(books.groups).map((entry) => (
        <div className={styles.group} key={entry[0]}>
            <div className={`${styles.groupHeading} ${entry[0] === null ? styles.fallbackGroup : ''}`}>
                <h2>{entry[0] === null ? books.nullLabel : entry[0]}</h2>
                <div className={styles.booksInGroup}>{pluralize(entry[1].length, 'book')}</div>
            </div>
            <ViewComponent books={entry[1]} onBookClick={onBookClick} />
        </div>
    ))
}
