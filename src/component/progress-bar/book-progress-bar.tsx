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
    const progress = book.progress

    if (progress === null) {
        return <></>
    }

    return (
        <div className={`${styles.progressBarContainer} ${statusClass[book.status]}`}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            <div className={styles.percentage}>{progress}%</div>
        </div>
    )
}
