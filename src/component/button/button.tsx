import styles from './button.module.scss'

interface Props {
    text: string
    onClick: () => void
    disabled?: boolean
    id?: string
    className?: string
}

export function Button({ text, onClick, disabled, id, className }: Props) {
    return (
        <button id={id} className={`${styles.button} ${className || ''}`} onClick={() => onClick()} disabled={disabled}>
            {text}
        </button>
    )
}
