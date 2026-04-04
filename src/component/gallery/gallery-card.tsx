import styles from './gallery-card.module.scss'
import { CoverPlaceholder } from '../cover-placeholder/cover-placeholder'
import { ProgressBar } from '../progress-bar/progress-bar'
import * as react from 'react'
import { MouseEvent, useId } from 'react'
import { Book, ReadingStatus } from '../../bookshelf/book/book'
import { Check, LucideProps, X } from 'lucide-react'
import { Icon } from '../icon/icon'

interface Props {
    book: Book
    onClick: (event: MouseEvent) => void
}

type IconType = react.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

const ribbonIcons: Record<ReadingStatus, IconType | null> = {
    unread: null,
    reading: null,
    finished: Check,
    abandoned: X,
}

export function GalleryCard({ book, onClick }: Props) {
    const titleId = useId()
    const cover = book.metadata.cover
    const title = book.metadata.title
    const progress = book.progress
    const icon = ribbonIcons[book.status]

    return (
        <div
            className={styles.galleryCard}
            role="listitem"
            onClick={onClick}
            aria-labelledby={titleId}
            data-status={book.status}
        >
            {icon && (
                <div className={styles.ribbon}>
                    <Icon icon={icon} size="xs" color="white" />
                </div>
            )}
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
