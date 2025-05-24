import { useRef, useState } from 'react'
import styles from './input.module.scss'

interface Props {
    type: string
    placeholder: string
    value: string
    onUpdate: (value: string) => void
    clearable?: boolean
    error?: boolean
    autoFocus?: boolean
    id?: string
    className?: string
}

export function Input({ type, placeholder, value, onUpdate, clearable, error, autoFocus, id, className }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [currentValue, setCurrentValue] = useState(value)

    function setNewValue(value: string): void {
        setCurrentValue(value)
        onUpdate(value)
    }

    function handleUpdate(): void {
        const newValue = ref.current?.value || ''
        if (newValue !== currentValue) {
            setNewValue(newValue)
        }
    }

    function clear(): void {
        setNewValue('')
    }

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <input
                ref={ref}
                id={id}
                className={`${styles.input} ${clearable && styles.clearable} ${error && styles.error}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onKeyUp={() => handleUpdate()}
                onChange={() => handleUpdate()}
                autoFocus={autoFocus}
            />
            {clearable && value && (
                <div className={styles.clear} onClick={() => clear()} aria-label="Clear search"></div>
            )}
        </div>
    )
}
