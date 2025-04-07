import { useRef, useState } from 'react'
import styles from './input.module.scss'

interface Props {
    type: string
    placeholder: string
    value: string
    onUpdate: (value: string) => void
    error?: boolean
    autoFocus?: boolean
    id?: string
    className?: string
}

export function Input({ type, placeholder, value, onUpdate, error, autoFocus, id, className }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [currentValue, setCurrentValue] = useState(value)

    const handleUpdate = () => {
        const newValue = ref.current?.value || ''
        if (newValue === currentValue) {
            return
        }

        setCurrentValue(newValue)
        onUpdate(newValue)
    }

    return (
        <input
            ref={ref}
            id={id}
            className={`${styles.input} ${error && styles.error} ${className || ''}`}
            type={type}
            placeholder={placeholder}
            value={value}
            onKeyUp={() => handleUpdate()}
            onChange={() => handleUpdate()}
            autoFocus={autoFocus}
        />
    )
}
