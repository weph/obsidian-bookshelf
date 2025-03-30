import styles from './button.module.scss'

interface Props {
    text: string
    onClick: () => void
}

export function Button({ text, onClick }: Props) {
    return (
        <button className={styles.button} onClick={() => onClick()}>
            {text}
        </button>
    )
}
