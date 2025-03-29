import styles from './dropdown.module.scss'

export interface DropdownOption<T> {
    value: T
    label: string
}

interface Props<T> {
    label: string
    value: T
    options: Array<DropdownOption<T>>
    onChange: (value: T) => void
    id?: string
    className?: string
}

export function Dropdown<T>({ label, value, options, onChange, id, className }: Props<T>) {
    return (
        <select
            id={id}
            className={`${styles.dropdown} ${className || ''}`}
            onChange={(e) => onChange(options[parseInt(e.target.value)].value)}
            aria-label={label}
            value={options.findIndex((v) => v.value === value)}
        >
            {options.map((o, i) => (
                <option key={i} value={i.toString()}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}
