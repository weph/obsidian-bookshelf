import styles from './gallery-card.module.scss'
import { CoverPlaceholder } from '../cover-placeholder/cover-placeholder'
import { ProgressBar } from '../progress-bar/progress-bar'
import { MouseEvent, useId } from 'react'
import { Book } from '../../bookshelf/book/book'

interface Props {
    book: Book
    onClick: (event: MouseEvent) => void
}

export function GalleryCard({ book, onClick }: Props) {
    const titleId = useId()
    const cover = book.metadata.cover
    const title = book.metadata.title
    const progress = book.progress

    return (
        <div className={styles.galleryCard} role="listitem" onClick={onClick} aria-labelledby={titleId}>
            {cover ? <img src={cover} alt={title} /> : <CoverPlaceholder title={title} />}
            <div className={styles.overlay}>
                <span id={titleId} className={styles.title}>
                    {title}
                </span>
            </div>
            {progress !== null && <ProgressBar percentage={progress} />}
        </div>
    )
}
