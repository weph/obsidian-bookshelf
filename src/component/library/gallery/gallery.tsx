import { Book } from '../../../bookshelf/book/book'
import { GalleryCard } from './gallery-card'
import styles from './gallery.module.scss'
import { MouseEvent } from 'react'
import { BookViewItem } from '../book-view-item'

interface Props {
    items: Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function Gallery({ items, onBookClick }: Props) {
    return (
        <div className={styles.gallery} role="list">
            {items.map((item, index) => (
                <GalleryCard key={index} item={item} onClick={(e) => onBookClick(item.book, e)} />
            ))}
        </div>
    )
}
