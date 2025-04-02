import { Book } from '../../bookshelf/book'
import { StarRating } from '../star-rating/star-rating'
import { DateTime } from 'luxon'
import { ReadingJourneyItem } from '../../bookshelf/reading-journey/reading-journey-log'
import { ReadingJourneyMatch } from '../../bookshelf/note-processing/note-processor'
import { ReadingJourneyForm } from './reading-journey-form'
import styles from './book-details.module.scss'
import { Tag } from '../tag/tag'
import { CoverPlaceholder } from '../cover-placeholder/cover-placeholder'
import { ExternalLink } from 'lucide-react'

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
                <div className={styles.cover}>
                    {cover ? <img src={cover} alt={title} /> : <CoverPlaceholder title={title} />}
                </div>
                <div className={styles.details}>
                    <div className={styles.title}>
                        {title}
                        <div className={styles.openNote}>
                            <ExternalLink size={18} onClick={() => openNote(book)} />
                        </div>
                    </div>
                    {authors && authors.length > 0 && <div className={styles.authors}>by {authors.join(', ')}</div>}
                    <div className={styles.pagesAndDate}>
                        {pages && <div>{pages} pages</div>}
                        {published && <div>{published.getFullYear()}</div>}
                        {rating && <StarRating value={rating} />}
                    </div>

                    <ul className={styles.tags}>{tags?.map((t) => <Tag value={t} />)}</ul>
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
