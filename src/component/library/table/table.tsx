import { Book } from '../../../bookshelf/book/book'
import { StarRating } from '../../star-rating/star-rating'
import styles from './table.module.scss'
import { TagList } from '../../tag-list/tag-list'
import { MouseEvent } from 'react'
import { BookProgressBar } from '../../progress-bar/book-progress-bar'
import { BookViewItem } from '../book-view-item'

interface Props {
    items: Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function BookTable({ items, onBookClick }: Props) {
    return (
        <table className={styles.bookTable}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th className={styles.pubDate}>Published</th>
                    <th className={styles.pages}>Pages</th>
                    <th className={styles.duration}>Duration</th>
                    <th className={styles.progress}>Progress</th>
                    <th>Rating</th>
                    <th>Tags</th>
                    <th>Genres</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index} onClick={(e) => onBookClick(item.book, e)}>
                        <td>{item.book.metadata.title}</td>
                        <td>
                            {(item.book.metadata.authors || []).map((author, i) => (
                                <div key={i}>{author.toString()}</div>
                            ))}
                        </td>
                        <td className={styles.pubDate}>{item.book.metadata.published?.getFullYear() || ''}</td>
                        <td className={styles.pages}>{item.book.metadata.pages?.toLocaleString() || ''}</td>
                        <td className={styles.duration}>{item.book.metadata.duration?.toString('verbose') || ''}</td>
                        <td>
                            <BookProgressBar book={item.book} />
                        </td>
                        <td>
                            <StarRating value={item.book.metadata.rating || 0} />
                        </td>
                        <td>{item.book.metadata.tags && <TagList tags={item.book.metadata.tags} />}</td>
                        <td>{item.book.metadata.genre && item.book.metadata.genre.join(', ')}</td>
                        <td>{item.book.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
