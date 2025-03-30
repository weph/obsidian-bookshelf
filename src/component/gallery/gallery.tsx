import { Book } from '../../bookshelf/book'
import { GalleryCard } from './gallery-card'
import styles from './gallery.module.scss'

interface Props {
    books: Array<Book>
    onBookClick: (book: Book) => void
}

export function Gallery({ books, onBookClick }: Props) {
    return (
        <div className={styles.gallery} role="list">
            {books.map((book, index) => (
                <GalleryCard
                    key={index}
                    title={book.metadata.title}
                    cover={book.metadata.cover}
                    onClick={() => onBookClick(book)}
                />
            ))}
        </div>
    )
}
