import { Tag } from '../tag/tag'
import styles from './tag-list.module.scss'

export interface Props {
    tags: Array<string>
    className?: string
}

export function TagList({ tags, className }: Props) {
    return (
        <ul className={`${styles.tags} ${className}`}>
            {tags.map((t) => (
                <Tag key={t} value={t} />
            ))}
        </ul>
    )
}
