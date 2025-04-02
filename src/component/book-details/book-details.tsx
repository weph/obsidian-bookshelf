import { Book } from '../../bookshelf/book'
import { StarRating } from '../star-rating/star-rating'
import { Button } from '../button/button'
import { DateTime } from 'luxon'
import { ReadingJourneyItem } from '../../bookshelf/reading-journey/reading-journey-log'
import { ReadingJourneyMatch } from '../../bookshelf/note-processing/note-processor'
import { ReadingJourneyForm } from './reading-journey-form'
import styles from './book-details.module.scss'

interface Props {
    book: Book
    openNote: (book: Book) => void
    addProgress: (item: ReadingJourneyMatch) => Promise<void>
}

export function BookDetails({ book, openNote, addProgress }: Props) {
    const { cover, title, authors, published, pages, rating, tags } = book.metadata

    const journeyItemText = (item: ReadingJourneyItem) => {
        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return item.action
            case 'progress':
                return `${item.startPage}-${item.endPage}`
        }
    }

    return (
        <div className={styles.bookDetails}>
            <div className={styles.top}>
                <div className={styles.cover}>{cover ? <img src={cover} alt={title} /> : ''}</div>
                <div className={styles.details}>
                    <ul className={styles.metadata}>
                        {authors?.length ? (
                            <li>
                                <strong>Author:</strong> {authors.join(', ')}
                            </li>
                        ) : (
                            ''
                        )}
                        {published ? (
                            <li>
                                <strong>Published:</strong> {published.getFullYear()}
                            </li>
                        ) : (
                            ''
                        )}
                        {pages ? (
                            <li>
                                <strong>Pages:</strong> {pages}
                            </li>
                        ) : (
                            ''
                        )}
                        {rating ? (
                            <li>
                                <strong>Rating:</strong>
                                <StarRating value={rating} />
                            </li>
                        ) : (
                            ''
                        )}
                        {tags?.length ? (
                            <li>
                                <strong>Tags:</strong> {tags.join(', ')}
                            </li>
                        ) : (
                            ''
                        )}
                    </ul>
                    <div className={styles.actions}>
                        <Button text="Open note" onClick={() => openNote(book)} />
                    </div>
                </div>
            </div>
            <div>
                <ul className={styles.readingJourney}>
                    {book.readingJourney.map((item, i) => (
                        <li key={i}>
                            {DateTime.fromJSDate(item.date).toLocaleString()}: {journeyItemText(item)}
                        </li>
                    ))}
                    <li>
                        <ReadingJourneyForm book={book} add={addProgress} />
                    </li>
                </ul>
            </div>
        </div>
    )
}
