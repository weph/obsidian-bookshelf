import styles from './cover-placeholder.module.scss'

export interface Props {
    title: string
}

export function CoverPlaceholder({ title }: Props) {
    return (
        <div className={styles.fallbackCover}>
            <span className={styles.title}>{title}</span>
        </div>
    )
}
