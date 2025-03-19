import { useRef, useState } from 'react'

interface Props {
    type: string
    placeholder: string
    value: string
    onUpdate: (value: string) => void
}

export function Input({ type, placeholder, value, onUpdate }: Props) {
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
            className="bookshelf--ui--input"
            type={type}
            placeholder={placeholder}
            value={value}
            onKeyUp={() => handleUpdate()}
            onChange={() => handleUpdate()}
        />
    )
}
