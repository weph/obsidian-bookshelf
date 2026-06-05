import styles from './group-heading.module.scss'
import { pluralize } from '../../pluralize'

interface Props {
    heading: string
    fallback: boolean
    count: number
}

export function GroupHeading({ heading, fallback, count }: Props) {
    return (
        <div className={`${styles.groupHeading} ${fallback ? styles.fallbackGroup : ''}`}>
            <h2>{heading}</h2>
            <div className={styles.booksInGroup}>{pluralize(count, 'book')}</div>
        </div>
    )
}
