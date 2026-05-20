import styles from './book-progress-bar.module.scss'
import { Book, ReadingStatus } from '../../bookshelf/book/book'

interface Props {
    book: Book
}

const statusClass: Record<ReadingStatus, string> = {
    unread: styles.inactive,
    reading: styles.active,
    finished: styles.active,
    abandoned: styles.inactive,
}

export function BookProgressBar({ book }: Props) {
    const currentPosition = book.lastPosition

    if (book.status === 'finished' || currentPosition === null) {
        return <></>
    }

    const percentage = currentPosition.asPercentage(book) || 0
    const value = percentage ? `${percentage}%` : currentPosition.toString()

    return (
        <div className={`${styles.progressBarContainer} ${statusClass[book.status]}`}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
            <div className={styles.percentage}>{value}</div>
        </div>
    )
}
