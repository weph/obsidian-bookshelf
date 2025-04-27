import { Book } from '../../bookshelf/book/book'
import { StarRating } from '../star-rating/star-rating'
import styles from './table.module.scss'
import { TagList } from '../tag-list/tag-list'
import { MouseEvent } from 'react'
import { Link } from '../../bookshelf/book/link'

interface Props {
    books: Array<Book>
    onBookClick: (book: Book, event: MouseEvent) => void
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
                    <tr key={index} onClick={(e) => onBookClick(book, e)}>
                        <td>{book.metadata.title}</td>
                        <td>
                            {(book.metadata.authors || []).map((author, i) => (
                                <div key={i}>{author instanceof Link ? author.displayText : author}</div>
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
