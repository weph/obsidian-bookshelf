import styles from './tag.module.scss'

export interface Props {
    value: string
    onClick?: () => void
}

export function Tag({ value, onClick }: Props) {
    const className = onClick ? styles.clickableTag : styles.tag

    return (
        <span className={className} onClick={() => onClick && onClick()}>
            {value}
        </span>
    )
}
