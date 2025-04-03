import { Book } from '../../bookshelf/book'
import { StarRating } from '../star-rating/star-rating'
import styles from './table.module.scss'
import { TagList } from '../tag-list/tag-list'

interface Props {
    books: Array<Book>
    onBookClick: (book: Book) => void
}

export function BookTable({ books, onBookClick }: Props) {
    return (
        <table className={styles.bookTable}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published</th>
                    <th>Pages</th>
                    <th>Rating</th>
                    <th>Tags</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book, index) => (
                    <tr key={index} onClick={() => onBookClick(book)}>
                        <td>{book.metadata.title}</td>
                        <td>
                            {(book.metadata.authors || []).map((author, i) => (
                                <div key={i}>{author}</div>
                            ))}
                        </td>
                        <td>{book.metadata.published?.getFullYear() || ''}</td>
                        <td>{book.metadata.pages || ''}</td>
                        <td>
                            <StarRating value={book.metadata.rating || 0} />
                        </td>
                        <td>{book.metadata.tags && <TagList tags={book.metadata.tags} />}</td>
                        <td>{book.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
