import styles from './grouped-view.module.scss'
import type { GroupedData } from '../../../bookshelf/book/grouping'
import { Book } from '../../../bookshelf/book/book'
import { ComponentType, MouseEvent } from 'react'
import { pluralize } from '../pluralize'
import { BookViewItem } from '../book-view-item'

interface Props {
    items: GroupedData<Array<BookViewItem>>
    onBookClick: (book: Book, event: MouseEvent) => void
    ViewComponent: ComponentType<{ items: Array<BookViewItem>; onBookClick: (book: Book, event: MouseEvent) => void }>
}

export function GroupedView({ items, onBookClick, ViewComponent }: Props) {
    return Array.from(items.groups).map((entry) => (
        <div className={styles.group} key={entry[0]}>
            <div className={`${styles.groupHeading} ${entry[0] === null ? styles.fallbackGroup : ''}`}>
                <h2>{entry[0] === null ? items.nullLabel : entry[0]}</h2>
                <div className={styles.booksInGroup}>{pluralize(entry[1].length, 'book')}</div>
            </div>
            <ViewComponent items={entry[1]} onBookClick={onBookClick} />
        </div>
    ))
}
