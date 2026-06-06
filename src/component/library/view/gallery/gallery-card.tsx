import styles from './gallery-card.module.scss'
import { CoverPlaceholder } from '../../../cover-placeholder/cover-placeholder'
import * as react from 'react'
import { MouseEvent, useId } from 'react'
import { ReadingStatus } from '../../../../bookshelf/book/book'
import { Check, LucideProps, X } from 'lucide-react'
import { Icon } from '../../../icon/icon'
import { BookViewItem } from '../../book-view-item'

interface Props {
    item: BookViewItem
    onClick: (event: MouseEvent) => void
}

type IconType = react.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

const ribbonIcon: Record<ReadingStatus, IconType | null> = {
    unread: null,
    reading: null,
    finished: Check,
    abandoned: X,
}

export function GalleryCard({ item, onClick }: Props) {
    const titleId = useId()
    const cover = item.book.metadata.cover
    const title = item.book.metadata.title
    const icon = ribbonIcon[item.book.status]

    return (
        <div
            className={styles.galleryCard}
            role="listitem"
            onClick={onClick}
            aria-labelledby={titleId}
            data-status={item.book.status}
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
            {item.fields.map((field, index) => (
                <div key={index}>
                    <div className={styles.fieldName}>{field.name}</div>
                    <div className={styles.fieldValue}>{field.value(item.book)}</div>
                </div>
            ))}
        </div>
    )
}
