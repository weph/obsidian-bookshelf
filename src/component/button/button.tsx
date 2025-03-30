import styles from './button.module.scss'

interface Props {
    text: string
    onClick: () => void
    id?: string
    className?: string
}

export function Button({ text, onClick, id, className }: Props) {
    return (
        <button id={id} className={`${styles.button} ${className || ''}`} onClick={() => onClick()}>
            {text}
        </button>
    )
}
