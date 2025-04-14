import styles from './button.module.scss'

interface Props {
    text: string
    onClick: () => void
    accent?: boolean
    disabled?: boolean
    id?: string
    className?: string
}

export function Button({ text, onClick, accent, disabled, id, className }: Props) {
    const classes = `${styles.button} ${accent ? styles.accent : styles.regular} ${className || ''}`

    return (
        <button id={id} className={classes} onClick={() => onClick()} disabled={disabled}>
            {text}
        </button>
    )
}
