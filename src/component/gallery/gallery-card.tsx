import styles from './gallery-card.module.scss'

interface Props {
    cover?: string
    title: string
    onClick: () => void
}

export function GalleryCard({ cover, title, onClick }: Props) {
    return (
        <div className={styles.galleryCard} role="listitem" onClick={() => onClick()}>
            {cover ? <img src={cover} alt={title} /> : ''}
            <div className={cover ? styles.overlay : styles.fallbackCover}>
                <span className={styles.title}>{title}</span>
            </div>
        </div>
    )
}
