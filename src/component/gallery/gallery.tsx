import { Book } from '../../bookshelf/book/book'
import { GalleryCard } from './gallery-card'
import styles from './gallery.module.scss'
import { MouseEvent } from 'react'
import { Books } from '../../bookshelf/book/books'

interface Props {
    books: Books
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function Gallery({ books, onBookClick }: Props) {
    return (
        <div className={styles.gallery} role="list">
            {books.map((book, index) => (
                <GalleryCard key={index} book={book} onClick={(e) => onBookClick(book, e)} />
            ))}
        </div>
    )
}
