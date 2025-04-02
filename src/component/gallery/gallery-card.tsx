import styles from './gallery-card.module.scss'
import { CoverPlaceholder } from '../cover-placeholder/cover-placeholder'
import { useId } from 'react'

interface Props {
    cover?: string
    title: string
    onClick: () => void
}

export function GalleryCard({ cover, title, onClick }: Props) {
    const titleId = useId()

    return (
        <div className={styles.galleryCard} role="listitem" onClick={() => onClick()} aria-labelledby={titleId}>
            {cover ? <img src={cover} alt={title} /> : <CoverPlaceholder title={title} />}
            <div className={styles.overlay}>
                <span id={titleId} className={styles.title}>
                    {title}
                </span>
            </div>
        </div>
    )
}
